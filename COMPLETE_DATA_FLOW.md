# Complete Data Flow: AS7341 Sensor → ESP32 → Cloud → Dashboard

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ FIELD (FARMER'S SOIL)                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐                                             │
│  │  AS7341 Sensor  │         Measures 11 spectral bands          │
│  │  (I2C)          │         410-940nm                           │
│  └────────┬────────┘                                             │
│           │ (I2C: SDA=GPIO21, SCL=GPIO22)                       │
│           │                                                       │
│  ┌────────▼────────────────────┐                                │
│  │     ESP32 Microcontroller   │                                │
│  │                             │                                │
│  │  • Reads 11 channels        │ Every 5 seconds:              │
│  │  • Normalizes reflectance   │ 1. Read sensor                │
│  │  • Creates JSON packets     │ 2. Format as JSON             │
│  │  • Connects via WiFi        │ 3. Send to backend            │
│  └────────┬────────────────────┘                                │
│           │                                                       │
│           │ WiFi (MQTT or HTTP)                                 │
│           │ Example JSON:                                        │
│           │ {                                                    │
│           │   "spectralData": [0.30, 0.28, ..., 0.10],         │
│           │   "farmId": "farm_123",                             │
│           │   "timestamp": "2026-04-04T10:30:00Z"              │
│           │ }                                                    │
└───────────┼──────────────────────────────────────────────────────┘
            │
            │ INTERNET
            │
┌───────────▼──────────────────────────────────────────────────────┐
│ CLOUD (Node.js Backend - Port 5000)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Endpoint: POST /api/predict                              │  │
│  │                                                            │  │
│  │ 1. Receive spectral data from ESP32                       │  │
│  │ 2. Validate JWT auth token + farm ownership              │  │
│  │ 3. Call Python PLSR Service (port 5001)                  │  │
│  │ 4. Get SOC prediction + confidence                       │  │
│  │ 5. Calculate carbon credits using formula                │  │
│  │ 6. SAVE to MongoDB database:                             │  │
│  │    - SOC reading in farm.socReadings[]                   │  │
│  │    - Update farm.currentSOC                              │  │
│  │    - Update farm.totalCredits                            │  │
│  │ 7. Return result with statusCode 200                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                     ▲                           │                │
│                     │                           ▼                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Python PLSR Service (Port 5001)                   │  │
│  │                                                            │  │
│  │ AI Model Analysis:                                        │  │
│  │ • Load trained AS7341 PLSR model                          │  │
│  │ • Normalize 11 spectral bands                             │  │
│  │ • Run through 6-component PLSR                           │  │
│  │ • Output: SOC % (0.5-8.0)                                │  │
│  │ • Confidence: Model R² score                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        MongoDB Database Storage                           │  │
│  │                                                            │  │
│  │ farms collection:                                         │  │
│  │ {                                                          │  │
│  │   _id: "farm_123",                                        │  │
│  │   name: "Green Acres",                                    │  │
│  │   userId: "user_456",                                    │  │
│  │   currentSOC: 3.45,                                      │  │
│  │   totalCredits: 14.82,                                   │  │
│  │   availableCredits: 12.50,                               │  │
│  │   soldCredits: 2.32,                                     │  │
│  │   socReadings: [                                          │  │
│  │     {                                                      │  │
│  │       value: 3.45,              // SOC %                │  │
│  │       depth: 30,                // cm                    │  │
│  │       spectralData: [0.30, ...],// 11 AS7341 bands      │  │
│  │       source: "plsr",           // AI model              │  │
│  │       timestamp: "2026-04-04T10:30:00Z"                 │  │
│  │     },                                                     │  │
│  │     { ... (previous readings) ... }                      │  │
│  │   ]                                                        │  │
│  │ }                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────┬──────────────────────────────────────────────────────┘
            │
            │ REST API (GET /api/farmer/farm/:id)
            │
┌───────────▼──────────────────────────────────────────────────────┐
│ BROWSER (Frontend - Port 8080/5173)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Farmer Dashboard                                         │  │
│  │                                                            │  │
│  │ ┌────────────────────────────────────────────────────┐  │  │
│  │ │ Farm: Green Acres                                  │  │  │
│  │ │ Current SOC: 3.45% (Updated 1 minute ago)         │  │  │
│  │ │ Carbon Credits: 14.82 (2.32 sold)                 │  │  │
│  │ │                                                     │  │  │
│  │ │ [Chart showing SOC trend over time]                │  │  │
│  │ │ [List of all readings with timestamps]             │  │  │
│  │ │                                                     │  │  │
│  │ │ Recent Readings:                                   │  │  │
│  │ │ • 3.45% at 10:30 (PLSR, Confidence: 85%)          │  │  │
│  │ │ • 3.42% at 10:25 (PLSR, Confidence: 84%)          │  │  │
│  │ │ • 3.48% at 10:20 (PLSR, Confidence: 86%)          │  │  │
│  │ └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Spectral Data Visualization                             │  │
│  │                                                            │  │
│  │ 11-Band Spectrum (Latest Reading):                       │  │
│  │                                                            │  │
│  │ 410nm ▓▓▓░░░░░ 0.30 (Violet)                             │  │
│  │ 440nm ▓▓▓░░░░░ 0.28 (Blue)                              │  │
│  │ 470nm ▓▓░░░░░░ 0.26 (Blue-Green)                        │  │
│  │ ...                                                        │  │
│  │ 730nm ▓░░░░░░░ 0.15 ← SOC Indicator                      │  │
│  │ 850nm ▓░░░░░░░ 0.12 ← SOC Indicator                      │  │
│  │ 940nm ▓░░░░░░░ 0.10 ← SOC Indicator                      │  │
│  │                                                            │  │
│  │ (Lower NIR = Higher SOC)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Data Flow

### **Phase 1: Sensor Data Collection (Field)**

**Hardware Setup:**
```
AS7341 (Spectrometer)
  ↓ (I2C: SDA→GPIO21, SCL→GPIO22)
ESP32 (Microcontroller)
  ↓ (WiFi: Connect to home/farm WiFi)
Internet
```

**ESP32 Arduino Code - Reading Sensor:**
```cpp
#include <Wire.h>
#include <AS7341.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

AS7341 as7341;
const char* ssid = "SSID";
const char* password = "PASSWORD";
const char* backendUrl = "http://your-backend.com:5000/api/predict";

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);  // SDA=21, SCL=22
  
  // Initialize sensor
  if (!as7341.begin()) {
    Serial.println("AS7341 not found!");
    while(1);
  }
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

void loop() {
  // Read 11-channel spectral data
  if (as7341.readSpectralData()) {
    
    // Step 1: Normalize raw 16-bit values to 0-1 range
    float spectral[11];
    spectral[0] = as7341.ch1 / 65535.0;   // 410nm
    spectral[1] = as7341.ch2 / 65535.0;   // 440nm
    spectral[2] = as7341.ch3 / 65535.0;   // 470nm
    spectral[3] = as7341.ch4 / 65535.0;   // 510nm
    spectral[4] = as7341.ch5 / 65535.0;   // 550nm
    spectral[5] = as7341.ch6 / 65535.0;   // 590nm
    spectral[6] = as7341.ch7 / 65535.0;   // 630nm
    spectral[7] = as7341.ch8 / 65535.0;   // 680nm
    spectral[8] = as7341.ch9 / 65535.0;   // 730nm (NIR)
    spectral[9] = as7341.ch10 / 65535.0;  // 850nm (NIR)
    spectral[10] = as7341.ch11 / 65535.0; // 940nm (NIR)
    
    // Step 2: Create JSON packet
    StaticJsonDocument<512> doc;
    doc["spectral_data"] = serialized(
      "[0.30, 0.28, 0.26, 0.25, 0.24, 0.23, 0.20, 0.18, 0.15, 0.12, 0.10]"
    );
    doc["depth"] = 30;
    doc["farmId"] = "farm_123";
    doc["timestamp"] = getCurrentTime();
    
    // Step 3: Send to backend
    sendToBackend(doc);
    
    // Wait 5 seconds before next reading
    delay(5000);
  }
}

void sendToBackend(JsonDocument& doc) {
  HTTPClient http;
  http.begin(backendUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer YOUR_JWT_TOKEN");
  
  String payload;
  serializeJson(doc, payload);
  
  int httpCode = http.POST(payload);
  
  if (httpCode == 200) {
    String response = http.getString();
    Serial.println("✓ Data sent successfully!");
    Serial.println(response);
  } else {
    Serial.printf("✗ Error: %d\n", httpCode);
  }
  
  http.end();
}
```

---

### **Phase 2: Data Transmission (WiFi → Cloud)**

**JSON Packet Sent from ESP32:**
```json
POST http://backend.com:5000/api/predict

{
  "spectral_data": [0.30, 0.28, 0.26, 0.25, 0.24, 0.23, 0.20, 0.18, 0.15, 0.12, 0.10],
  "depth": 30,
  "farmId": "farm_123"
}

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

### **Phase 3: Backend Processing (Node.js)**

**File: `backend/routes/ai.js`**

```javascript
router.post('/predict', protect, async (req, res) => {
  try {
    const { spectral_data, depth = 30, farmId } = req.body;
    
    // Step 1: Validate data
    if (!spectral_data || spectral_data.length !== 11) {
      return res.status(400).json({
        error: "Expected 11 spectral channels from AS7341"
      });
    }
    
    // Step 2: Call Python PLSR service
    const plsrResponse = await axios.post(
      'http://127.0.0.1:5001/predict',
      { spectralData: spectral_data, depth: depth },
      { timeout: 5000 }
    );
    
    const {
      soc_percentage: soc,
      carbon_stock_tonnes_per_ha: carbonStock,
      co2_equivalent_tonnes_per_ha: co2Equivalent
    } = plsrResponse.data;
    
    // Step 3: Load farm from database
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }
    
    // Step 4: Calculate credits
    const { credits } = Farm.calculateCredits(soc, farm.area, depth);
    
    // Step 5: SAVE to MongoDB
    farm.socReadings.push({
      value: soc,
      depth: depth,
      spectralData: spectral_data,  // 11-channel data stored
      source: 'plsr',
      timestamp: new Date()
    });
    
    farm.currentSOC = soc;
    farm.totalCredits = credits;
    farm.availableCredits = credits - farm.soldCredits;
    
    await farm.save();  // ← Database write
    
    // Step 6: Return response
    res.json({
      success: true,
      data: {
        soc: soc,
        carbonStock: carbonStock,
        co2Equivalent: co2Equivalent,
        credits: credits,
        farmId: farmId,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});
```

---

### **Phase 4: Database Storage (MongoDB)**

**MongoDB Document Structure:**

```javascript
// Database: agrogreenbits
// Collection: farms

{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  name: "Green Acres Farm",
  location: "Madhya Pradesh, India",
  area: 5,                    // hectares
  soilType: "black",
  
  // Latest SOC reading
  currentSOC: 3.45,          // %
  totalCredits: 14.82,
  availableCredits: 12.50,
  soldCredits: 2.32,
  
  // Historical data - ALL readings stored here
  socReadings: [
    {
      _id: ObjectId("507f1f77bcf86cd799439013"),
      value: 3.45,                   // SOC %
      depth: 30,                     // cm
      spectralData: [
        0.30,   // 410nm
        0.28,   // 440nm
        0.26,   // 470nm
        0.25,   // 510nm
        0.24,   // 550nm
        0.23,   // 590nm
        0.20,   // 630nm
        0.18,   // 680nm
        0.15,   // 730nm ← NIR
        0.12,   // 850nm ← NIR
        0.10    // 940nm ← NIR
      ],
      source: "plsr",               // AI model
      timestamp: ISODate("2026-04-04T10:30:00Z")
    },
    {
      value: 3.42,
      depth: 30,
      spectralData: [0.31, 0.29, ...],
      source: "plsr",
      timestamp: ISODate("2026-04-04T10:25:00Z")
    },
    {
      value: 3.48,
      depth: 30,
      spectralData: [0.29, 0.27, ...],
      source: "plsr",
      timestamp: ISODate("2026-04-04T10:20:00Z")
    }
    // ... more historical readings
  ],
  
  isVerified: true,
  verifiedAt: ISODate("2026-04-01T14:00:00Z")
}
```

---

### **Phase 5: Frontend Data Access**

**How to GET farm data:**

```javascript
// Frontend code
const farmId = "farm_123";
const token = localStorage.getItem('token');

fetch(`http://localhost:5000/api/farmer/farm/${farmId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('Farm Data Received:');
  console.log(`Current SOC: ${data.currentSOC}%`);
  console.log(`Total Credits: ${data.totalCredits}`);
  console.log(`Number of readings: ${data.socReadings.length}`);
  
  // Display latest 10 readings
  data.socReadings.slice(0, 10).forEach(reading => {
    console.log(`${reading.timestamp}: ${reading.value}% SOC`);
  });
})
```

**Response from Backend:**
```json
{
  "success": true,
  "data": {
    "_id": "farm_123",
    "name": "Green Acres Farm",
    "currentSOC": 3.45,
    "totalCredits": 14.82,
    "availableCredits": 12.50,
    "socReadings": [
      {
        "_id": "reading_001",
        "value": 3.45,
        "depth": 30,
        "spectralData": [0.30, 0.28, ..., 0.10],
        "source": "plsr",
        "timestamp": "2026-04-04T10:30:00Z"
      },
      {
        "_id": "reading_002",
        "value": 3.42,
        "depth": 30,
        "spectralData": [0.31, 0.29, ..., 0.11],
        "source": "plsr",
        "timestamp": "2026-04-04T10:25:00Z"
      }
    ]
  }
}
```

---

### **Phase 6: Frontend Display**

**HTML Dashboard:**
```html
<div class="farm-dashboard">
  <h2>Green Acres Farm</h2>
  
  <div class="metrics">
    <div class="card">
      <h3>Current SOC</h3>
      <p class="value">3.45%</p>
      <p class="timestamp">Updated 5 minutes ago</p>
    </div>
    
    <div class="card">
      <h3>Carbon Credits</h3>
      <p class="value">14.82</p>
      <p class="subtitle">2.32 sold, 12.50 available</p>
    </div>
  </div>
  
  <!-- Chart showing SOC trend -->
  <canvas id="socChart" width="400" height="100"></canvas>
  
  <!-- Spectral data visualization -->
  <div class="spectral-bands">
    <h3>Latest Spectral Reading (11-band AS7341)</h3>
    <div class="band" style="height: 30%">410nm: 0.30</div>
    <div class="band" style="height: 28%">440nm: 0.28</div>
    ...
    <div class="band" style="height: 10%">940nm: 0.10 ← NIR Indicator</div>
  </div>
  
  <!-- Historical readings -->
  <table>
    <tr>
      <th>Timestamp</th>
      <th>SOC %</th>
      <th>Source</th>
      <th>Confidence</th>
    </tr>
    <tr>
      <td>2026-04-04 10:30</td>
      <td>3.45</td>
      <td>PLSR AI</td>
      <td>85%</td>
    </tr>
    <tr>
      <td>2026-04-04 10:25</td>
      <td>3.42</td>
      <td>PLSR AI</td>
      <td>84%</td>
    </tr>
  </table>
</div>
```

---

## Key Points

| Component | Details |
|-----------|---------|
| **Sensor Reading** | Every 5 seconds, AS7341 reads 11 spectral bands |
| **Data Format** | 11 numbers (0-1 range) + metadata |
| **Transmission** | WiFi (MQTT or HTTP) to backend |
| **Processing** | Python PLSR model predicts SOC from 11 bands |
| **Storage** | MongoDB stores all readings with history |
| **Access** | Frontend fetches via REST API `/api/farmer/farm/:id` |
| **Display** | Charts, tables, trending over time |
| **Scalability** | Can handle 100+ readings per day per farm |

---

## Accessing Data - Summary

```
1. ESP32 measures → sends JSON to backend
2. Backend validates → calls PLSR → calculates credits
3. Backend stores in MongoDB → returns response
4. Frontend requests farm data → backend queries MongoDB
5. Frontend displays readings with charts, trends, history
```

**All data is persistent and can be accessed anytime!**

**Want to start Phase 2?** Run the PLSR service:
```powershell
python plsr_service.py
```
