"""
Train PLSR Model with OSSL Real Soil Data
Produces production-grade model for carbon credit SOC prediction
"""

import numpy as np
import pandas as pd
from sklearn.cross_decomposition import PLSRegression
from sklearn.model_selection import cross_val_score, KFold
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import json
import os
from pathlib import Path

class PLSRTrainer:
    def __init__(self, n_components=6, output_dir='models'):
        self.n_components = n_components
        self.output_dir = output_dir
        Path(output_dir).mkdir(exist_ok=True)
        self.model = None
    
    def train(self, X, y, test_size=0.2):
        """
        Train PLSR model with cross-validation
        X: Spectral data (n_samples, n_bands=11)
        y: SOC values (n_samples,)
        """
        print("\n" + "=" * 60)
        print("PLSR MODEL TRAINING")
        print("=" * 60)
        
        print(f"\n📊 Training Data:")
        print(f"   Samples: {len(X)}")
        print(f"   Spectral bands: {X.shape[1]}")
        print(f"   Components: {self.n_components}")
        print(f"   SOC range: {y.min():.3f}% - {y.max():.3f}%")
        
        # Split data
        split_idx = int(len(X) * (1 - test_size))
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        print(f"\n📂 Data Split:")
        print(f"   Training samples: {len(X_train)}")
        print(f"   Test samples: {len(X_test)}")
        
        # Train model
        print(f"\n🔧 Training PLSR...")
        self.model = PLSRegression(n_components=self.n_components, max_iter=500)
        self.model.fit(X_train, y_train)
        print(f"✅ Model trained")
        
        # Predictions
        y_train_pred = self.model.predict(X_train).flatten()
        y_test_pred = self.model.predict(X_test).flatten()
        
        # Metrics
        train_r2 = r2_score(y_train, y_train_pred)
        test_r2 = r2_score(y_test, y_test_pred)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
        test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
        train_mae = mean_absolute_error(y_train, y_train_pred)
        test_mae = mean_absolute_error(y_test, y_test_pred)
        
        print(f"\n📈 Training Metrics:")
        print(f"   R² Score: {train_r2:.4f}")
        print(f"   RMSE: {train_rmse:.4f}%")
        print(f"   MAE: {train_mae:.4f}%")
        
        print(f"\n📊 Test Metrics:")
        print(f"   R² Score: {test_r2:.4f}")
        print(f"   RMSE: {test_rmse:.4f}%")
        print(f"   MAE: {test_mae:.4f}%")
        
        # Cross-validation
        print(f"\n🔄 Cross-Validation (5-fold)...")
        kfold = KFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(self.model, X, y, cv=kfold, scoring='r2')
        print(f"   CV R² Scores: {cv_scores}")
        print(f"   Mean CV R²: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
        
        # Store metrics
        metrics = {
            'n_samples': len(X),
            'n_components': self.n_components,
            'n_bands': X.shape[1],
            'train_r2': float(train_r2),
            'test_r2': float(test_r2),
            'train_rmse': float(train_rmse),
            'test_rmse': float(test_rmse),
            'train_mae': float(train_mae),
            'test_mae': float(test_mae),
            'cv_r2_mean': float(cv_scores.mean()),
            'cv_r2_std': float(cv_scores.std()),
            'cv_r2_scores': cv_scores.tolist(),
            'training_soc_mean': float(y_train.mean()),
            'training_soc_std': float(y_train.std()),
            'test_soc_mean': float(y_test.mean()),
            'test_soc_std': float(y_test.std()),
            'source': 'OSSL'
        }
        
        return self.model, metrics, (X_train, y_train), (X_test, y_test)
    
    def save_model(self, model, metrics, model_name='plsr_ossl'):
        """Save trained model and metrics"""
        print(f"\n💾 Saving Model...")
        
        # Save model
        model_file = os.path.join(self.output_dir, f'{model_name}_model.pkl')
        joblib.dump(model, model_file)
        print(f"✅ Model saved: {model_file}")
        
        # Save metrics
        metrics_file = os.path.join(self.output_dir, f'{model_name}_metrics.json')
        with open(metrics_file, 'w') as f:
            json.dump(metrics, f, indent=2)
        print(f"✅ Metrics saved: {metrics_file}")
        
        return model_file, metrics_file
    
    def test_prediction(self, model, X_test, y_test, n_samples=5):
        """Test model with sample predictions"""
        print(f"\n🧪 Sample Predictions (first {n_samples} test samples):")
        print("\n{:<8} {:<15} {:<15} {:<10}".format("Sample", "Predicted SOC", "Actual SOC", "Error"))
        print("-" * 50)
        
        y_pred = model.predict(X_test[:n_samples]).flatten()
        for i in range(n_samples):
            error = abs(y_pred[i] - y_test[i])
            print("{:<8} {:<15.3f} {:<15.3f} {:<10.3f}%".format(
                f"#{i+1}", y_pred[i], y_test[i], error
            ))


def train_plsr_ossl():
    """Main function to train PLSR with OSSL data"""
    from ossl_processor import process_ossl
    
    print("=" * 60)
    print("PLSR TRAINING PIPELINE (OSSL DATA)")
    print("=" * 60)
    
    # Step 1: Process OSSL data
    X_scaled, y, scaler, metadata = process_ossl()
    
    # Step 2: Train model
    trainer = PLSRTrainer(n_components=6)
    model, metrics, (X_train, y_train), (X_test, y_test) = trainer.train(X_scaled, y)
    
    # Step 3: Save model
    model_file, metrics_file = trainer.save_model(model, metrics)
    
    # Step 4: Test predictions
    trainer.test_prediction(model, X_test, y_test, n_samples=5)
    
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETE")
    print("=" * 60)
    print(f"Model: {model_file}")
    print(f"Metrics: {metrics_file}")
    print(f"\n📊 Ready for deployment!")
    print(f"Test R²: {metrics['test_r2']:.4f}")
    print(f"Test RMSE: {metrics['test_rmse']:.4f}%")
    
    return model, metrics, model_file


if __name__ == '__main__':
    model, metrics, model_file = train_plsr_ossl()
