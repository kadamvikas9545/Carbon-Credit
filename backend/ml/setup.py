#!/usr/bin/env python3
"""
AgroGreenBits ML Setup Script
Automated setup for PLSR model and inference service
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    """Print formatted header."""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def check_python():
    """Check Python version."""
    print_header("Checking Python Installation")
    
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("✗ Python 3.8+ required")
        return False
    
    return True

def install_dependencies():
    """Install Python dependencies from requirements.txt."""
    print_header("Installing Python Dependencies")
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "-r", "requirements.txt"])
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install dependencies: {e}")
        return False

def train_model():
    """Train PLSR model."""
    print_header("Training PLSR Model")
    
    try:
        subprocess.check_call([sys.executable, "train_plsr_model.py"])
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Model training failed: {e}")
        return False

def verify_setup():
    """Verify that model files exist."""
    print_header("Verifying Setup")
    
    required_files = [
        "models/plsr_soc_model.pkl",
        "models/plsr_scaler.pkl",
        "models/plsr_metrics.json"
    ]
    
    all_exist = True
    for file_path in required_files:
        exists = os.path.exists(file_path)
        status = "✓" if exists else "✗"
        print(f"{status} {file_path}")
        all_exist = all_exist and exists
    
    return all_exist

def print_next_steps():
    """Print next steps for user."""
    print_header("Setup Complete! Next Steps")
    
    print("1. Start the PLSR Inference Service:")
    print("   python plsr_service.py")
    print("   (Leave running in a separate terminal)")
    print()
    print("2. In another terminal, start Node.js backend:")
    print("   cd ..")
    print("   npm install")
    print("   npm start")
    print()
    print("3. Test the API with Postman or curl:")
    print("   curl http://127.0.0.1:5001/health")
    print()
    print("4. Use the frontend to test SOC predictions")
    print()
    print("For detailed setup instructions, see PLSR_SETUP.md")

def main():
    """Run complete setup."""
    print("\n" + "="*60)
    print("  🌿 AgroGreenBits PLSR Model Setup")
    print("="*60)
    
    # Check Python
    if not check_python():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Train model
    if not train_model():
        sys.exit(1)
    
    # Verify setup
    if not verify_setup():
        print("\n⚠️  Setup verification failed. Check logs above.")
        sys.exit(1)
    
    # Print success message
    print_next_steps()
    print("\n✅ Setup complete!\n")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')
    main()
