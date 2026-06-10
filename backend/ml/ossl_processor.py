"""
OSSL Data Processor
Extracts 11 AS7341 wavelength bands + SOC from OSSL dataset
Prepares data for PLSR model training
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import json
import os
from pathlib import Path

class OSLLProcessor:
    def __init__(self, data_dir='ossl_data', output_dir='models'):
        self.data_dir = data_dir
        self.output_dir = output_dir
        Path(output_dir).mkdir(exist_ok=True)
        
        # AS7341 wavelengths (nm) - exact match with sensor
        self.as7341_bands = {
            'F1': 410,
            'F2': 440,
            'F3': 470,
            'F4': 510,
            'F5': 550,
            'F6': 590,
            'F7': 630,
            'F8': 680,
            'NIR1': 700,
            'NIR2': 850,
            'NIR3': 940
        }
        
        self.scaler = StandardScaler()
    
    def find_wavelength_column(self, df, target_wavelength, tolerance=20):
        """
        Find closest matching wavelength column in OSSL data
        OSSL might have 405, 410.5, etc. - we find the closest
        """
        wavelength_cols = [col for col in df.columns if 'reflectance_' in col]
        
        if not wavelength_cols:
            # Try alternative naming conventions
            wavelength_cols = [col for col in df.columns if any(c.isdigit() for c in col)]
        
        if not wavelength_cols:
            return None
        
        # Extract wavelength values from column names
        wavelengths = []
        for col in wavelength_cols:
            try:
                # Extract number from column name (e.g., 'reflectance_410' -> 410)
                wl = float(''.join(filter(lambda x: x.isdigit() or x == '.', col.split('_')[-1])))
                wavelengths.append((wl, col))
            except:
                continue
        
        if not wavelengths:
            return None
        
        # Find closest wavelength within tolerance
        wavelengths.sort(key=lambda x: abs(x[0] - target_wavelength))
        closest_wl, closest_col = wavelengths[0]
        
        if abs(closest_wl - target_wavelength) <= tolerance:
            print(f"  {target_wavelength} nm → {closest_col} ({closest_wl} nm) ✓")
            return closest_col
        else:
            print(f"  {target_wavelength} nm → No close match found (closest: {closest_wl} nm)")
            return None
    
    def process_ossl_data(self, csv_file):
        """
        Extract 11 AS7341 bands + SOC from OSSL CSV
        Returns: (spectral_data, soc_values, scaler, metadata)
        """
        print("\n📊 Processing OSSL Data...")
        print(f"Loading: {csv_file}")
        
        # Load data
        df = pd.read_csv(csv_file)
        print(f"✅ Loaded {len(df)} samples")
        print(f"Columns: {list(df.columns[:10])}...")
        
        # Extract spectral bands for AS7341
        print("\n🔍 Mapping AS7341 wavelengths to OSSL columns:")
        spectral_columns = []
        for band_name, wavelength in self.as7341_bands.items():
            col = self.find_wavelength_column(df, wavelength)
            if col:
                spectral_columns.append(col)
            else:
                print(f"  ⚠️ Band {band_name} ({wavelength} nm) not found")
        
        if len(spectral_columns) < 11:
            print(f"\n⚠️ Warning: Only found {len(spectral_columns)}/11 bands")
        
        # Extract spectral data
        print(f"\n✂️ Extracting {len(spectral_columns)} spectral bands...")
        X = df[spectral_columns].values
        
        # Remove NaN values
        valid_idx = ~np.isnan(X).any(axis=1)
        X = X[valid_idx]
        print(f"✅ Valid samples after removing NaN: {len(X)}")
        
        # Extract SOC values
        if 'SOC_percent' in df.columns:
            y = df.loc[valid_idx, 'SOC_percent'].values
        elif 'soc' in df.columns:
            y = df.loc[valid_idx, 'soc'].values
        else:
            print("❌ SOC column not found!")
            y = df.loc[valid_idx, df.columns[-1]].values
        
        # Remove infinite values
        valid_soc = ~np.isinf(y)
        X = X[valid_soc]
        y = y[valid_soc]
        print(f"✅ Valid SOC values: {len(y)}")
        
        # Statistics
        print(f"\n📈 Data Statistics:")
        print(f"   SOC range: {y.min():.3f}% - {y.max():.3f}%")
        print(f"   SOC mean: {y.mean():.3f}% ± {y.std():.3f}%")
        print(f"   Reflectance range: {X.min():.3f} - {X.max():.3f}")
        
        # Normalize spectral data
        print(f"\n⚙️ Normalizing spectral data...")
        X_scaled = self.scaler.fit_transform(X)
        
        # Metadata
        metadata = {
            'n_samples': len(X),
            'n_bands': len(spectral_columns),
            'wavelengths': [self.as7341_bands[name] for name in self.as7341_bands.keys()],
            'soc_stats': {
                'min': float(y.min()),
                'max': float(y.max()),
                'mean': float(y.mean()),
                'std': float(y.std())
            },
            'scaler_mean': self.scaler.mean_.tolist(),
            'scaler_scale': self.scaler.scale_.tolist(),
            'source': 'OSSL'
        }
        
        return X_scaled, y, self.scaler, metadata
    
    def save_training_data(self, X_scaled, y, scaler, metadata, prefix='plsr_ossl'):
        """Save processed data for training"""
        print(f"\n💾 Saving training data...")
        
        # Save spectral data
        X_file = os.path.join(self.output_dir, f'{prefix}_X.npy')
        np.save(X_file, X_scaled)
        print(f"✅ Saved spectral data: {X_file}")
        
        # Save SOC values
        y_file = os.path.join(self.output_dir, f'{prefix}_y.npy')
        np.save(y_file, y)
        print(f"✅ Saved SOC values: {y_file}")
        
        # Save metadata
        meta_file = os.path.join(self.output_dir, f'{prefix}_metadata.json')
        with open(meta_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"✅ Saved metadata: {meta_file}")
        
        return X_file, y_file, meta_file


def process_ossl():
    """Main function to process OSSL data"""
    from ossl_downloader import download_ossl_data
    
    # Download data
    print("=" * 60)
    print("OSSL DATA PROCESSING PIPELINE")
    print("=" * 60)
    
    data_path = download_ossl_data()
    
    # Process data
    processor = OSLLProcessor()
    X_scaled, y, scaler, metadata = processor.process_ossl_data(data_path)
    
    # Save
    processor.save_training_data(X_scaled, y, scaler, metadata)
    
    print("\n" + "=" * 60)
    print("✅ PROCESSING COMPLETE")
    print("=" * 60)
    print(f"Ready for PLSR training with {len(X_scaled)} samples")
    
    return X_scaled, y, scaler, metadata


if __name__ == '__main__':
    X_scaled, y, scaler, metadata = process_ossl()
