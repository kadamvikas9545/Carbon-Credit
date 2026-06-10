"""
PLSR Inference Service
Flask API for SOC prediction using trained PLSR model.
Communicates with Node.js backend via HTTP.
"""

from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
from datetime import datetime
import traceback

app = Flask(__name__)

# Model and scaler cache
model = None
scaler = None
metrics = None

def load_model():
    """Load trained PLSR model and scaler from disk."""
    global model, scaler, metrics
    
    try:
        model_path = 'models/plsr_soc_model.pkl'
        scaler_path = 'models/plsr_scaler.pkl'
        metrics_path = 'models/plsr_metrics.json'
        
        if not os.path.exists(model_path):
            return False, "Model file not found. Run train_plsr_model.py first."
        
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        import json
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
        
        return True, "Model loaded successfully"
    except Exception as e:
        return False, f"Error loading model: {str(e)}"

@app.route('/health', methods=['GET'])
def health_check():
    """Check if service is running and model is loaded."""
    if model is None:
        return jsonify({'status': 'error', 'message': 'Model not loaded'}), 503
    
    return jsonify({
        'status': 'healthy',
        'service': 'PLSR SOC Inference',
        'model_type': metrics.get('model_type'),
        'n_components': metrics.get('n_components'),
        'test_r2': metrics.get('test_r2')
    }), 200

@app.route('/predict', methods=['POST'])
def predict_soc():
    """
    Predict SOC from spectral data.
    
    Expected JSON:
    {
        "spectralData": [array of 128 reflectance values 0-1],
        "wavelengths": [optional array of wavelength labels],
        "depth": 30
    }
    """
    try:
        data = request.json
        
        # Validate input
        if 'spectralData' not in data:
            return jsonify({'error': 'Missing spectralData field'}), 400
        
        spectral_array = np.array(data['spectralData']).reshape(1, -1)
        
        # Validate dimensions
        if spectral_array.shape[1] != 128:
            return jsonify({
                'error': f'Expected 128 spectral bands, got {spectral_array.shape[1]}'
            }), 400
        
        # Preprocess
        spectral_scaled = scaler.transform(spectral_array)
        
        # Predict
        soc_prediction = float(model.predict(spectral_scaled)[0, 0])
        
        # Clamp to realistic range
        soc_prediction = max(0.5, min(8.0, soc_prediction))
        
        # Calculate carbon metrics
        depth = data.get('depth', 30)  # cm
        bulk_density = 1.3  # g/cm³ typical value
        carbon_stock = (soc_prediction / 100) * depth * 10000 * bulk_density / 1000
        co2_equivalent = carbon_stock * 3.67
        
        return jsonify({
            'success': True,
            'soc_percentage': round(soc_prediction, 2),
            'confidence': metrics.get('test_r2'),
            'carbon_stock_tonnes_per_ha': round(carbon_stock, 2),
            'co2_equivalent_tonnes_per_ha': round(co2_equivalent, 2),
            'depth_cm': depth,
            'model_info': {
                'type': metrics.get('model_type'),
                'latent_variables': metrics.get('n_components'),
                'test_r2': metrics.get('test_r2'),
                'test_rmse': metrics.get('test_rmse')
            },
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Prediction error: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    """Return model training metrics."""
    if metrics is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    return jsonify({
        'model_metrics': metrics
    }), 200

@app.route('/info', methods=['GET'])
def model_info():
    """Return model information and requirements."""
    return jsonify({
        'service': 'PLSR SOC Prediction',
        'model': 'Partial Least Squares Regression',
        'version': '1.0',
        'input_format': {
            'spectralData': 'array of 128 reflectance values (0-1 range)',
            'depth': 'optional soil depth in cm (default: 30)',
            'wavelengths': 'optional metadata (400-2400 nm range)'
        },
        'output': {
            'soc_percentage': 'Predicted soil organic carbon percentage',
            'carbon_stock_tonnes_per_ha': 'Calculated carbon stock',
            'co2_equivalent_tonnes_per_ha': 'CO₂ equivalent for carbon credits',
            'confidence': 'Model R² score from test set'
        },
        'api_endpoint': 'POST /predict',
        'requirements': [
            '128 spectral bands (NIR: 400-2400nm at ~16nm intervals)',
            'Reflectance values normalized to 0-1 range',
            'Model trained on agricultural soil spectroscopy data'
        ]
    }), 200

if __name__ == '__main__':
    print("\n🌿 AgroGreenBits PLSR Inference Service\n")
    
    # Load model on startup
    success, message = load_model()
    if not success:
        print(f"⚠️  {message}")
        print("\nTo train the model, run: python ml/train_plsr_model.py")
    else:
        print(f"✅ {message}")
        print(f"   Model: {metrics.get('model_type')}")
        print(f"   Components: {metrics.get('n_components')}")
        print(f"   Test R²: {metrics.get('test_r2'):.4f}\n")
    
    # Start Flask app
    print("Starting Flask server on port 5001...")
    print("API endpoints:")
    print("  GET  /health      - Health check")
    print("  POST /predict     - Predict SOC from spectral data")
    print("  GET  /metrics     - Model metrics")
    print("  GET  /info        - API information\n")
    
    app.run(host='127.0.0.1', port=5001, debug=False)
