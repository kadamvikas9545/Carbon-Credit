# AS7341 ESP32 Integration Guide

## Hardware Setup

### Wiring (AS7341 to ESP32)
```
AS7341 SDA  -->  ESP32 GPIO 21 (or custom SDA pin)
AS7341 SCL  -->  ESP32 GPIO 22 (or custom SCL pin)
AS7341 VCC  -->  ESP32 3.3V
AS7341 GND  -->  ESP32 GND
```

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
  // With JSON body containing spectralData array
  // See backend integration below
}
```

## Libraries Required
- Adafruit_AS7341 (for sensor I2C communication)
- ArduinoJson (for JSON serialization)
- WiFi (for ESP32 connectivity)
- HTTPClient (for HTTP POST requests)

## Installation
```
Arduino IDE:
1. Sketch > Include Library > Manage Libraries
2. Search: "Adafruit AS7341"
3. Click Install
```

## Backend Integration

### Request Format
```json
POST http://localhost:5000/api/predict

{
  "spectral_data": [0.30, 0.28, 0.26, 0.25, 0.24, 0.23, 0.20, 0.18, 0.15, 0.12, 0.10],
  "depth": 30
}
```

### AS7341 Spectral Channel Mapping
| Index | Wavelength | Color | SOC Sensitivity |
|-------|-----------|-------|-----------------|
| 0 | 410 nm | Violet | Low |
| 1 | 440 nm | Blue | Low |
| 2 | 470 nm | Blue-Green | Low |
| 3 | 510 nm | Green | Medium |
| 4 | 550 nm | Green-Yellow | Medium |
| 5 | 590 nm | Yellow | Medium |
| 6 | 630 nm | Orange | Medium |
| 7 | 680 nm | Red | High |
| 8 | 730 nm | Red-IR | **Very High** |
| 9 | 850 nm | NIR | **Very High** |
| 10 | 940 nm | NIR | **Very High** |

### Expected Backend Response
```json
{
  "success": true,
  "data": {
    "soc": 3.45,
    "carbonStock": 13.44,
    "co2Equivalent": 49.39,
    "credits": 14.82,
    "confidence": 0.85,
    "modelInfo": {
      "type": "PLSR",
      "sensor": "AS7341",
      "channels": 11,
      "test_r2": 0.85
    }
  }
}
```

## Model Information

**AS7341-Optimized PLSR:**
- Channels: 11 (exactly matches AS7341 output)
- Wavelengths: 410-940nm (visible + NIR)
- Latent Variables: 6 (optimal for 11 features)
- Expected Test R2: 0.75-0.85 (with real field data)
- Key bands for SOC: 730nm, 850nm, 940nm (NIR)

## Calibration Tips

1. **White Reference** - Use white Spectralon tile
2. **Dark Reference** - Measure in complete darkness
3. **Temperature** - AS7341 is temperature-sensitive (1% change per 10C)
4. **Averaging** - Take 5-10 measurements, average them
5. **Sample Preparation** - Air-dry soil, sieve <2mm

## Troubleshooting

| Issue | Solution |
|-------|----------|
| AS7341 not detected | Check I2C address (0x39), verify wiring |
| Readings vary wildly | Use white reference calibration |
| Low R2 on predictions | Need more training samples (200+ with real soil) |
| Connection timeout | Ensure PLSR service running on port 5001 |

## Next Steps

1. Wire up AS7341 to ESP32
2. Load Arduino code above
3. Calibrate white/dark references
4. Collect 50+ soil samples
5. Send to backend for PLSR training
6. Deploy trained model to production
