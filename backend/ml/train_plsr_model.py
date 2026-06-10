"""
PLSR Model Training Script
Trains Partial Least Squares Regression model for SOC (Soil Organic Carbon) prediction
using spectroscopy data. Saves model for inference.
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

def generate_synthetic_training_data(n_samples=150):
    """
    Generate synthetic spectroscopy and SOC data for training.
    Real data would come from field measurements with spectral sensor readings.
    
    Spectral data: Reflectance values across 400-2400 nm wavelengths (typical NIR)
    Output: SOC percentage (0.5 - 8.0 range typical for agricultural soils)
    """
    np.random.seed(42)
    
    # Generate 150 spectral samples (wavelengths 400-2400nm at 16nm intervals = 128 bands)
    n_wavelengths = 128
    spectral_data = np.random.rand(n_samples, n_wavelengths) * 0.8 + 0.1  # Reflectance 0.1-0.9
    
    # Create SOC labels with relationship to spectral patterns
    # Lower reflectance in NIR (1300-2400nm) correlates with higher carbon content
    soc_labels = (
        3.0 +  # Base SOC
        np.random.normal(0, 0.5, n_samples) +  # Random variation
        (1 - np.mean(spectral_data[:, 80:], axis=1)) * 2  # Relationship to NIR reflectance
    ).clip(0.5, 8.0)  # Constrain to realistic range
    
    return spectral_data, soc_labels

def train_plsr_model(spectral_data, soc_labels, n_components=10, test_size=0.2):
    """
    Train PLSR model with cross-validation.
    
    Args:
        spectral_data: Array of shape (n_samples, n_wavelengths)
        soc_labels: Array of shape (n_samples,) - SOC percentages
        n_components: Number of latent variables (typically 5-15 for spectroscopy)
        test_size: Fraction of data to use for testing
    
    Returns:
        model: Trained PLSRegression object
        scaler: StandardScaler for preprocessing
        metrics: Performance metrics dictionary
    """
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        spectral_data, soc_labels, test_size=test_size, random_state=42
    )
    
    # Standardize input features (essential for PLSR)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train PLSR model
    model = PLSRegression(n_components=n_components, max_iter=500)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate on test set
    y_pred_train = model.predict(X_train_scaled).ravel()
    y_pred_test = model.predict(X_test_scaled).ravel()
    
    # Calculate metrics
    metrics = {
        'model_type': 'PLSR',
        'n_components': n_components,
        'n_training_samples': len(X_train),
        'n_test_samples': len(X_test),
        'train_r2': float(r2_score(y_train, y_pred_train)),
        'test_r2': float(r2_score(y_test, y_pred_test)),
        'test_rmse': float(np.sqrt(mean_squared_error(y_test, y_pred_test))),
        'test_mae': float(mean_absolute_error(y_test, y_pred_test)),
        'trained_at': datetime.now().isoformat(),
        'data_description': 'Synthetic spectroscopy data (400-2400nm, 128 bands)',
        'target': 'SOC percentage (0.5-8.0%)',
    }
    
    print("\n" + "="*60)
    print("PLSR MODEL TRAINING COMPLETE")
    print("="*60)
    print(f"Model: {metrics['model_type']}")
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

def save_model(model, scaler, metrics, model_name='plsr_soc_model.pkl'):
    """Save trained model and scaler to disk."""
    model_path = os.path.join('models', model_name)
    scaler_path = os.path.join('models', 'plsr_scaler.pkl')
    metrics_path = os.path.join('models', 'plsr_metrics.json')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✓ Model saved to {model_path}")
    print(f"✓ Scaler saved to {scaler_path}")
    print(f"✓ Metrics saved to {metrics_path}\n")

if __name__ == '__main__':
    print("\n🌿 AgroGreenBits PLSR Model Training\n")
    
    # Generate training data
    print("Generating synthetic spectroscopy training data...")
    spectral_data, soc_labels = generate_synthetic_training_data(n_samples=150)
    print(f"✓ Generated {len(spectral_data)} samples with {spectral_data.shape[1]} spectral bands\n")
    
    # Train model
    print("Training PLSR model with 10 latent variables...")
    model, scaler, metrics = train_plsr_model(spectral_data, soc_labels, n_components=10)
    
    # Save model
    print("Saving model artifacts...")
    save_model(model, scaler, metrics)
    
    print("✅ PLSR model ready for inference!")
