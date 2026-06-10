"""
AS7341 PLSR Model Training Script
Optimized for AMS AS7341 11-channel spectral sensor
Trains on 11 spectral bands matching AS7341 output
"""

import numpy as np
import pandas as pd
import joblib
from sklearn.cross_decomposition import PLSRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import os
import json
from datetime import datetime

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

# AS7341 Channel Information
AS7341_CHANNELS = {
    'ch1': 410,    # Violet
    'ch2': 440,    # Blue
    'ch3': 470,    # Blue-Green
    'ch4': 510,    # Green
    'ch5': 550,    # Green-Yellow
    'ch6': 590,    # Yellow
    'ch7': 630,    # Orange
    'ch8': 680,    # Red
    'ch9': 730,    # Red-IR
    'ch10': 850,   # NIR
    'ch11': 940    # NIR
}

AS7341_WAVELENGTHS = list(AS7341_CHANNELS.values())

def generate_as7341_training_data(n_samples=200):
    """
    Generate synthetic AS7341 spectral data with realistic SOC relationships.
    
    Real AS7341 bands most correlated with SOC:
    - 730nm (Red-NIR): Sensitive to organic matter
    - 850nm (NIR): Water and carbon absorption
    - 940nm (NIR): Moisture and organic carbon
    
    Args:
        n_samples: Number of training samples
    
    Returns:
        spectral_data: Array of shape (n_samples, 11) - reflectance per AS7341 channel
        soc_labels: Array of shape (n_samples,) - SOC percentages
    """
    np.random.seed(42)
    
    # Generate 11-dimensional spectral data (AS7341 channels)
    spectral_data = np.random.rand(n_samples, 11) * 0.8 + 0.1
    
    # Simulate realistic spectral patterns
    # Low reflectance in NIR (730, 850, 940) correlates with high carbon
    nir_bands = [8, 9, 10]  # Indices for 730, 850, 940 nm
    nir_reflectance = np.mean(spectral_data[:, nir_bands], axis=1)
    
    # Create SOC relationship with NIR absorption
    # Lower NIR reflectance = higher SOC
    soc_labels = (
        4.0 +  # Base SOC
        np.random.normal(0, 0.6, n_samples) +  # Random variation
        (1 - nir_reflectance) * 2.5  # NIR relationship
    ).clip(0.5, 8.0)  # Constrain to realistic range
    
    return spectral_data, soc_labels, AS7341_WAVELENGTHS

def train_as7341_plsr_model(spectral_data, soc_labels, n_components=6, test_size=0.2):
    """
    Train PLSR model optimized for AS7341 11-channel data.
    
    Note: With only 11 input features, fewer latent variables recommended (6 vs 10)
    
    Args:
        spectral_data: Array of shape (n_samples, 11)
        soc_labels: Array of SOC percentages
        n_components: Number of latent variables (6 optimal for 11 features)
        test_size: Fraction for test set
    
    Returns:
        model, scaler, metrics
    """
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        spectral_data, soc_labels, test_size=test_size, random_state=42
    )
    
    # Standardize
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train PLSR
    model = PLSRegression(n_components=n_components, max_iter=500)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred_train = model.predict(X_train_scaled).ravel()
    y_pred_test = model.predict(X_test_scaled).ravel()
    
    metrics = {
        'model_type': 'PLSR (AS7341 Optimized)',
        'sensor': 'AMS AS7341',
        'n_channels': 11,
        'wavelengths_nm': AS7341_WAVELENGTHS,
        'n_components': n_components,
        'n_training_samples': len(X_train),
        'n_test_samples': len(X_test),
        'train_r2': float(r2_score(y_train, y_pred_train)),
        'test_r2': float(r2_score(y_test, y_pred_test)),
        'test_rmse': float(np.sqrt(mean_squared_error(y_test, y_pred_test))),
        'test_mae': float(mean_absolute_error(y_test, y_pred_test)),
        'trained_at': datetime.now().isoformat(),
        'data_description': 'AS7341 11-channel spectral data (350-1000nm)',
        'target': 'SOC percentage (0.5-8.0%)',
        'nir_bands': [730, 850, 940],
        'soc_relationship': 'Lower NIR reflectance = Higher SOC'
    }
    
    print("\n" + "="*60)
    print("AS7341 PLSR MODEL TRAINING COMPLETE")
    print("="*60)
    print(f"Sensor: {metrics['sensor']}")
    print(f"Spectral Channels: {metrics['n_channels']}")
    print(f"Wavelengths: {', '.join(map(str, AS7341_WAVELENGTHS))} nm")
    print(f"Latent Variables: {metrics['n_components']}")
    print(f"Training Samples: {metrics['n_training_samples']}")
    print(f"Test Samples: {metrics['n_test_samples']}")
    print(f"\nPerformance Metrics:")
    print(f"  Training R²: {metrics['train_r2']:.4f}")
    print(f"  Test R²:     {metrics['test_r2']:.4f}")
    print(f"  Test RMSE:   {metrics['test_rmse']:.4f}%")
    print(f"  Test MAE:    {metrics['test_mae']:.4f}%")
    print("="*60 + "\n")
    
    return model, scaler, metrics

def save_model(model, scaler, metrics, model_name='plsr_as7341_soc_model.pkl'):
    """Save trained model and metadata."""
    model_path = os.path.join('models', model_name)
    scaler_path = os.path.join('models', 'plsr_as7341_scaler.pkl')
    metrics_path = os.path.join('models', 'plsr_as7341_metrics.json')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✓ Model saved to {model_path}")
    print(f"✓ Scaler saved to {scaler_path}")
    print(f"✓ Metrics saved to {metrics_path}\n")

def create_as7341_integration_guide():
    """Create Arduino/ESP32 integration guide for AS7341."""
    guide = """
# AS7341 ESP32 Integration Guide

## Hardware Setup

### Wiring (AS7341 to ESP32)
- AS7341 SDA → ESP32 GPIO 21 (or custom SDA pin)
- AS7341 SCL → ESP32 GPIO 22 (or custom SCL pin)
- AS7341 VCC → ESP32 3.3V
- AS7341 GND → ESP32 GND

## Arduino Code Example

```cpp
#include <Wire.h>
#include <AS7341.h>

AS7341 as7341;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  
  if (!as7341.begin()) {
    Serial.println("AS7341 not found!");
    while (1);
  }
  
  // Configure AS7341
  as7341.setGain(AS7341_GAIN_512X);
  as7341.setIntTime(100);  // Integration time: 100ms
  as7341.enableSpectralMeasurement(true);
  
  Serial.println("AS7341 initialized");
}

void loop() {
  // Read 11-channel spectral data
  if (as7341.readSpectralData()) {
    // Get reflectance values (0-1 range)
    float data[11];
    data[0] = as7341.ch1 / 65535.0;  // 410nm
    data[1] = as7341.ch2 / 65535.0;  // 440nm
    data[2] = as7341.ch3 / 65535.0;  // 470nm
    data[3] = as7341.ch4 / 65535.0;  // 510nm
    data[4] = as7341.ch5 / 65535.0;  // 550nm
    data[5] = as7341.ch6 / 65535.0;  // 590nm
    data[6] = as7341.ch7 / 65535.0;  // 630nm
    data[7] = as7341.ch8 / 65535.0;  // 680nm
    data[8] = as7341.ch9 / 65535.0;  // 730nm (Red-IR)
    data[9] = as7341.ch10 / 65535.0; // 850nm (NIR)
    data[10] = as7341.ch11 / 65535.0;// 940nm (NIR)
    
    // Send JSON to backend
    sendToBackend(data);
    
    delay(5000);  // Read every 5 seconds
  }
}

void sendToBackend(float data[11]) {
  // HTTP POST to http://your-server:5000/api/predict
  // With JSON body containing spectral_data array
}
```

## Libraries Required
```
- Adafruit_AS7341
- ArduinoJson
- WiFi (for ESP32)
- HTTPClient (for ESP32)
```

## Expected Output from PLSR

For AS7341 sensor data:
- Input: 11 reflectance values (410-940nm)
- Output: SOC percentage
- Confidence: R² score from model
"""
    
    with open('AS7341_INTEGRATION.md', 'w') as f:
        f.write(guide)
    
    print("✓ AS7341 integration guide created: AS7341_INTEGRATION.md\n")

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🌿 AgroGreenBits AS7341 PLSR Model Training")
    print("="*60 + "\n")
    
    # Generate AS7341-format training data
    print("Generating synthetic AS7341 spectral data...")
    spectral_data, soc_labels, wavelengths = generate_as7341_training_data(n_samples=200)
    print(f"✓ Generated {len(spectral_data)} samples")
    print(f"✓ Spectral channels: {len(wavelengths)} (matching AS7341)")
    print(f"✓ Wavelengths: {wavelengths} nm\n")
    
    # Train model
    print("Training PLSR model optimized for AS7341...")
    model, scaler, metrics = train_as7341_plsr_model(spectral_data, soc_labels, n_components=6)
    
    # Save
    print("Saving model artifacts...")
    save_model(model, scaler, metrics)
    
    # Create integration guide
    create_as7341_integration_guide()
    
    print("✅ AS7341 PLSR model ready for inference!")
