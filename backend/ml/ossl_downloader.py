"""
OSSL (Open Soil Spectral Library) Data Downloader
Downloads spectral data and SOC measurements from OSSL
"""

import os
import requests
import pandas as pd
import numpy as np
from pathlib import Path
import json

class OSLLDownloader:
    def __init__(self, output_dir='ossl_data'):
        self.output_dir = output_dir
        Path(output_dir).mkdir(exist_ok=True)
        
        # OSSL public data source
        self.ossl_url = "https://ncsslabdatamart.sc.egov.usda.gov/webapi/v1/downloads/ossl0"
    
    def download_sample_data(self):
        """
        Download OSSL sample data (50K samples for quick start)
        Falls back to synthetic data if API unavailable
        """
        print("📥 Downloading OSSL Sample Data...")
        
        try:
            # OSSL provides CSV exports
            # For quick implementation, we'll use a pre-aggregated sample URL
            url = "https://ncsslabdatamart.sc.egov.usda.gov/webapi/v1/downloads/ossl0/ossl_all_L0_v1.2.1_nircam_nd_nir.csv"
            
            print(f"Fetching from: {url}")
            response = requests.get(url, timeout=30)
            
            if response.status_code == 200:
                filepath = os.path.join(self.output_dir, 'ossl_data.csv')
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Downloaded: {filepath}")
                return filepath
            else:
                print(f"⚠️ API returned {response.status_code}")
                return self._create_synthetic_ossl()
                
        except Exception as e:
            print(f"❌ Download failed: {e}")
            print("Creating synthetic OSSL-like dataset for demo...")
            return self._create_synthetic_ossl()
    
    def _create_synthetic_ossl(self):
        """
        Create synthetic OSSL-like dataset for immediate testing
        Based on known OSSL spectral patterns
        """
        print("🔄 Generating synthetic OSSL dataset (50K samples)...")
        
        np.random.seed(42)
        
        # AS7341 wavelengths (nm)
        wavelengths = [410, 440, 470, 510, 550, 590, 630, 680, 700, 850, 940]
        
        # Generate 50K samples with realistic soil spectral patterns
        n_samples = 50000
        
        data = {
            'sample_id': [f'SYNTHETIC_OSSL_{i:06d}' for i in range(n_samples)],
        }
        
        # Realistic reflectance patterns based on vegetation indices
        # NDVI generally ranges from -1 to 1, but normalized reflectance 0-1
        for i, wl in enumerate(wavelengths):
            if wl < 700:  # Visible range - lower reflectance
                reflectance = 0.05 + np.random.normal(0.08, 0.05, n_samples)
                reflectance = np.clip(reflectance, 0.01, 0.15)
                data[f'reflectance_{wl}'] = reflectance
            elif wl == 700:  # Red edge - transition
                reflectance = 0.20 + np.random.normal(0.15, 0.08, n_samples)
                reflectance = np.clip(reflectance, 0.10, 0.40)
                data[f'reflectance_{wl}'] = reflectance
            else:  # NIR range - higher reflectance
                reflectance = 0.30 + np.random.normal(0.15, 0.10, n_samples)
                reflectance = np.clip(reflectance, 0.20, 0.50)
                data[f'reflectance_{wl}'] = reflectance
        
        # SOC values (typical range 0.5% to 5%)
        # Higher reflectance in NIR usually correlates with lower SOC
        nir_avg = (data['reflectance_850'] + data['reflectance_940']) / 2
        soc_values = 5.0 - (nir_avg * 8.0) + np.random.normal(0, 0.5, n_samples)
        soc_values = np.clip(soc_values, 0.3, 6.0)
        data['SOC_percent'] = soc_values
        
        # Additional soil properties (for reference)
        data['clay_percent'] = np.random.uniform(5, 60, n_samples)
        data['sand_percent'] = np.random.uniform(10, 80, n_samples)
        data['pH'] = np.random.normal(7.0, 1.5, n_samples)
        data['bulk_density'] = np.random.uniform(1.0, 1.7, n_samples)
        
        df = pd.DataFrame(data)
        
        filepath = os.path.join(self.output_dir, 'ossl_synthetic.csv')
        df.to_csv(filepath, index=False)
        
        print(f"✅ Created synthetic dataset: {filepath}")
        print(f"   Samples: {len(df)}")
        print(f"   SOC range: {soc_values.min():.2f}% - {soc_values.max():.2f}%")
        print(f"   Spectral bands: {len(wavelengths)}")
        
        return filepath


def download_ossl_data():
    """Main function to download OSSL data"""
    downloader = OSLLDownloader()
    data_path = downloader.download_sample_data()
    return data_path


if __name__ == '__main__':
    data_path = download_ossl_data()
    print(f"\n✅ Data ready at: {data_path}")
