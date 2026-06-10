"""
Updated PLSR Flask Service
Supports both OSSL-trained and AS7341 models
Receives spectral data → predicts SOC → returns carbon credits
"""

from flask import Flask, request, jsonify
import numpy as np
import joblib
import json
import os
from pathlib import Path

app = Flask(__name__)

# Model configuration
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
MODEL_NAME_OSSL = 'plsr_ossl_model.pkl'
MODEL_NAME_AS7341 = 'plsr_as7341_soc_model.pkl'

# Global state
model_info = {}
model = None
scaler = None

def load_model():
    """
    Load best available model
    Priority: OSSL > AS7341
    """
    global model, scaler, model_info
    
    print("\n🔍 Looking for PLSR models...")
    
    # Try OSSL model first
    ossl_model_path = os.path.join(MODEL_DIR, MODEL_NAME_OSSL)
    if os.path.exists(ossl_model_path):
        try:
            model = joblib.load(ossl_model_path)
            
            # Load metrics
            metrics_path = os.path.join(MODEL_DIR, 'plsr_ossl_metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    model_info = json.load(f)
                    # Ensure source field exists
                    if 'source' not in model_info:
                        model_info['source'] = 'OSSL'
            
            print(f"✅ Loaded OSSL model")
            print(f"   R² Score: {model_info.get('test_r2', 'N/A')}")
            print(f"   RMSE: {model_info.get('test_rmse', 'N/A')}%")
            print(f"   Samples: {model_info.get('n_samples', 'N/A')}")
            
            return 'ossl'
        except Exception as e:
            print(f"❌ Failed to load OSSL model: {e}")
            model = None
    
    # Fallback to AS7341 model
    as7341_model_path = os.path.join(MODEL_DIR, MODEL_NAME_AS7341)
    if os.path.exists(as7341_model_path):
        try:
            model = joblib.load(as7341_model_path)
            
            # Load metrics
            metrics_path = os.path.join(MODEL_DIR, 'plsr_as7341_metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    model_info = json.load(f)
                    # Normalize metrics structure
                    if 'source' not in model_info:
                        model_info['source'] = model_info.get('model_type', 'AS7341')
                    if 'n_samples' not in model_info:
                        model_info['n_samples'] = model_info.get('n_training_samples', 0)
            
            print(f"✅ Loaded AS7341 model (fallback)")
            print(f"   R² Score: {model_info.get('test_r2', 'N/A')}")
            print(f"   RMSE: {model_info.get('test_rmse', 'N/A')}%")
            
            return 'as7341'
        except Exception as e:
            print(f"❌ Failed to load AS7341 model: {e}")
            model = None
    
    print("❌ No PLSR model found!")
    return None


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'PLSR SOC Prediction Service',
        'model_loaded': model is not None,
        'model_type': model_info.get('source', 'unknown')
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict SOC from spectral data
    
    Input JSON:
    {
        "spectralBands": [0.15, 0.18, 0.20, ..., 0.38],  // 11 values
        "farmId": "optional_farm_id"
    }
    
    Output JSON:
    {
        "success": true,
        "soc_percent": 2.45,
        "confidence": 0.89,
        "model_type": "OSSL",
        "timestamp": "2026-04-04T10:30:00Z"
    }
    """
    try:
        if not model:
            return jsonify({
                'success': False,
                'message': 'Model not loaded'
            }), 500
        
        data = request.get_json()
        
        # Validate input
        if not data or 'spectralBands' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing spectralBands in request'
            }), 400
        
        spectral_data = data.get('spectralBands')
        farm_id = data.get('farmId', 'unknown')
        
        # Validate spectral data
        if not isinstance(spectral_data, list) or len(spectral_data) != 11:
            return jsonify({
                'success': False,
                'message': f'Expected 11 spectral bands, got {len(spectral_data)}'
            }), 400
        
        # Convert to numpy array
        X = np.array(spectral_data).reshape(1, -1)
        
        # Predict
        soc_prediction = model.predict(X)[0][0] if len(model.predict(X).shape) > 1 else model.predict(X)[0]
        
        # Validate prediction
        if np.isnan(soc_prediction) or np.isinf(soc_prediction):
            soc_prediction = model_info.get('test_soc_mean', 2.5)
        
        # Confidence based on model R²
        confidence = max(0, model_info.get('test_r2', 0.5))
        confidence = min(1.0, confidence)  # Cap at 1.0
        
        # Response
        response = {
            'success': True,
            'soc_percent': float(soc_prediction),
            'soc_percent_rounded': round(float(soc_prediction), 2),
            'confidence': float(confidence),
            'model_type': model_info.get('source', 'unknown'),
            'model_rmse': model_info.get('test_rmse', 'N/A'),
            'farmId': farm_id
        }
        
        print(f"✅ Prediction: Farm {farm_id} → SOC: {soc_prediction:.2f}% (±{model_info.get('test_rmse', 0):.2f}%)")
        
        return jsonify(response)
    
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({
            'success': False,
            'message': f'Prediction failed: {str(e)}'
        }), 500


@app.route('/metrics', methods=['GET'])
def metrics():
    """Get model performance metrics"""
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_type': model_info.get('source', 'unknown'),
        'n_components': model_info.get('n_components', 'N/A'),
        'n_samples_trained': model_info.get('n_samples', 'N/A'),
        'train_r2': model_info.get('train_r2', 'N/A'),
        'test_r2': model_info.get('test_r2', 'N/A'),
        'train_rmse': model_info.get('train_rmse', 'N/A'),
        'test_rmse': model_info.get('test_rmse', 'N/A'),
        'cv_r2_mean': model_info.get('cv_r2_mean', 'N/A'),
        'cv_r2_std': model_info.get('cv_r2_std', 'N/A')
    })


@app.route('/info', methods=['GET'])
def info():
    """Get service information"""
    return jsonify({
        'service': 'PLSR SOC Prediction Service',
        'version': '2.0',
        'description': 'Predicts Soil Organic Carbon from AS7341 spectral sensor data',
        'endpoints': {
            '/health': 'Health check',
            '/predict': 'SOC prediction from spectral data',
            '/metrics': 'Model performance metrics',
            '/info': 'This endpoint'
        },
        'model_loaded': model is not None,
        'model_type': model_info.get('source', 'none'),
        'spectral_bands': 11,
        'wavelengths_nm': [410, 440, 470, 510, 550, 590, 630, 680, 700, 850, 940]
    })


@app.before_request
def before_request():
    """Ensure model is loaded on first request"""
    global model
    if model is None:
        load_model()


# Initialize model on app startup
def init_app():
    """Initialize app and load models"""
    global model
    if model is None:
        load_model()


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("PLSR SOC PREDICTION SERVICE (OSSL/AS7341)")
    print("=" * 60)
    
    # Initialize app and load model
    init_app()
    
    if model:
        print(f"✅ Service ready with {model_info.get('source', 'unknown')} model")
    else:
        print("⚠️ Service starting without model (will fail predictions)")
    
    print(f"\n🚀 Running on http://127.0.0.1:5001")
    app.run(host='127.0.0.1', port=5001, debug=False)
