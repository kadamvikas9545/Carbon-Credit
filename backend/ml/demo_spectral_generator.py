"""
Demo Spectral Data Generator
Generates realistic AS7341 spectral readings for testing
without requiring physical hardware
"""

import numpy as np
import json
from datetime import datetime

class DemoSpectralGenerator:
    """Generate realistic soil spectral readings"""
    
    # AS7341 wavelengths
    WAVELENGTHS = {
        'F1': 410,   'F2': 440,   'F3': 470,   'F4': 510,
        'F5': 550,   'F6': 590,   'F7': 630,   'F8': 680,
        'NIR1': 700, 'NIR2': 850, 'NIR3': 940
    }
    
    # Different soil types with characteristic spectra
    SOIL_TYPES = {
        'low_soc': {
            'description': 'Low organic matter (sandy, depleted)',
            'soc_range': (0.3, 1.2),
            'vis_reflectance': (0.20, 0.30),  # Higher visible reflectance
            'nir_reflectance': (0.25, 0.35),
        },
        'medium_soc': {
            'description': 'Medium organic matter (typical farm soil)',
            'soc_range': (1.5, 2.5),
            'vis_reflectance': (0.10, 0.18),
            'nir_reflectance': (0.35, 0.45),
        },
        'high_soc': {
            'description': 'High organic matter (premium soil)',
            'soc_range': (3.0, 4.5),
            'vis_reflectance': (0.05, 0.12),
            'nir_reflectance': (0.40, 0.50),
        }
    }
    
    @staticmethod
    def generate_reflectance(soil_type='medium_soc', noise=True):
        """
        Generate 11 realistic spectral reflectance values
        Returns reflectance at each wavelength (0.0-1.0)
        """
        if soil_type not in DemoSpectralGenerator.SOIL_TYPES:
            soil_type = 'medium_soc'
        
        soil_spec = DemoSpectralGenerator.SOIL_TYPES[soil_type]
        
        # Generate reflectance pattern
        reflectance = {}
        
        # Visible range (410-680 nm) - lower reflectance
        vis_ref = np.random.uniform(
            soil_spec['vis_reflectance'][0],
            soil_spec['vis_reflectance'][1]
        )
        
        for band in ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8']:
            wl = DemoSpectralGenerator.WAVELENGTHS[band]
            # Increase reflectance from blue (410nm) to red (680nm)
            reflectance[band] = vis_ref * (0.7 + (wl - 410) / 270 * 0.3)
        
        # NIR range (700-940 nm) - higher reflectance
        nir_ref = np.random.uniform(
            soil_spec['nir_reflectance'][0],
            soil_spec['nir_reflectance'][1]
        )
        
        reflectance['NIR1'] = nir_ref * 0.95  # 700 nm
        reflectance['NIR2'] = nir_ref         # 850 nm (peak)
        reflectance['NIR3'] = nir_ref * 0.90  # 940 nm
        
        # Add realistic noise
        if noise:
            for key in reflectance:
                noise_level = np.random.normal(0, 0.01)  # ±1% noise
                reflectance[key] = max(0.01, min(0.5, reflectance[key] + noise_level))
        
        return reflectance, soil_spec['soc_range']
    
    @staticmethod
    def generate_demo_reading(soil_type='medium_soc', farm_id='demo_farm'):
        """
        Generate complete demo spectral reading
        Returns 11-band data ready for API
        """
        reflectance, soc_range = DemoSpectralGenerator.generate_reflectance(soil_type)
        
        # Convert to 11-element array in standard order
        bands_list = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'NIR1', 'NIR2', 'NIR3']
        spectral_bands = [reflectance[band] for band in bands_list]
        
        # Expected SOC from model (for reference)
        expected_soc = np.random.uniform(soc_range[0], soc_range[1])
        
        return {
            'spectralBands': spectral_bands,
            'farmId': farm_id,
            'soilType': soil_type,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'metadata': {
                'source': 'demo_generator',
                'description': DemoSpectralGenerator.SOIL_TYPES[soil_type]['description'],
                'expected_soc_range': soc_range
            }
        }
    
    @staticmethod
    def generate_multiple_readings(count=5, farm_id='demo_farm'):
        """Generate multiple readings with varying soil types"""
        readings = []
        soil_types = list(DemoSpectralGenerator.SOIL_TYPES.keys())
        
        for i in range(count):
            soil_type = soil_types[i % len(soil_types)]
            reading = DemoSpectralGenerator.generate_demo_reading(
                soil_type=soil_type,
                farm_id=f"{farm_id}_{i+1}"
            )
            readings.append(reading)
        
        return readings


# Test the generator
if __name__ == '__main__':
    print("=" * 60)
    print("DEMO SPECTRAL DATA GENERATOR")
    print("=" * 60)
    
    print("\n📊 Soil Types Available:")
    for soil_type, spec in DemoSpectralGenerator.SOIL_TYPES.items():
        print(f"  • {soil_type}: {spec['description']}")
        print(f"    SOC Range: {spec['soc_range'][0]:.1f}% - {spec['soc_range'][1]:.1f}%")
    
    print("\n" + "=" * 60)
    print("SAMPLE READINGS")
    print("=" * 60)
    
    # Generate sample readings
    for soil_type in DemoSpectralGenerator.SOIL_TYPES.keys():
        reading = DemoSpectralGenerator.generate_demo_reading(soil_type=soil_type)
        print(f"\n{soil_type}:")
        print(f"  Spectral Bands: {[f'{x:.2f}' for x in reading['spectralBands']]}")
        print(f"  Farm: {reading['farmId']}")
        print(f"  Expected SOC: {reading['metadata']['expected_soc_range'][0]:.1f}% - {reading['metadata']['expected_soc_range'][1]:.1f}%")
    
    print("\n✅ Generator ready for testing!")
