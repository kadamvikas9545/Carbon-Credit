# Firebase Integration Guide - Backend AI Mode

## Overview
This guide shows how to access spectral data from Firebase Firestore in your backend for PLSR AI processing.

---

## 1. Setup Firebase Admin SDK

### Step 1: Install Dependencies
```bash
cd backend
npm install firebase-admin
```

### Step 2: Get Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Settings** (⚙️) → **Service Accounts**
3. Click **Generate New Private Key** (Node.js)
4. Save the JSON file as: `backend/serviceAccountKey.json`

### Step 3: Update .env File
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Step 4: Restart Backend
```bash
npm run dev
# Should see: ✅ Firebase Admin initialized
```

---

## 2. Firestore Data Structure

Your spectral data should be organized in Firestore like this:

```
firestore/
└── farms/                          (collection)
    └── {farmId}/                   (document)
        ├── name: "Green Farm #1"
        ├── area: 5                 (hectares)
        ├── currentSOC: 2.45         (current soil organic carbon %)
        ├── availableCredits: 1850
        ├── lastReadingAt: timestamp
        └── socReadings: [          (array of readings)
            {
              "spectralData": [0.15, 0.18, 0.20, ...],  (11 bands)
              "soc": 2.45,
              "confidence": 0.89,
              "credits": 1850,
              "depth": 30,
              "timestamp": "2026-04-05T10:30:00Z",
              "processedAt": timestamp
            },
            { ... more readings ... }
          ]
```

---

## 3. Available Endpoints

### A. Fetch Spectral Readings from Firebase
#### Endpoint
```
GET /api/firebase/spectral-readings/:farmId
```

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
```

#### Response
```json
{
  "success": true,
  "farmId": "farm_001",
  "farmName": "Green Farm #1",
  "totalReadings": 5,
  "readings": [
    {
      "soc": 2.45,
      "spectralData": [0.15, 0.18, 0.20, ...],
      "timestamp": "2026-04-05T10:30:00Z",
      "confidence": 0.89,
      "credits": 1850
    }
  ]
}
```

---

### B. Get Latest Spectral Reading
#### Endpoint
```
GET /api/firebase/latest-spectral/:farmId
```

#### Use Case
Get the most recent sensor reading for AI processing

#### Response
```json
{
  "success": true,
  "farmId": "farm_001",
  "farmName": "Green Farm #1",
  "latestReading": {
    "spectralData": [0.15, 0.18, 0.20, ...],
    "timestamp": "2026-04-05T11:45:00Z",
    "soc": 2.45,
    "confidence": 0.89,
    "credits": 1850
  },
  "hint": "Use spectralData array to POST to /api/predict for fresh AI processing"
}
```

---

### C. Store Prediction Result to Firebase
#### Endpoint
```
POST /api/firebase/store-reading
```

#### Body
```json
{
  "farmId": "farm_001",
  "spectralData": [0.15, 0.18, 0.20, ...],
  "soc": 2.45,
  "confidence": 0.89,
  "credits": 1850,
  "depth": 30
}
```

#### Response
```json
{
  "success": true,
  "message": "Spectral reading stored to Firebase",
  "stored": {
    "farmId": "farm_001",
    "soc": 2.45,
    "confidence": 0.89,
    "credits": 1850,
    "timestamp": "2026-04-05T12:00:00Z"
  }
}
```

---

### D. Complete AI Flow (Fetch → Process → Store)
#### Endpoint
```
POST /api/firebase/predict-from-latest
```

#### Body
```json
{
  "farmId": "farm_001"
}
```

#### Flow
1. **Fetch** latest spectral data from Firebase
2. **Process** with PLSR AI model (11 bands → SOC %)
3. **Calculate** carbon credits
4. **Store** results back to Firebase

#### Response
```json
{
  "success": true,
  "message": "Spectral data processed and stored",
  "prediction": {
    "farmId": "farm_001",
    "farmName": "Green Farm #1",
    "soc": 2.45,
    "confidence": 0.89,
    "carbonStock": 31.85,
    "co2Equivalent": 116.79,
    "credits": 1850,
    "areaHa": 5,
    "depth": 30
  }
}
```

---

## 4. Frontend Flow (ESP32 → Firebase → Backend)

### Flow Diagram
```
ESP32 Sensor
  ↓
  11 Spectral Bands [0.15, 0.18, ..., 0.38]
  ↓
Firebase Realtime DB / Firestore
  (socReadings collection)
  ↓
Backend Endpoint: /api/firebase/predict-from-latest
  ↓
PLSR AI Model (5001)
  SOC = 2.45%
  Confidence = 0.89
  ↓
Store Result to Firebase + MongoDB
  ↓
Frontend Dashboard Display
  SOC = 2.45%
  Credits = 1,850
```

---

## 5. Quick Test

### Install Dependencies First
```bash
npm install
```

### Test Endpoint (with valid JWT)
```bash
curl -X GET http://localhost:5000/api/firebase/latest-spectral/farm_001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### If Firebase Not Initialized
Check your `.env` file:
- ✅ `FIREBASE_SERVICE_ACCOUNT_PATH` points to correct JSON file
- ✅ `serviceAccountKey.json` exists in backend directory
- ✅ Restart server: `npm run dev`

---

## 6. Error Troubleshooting

| Error | Solution |
|-------|----------|
| `Firebase not initialized` | Check `serviceAccountKey.json` path in `.env` |
| `Farm not found in Firestore` | Ensure Firestore has `farms/{farmId}` document |
| `No spectral readings found` | Add spectral data to `socReadings` array in Firestore |
| `PLSR service unavailable` | Ensure Python PLSR service running on port 5001 |

---

## 7. MongoDB ↔ Firebase Sync (Optional)

If you want to sync MongoDB and Firebase:

```javascript
// After storing to MongoDB, also store to Firebase
const { db } = require('../config/firebase');

await db.collection('farms').doc(farmId).set({
  mongoObjectId: farm._id.toString(),
  ...farmData
}, { merge: true });
```

---

## Example: Complete AI Flow in React Frontend

```javascript
// 1. Fetch latest spectral data
const latestResponse = await fetch(
  '/api/firebase/latest-spectral/farm_001',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const { latestReading } = await latestResponse.json();

// 2. Process with PLSR (entire AI pipeline)
const predictionResponse = await fetch(
  '/api/firebase/predict-from-latest',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ farmId: 'farm_001' })
  }
);

const { prediction } = await predictionResponse.json();
// Display: SOC = 2.45%, Credits = 1,850
```

---

## Support
For issues with Firebase setup, check:
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/database/admin/start)
- [Firestore Query Documentation](https://firebase.google.com/docs/firestore/query-data/get-data)
