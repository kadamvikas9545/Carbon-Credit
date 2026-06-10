# 📖 AgroGreenBits - Complete Project Manual

**Version:** 1.0  
**Date:** April 2026  
**Status:** Production Ready  
**Last Updated:** April 2026

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Getting Started](#getting-started)
4. [Architecture & Design](#architecture--design)
5. [Database Guide](#database-guide)
6. [API Documentation](#api-documentation)
7. [Farmer User Guide](#farmer-user-guide)
8. [Buyer User Guide](#buyer-user-guide)
9. [Administrator Guide](#administrator-guide)
10. [Machine Learning Component](#machine-learning-component)
11. [Deployment Guide](#deployment-guide)
12. [Security & Compliance](#security--compliance)
13. [Troubleshooting & FAQ](#troubleshooting--faq)
14. [Developer Guide](#developer-guide)
15. [Appendices](#appendices)

---

## Executive Summary

### What is AgroGreenBits?

**AgroGreenBits** is an AI-powered carbon credit marketplace that connects farmers with companies seeking to offset their carbon emissions. The platform enables:

- **Farmers** to monetize their soil health by measuring Soil Organic Carbon (SOC) levels through spectroscopy sensors
- **Companies** to purchase verified carbon credits and track their environmental impact
- **Automated SOC prediction** using machine learning models trained on real soil data

### Key Benefits

| Stakeholder | Benefit |
|-------------|---------|
| **Farmers** | Earn income from carbon credits, monitor soil health, track earnings |
| **Buyers** | Purchase verified eco-friendly offsets, manage carbon portfolio |
| **Platform** | Fair marketplace, transparent pricing, automated verification |

### Core Statistics

- **Roles:** Farmer, Buyer, Administrator
- **Main Features:** 8+ core modules
- **Technology Stack:** Node.js, MongoDB, React/Vanilla JS
- **Deployment:** Cloud-ready (MongoDB Atlas, Node hosting)

---

## System Overview

### Platform Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A["🌐 Web Application<br/>(HTML/CSS/JavaScript<br/>Chart.js)"]
    end
    
    subgraph "API Layer"
        B["Express.js API Server<br/>Port 5000"]
    end
    
    subgraph "Business Logic"
        C["Authentication<br/>Middleware"]
        D["Role-Based<br/>Authorization"]
    end
    
    subgraph "Data Layer"
        E["MongoDB Atlas<br/>Database"]
    end
    
    subgraph "ML/Analytics"
        F["PLSR ML Model<br/>SOC Prediction"]
    end
    
    A -->|HTTP/REST| B
    B --> C
    B --> D
    B --> F
    B --> E
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#FFB6C1
    style D fill:#FFB6C1
    style E fill:#DDA0DD
    style F fill:#F0E68C
```

### Platform Features

```mermaid
graph LR
    subgraph "Farmer Features"
        A["Register & Verify Farm"]
        B["Record Soil Readings"]
        C["Get SOC Prediction"]
        D["Issue Carbon Credits"]
        E["List for Sale"]
        F["Track Earnings"]
    end
    
    subgraph "Buyer Features"
        G["Browse Marketplace"]
        H["Filter Credits"]
        I["Purchase Credits"]
        J["View Portfolio"]
        K["Track Offset"]
    end
    
    subgraph "Platform Features"
        L["Secure Authentication"]
        M["Real-time Updates"]
        N["Analytics Dashboard"]
        O["Transaction History"]
    end
    
    A --> B --> C --> D --> E --> F
    G --> H --> I --> J --> K
    L -.-> A
    M -.-> G
    N -.-> F
    O -.-> J
    
    style A fill:#90EE90
    style G fill:#87CEEB
    style L fill:#FFB6C1
```

---

## Getting Started

### 1. System Requirements

| Component | Requirement |
|-----------|-------------|
| **Node.js** | v14.0 or higher |
| **npm** | v6.0 or higher |
| **MongoDB** | v4.4+ (local or Atlas) |
| **RAM** | Minimum 2GB |
| **Storage** | 500MB for code, models, data |
| **OS** | Windows 10+, macOS 10.13+, Ubuntu 18.04+ |
| **Port** | 5000 (Backend), 3000/5173 (Frontend) |

### 2. Installation Steps

#### **Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/agrogreenbits.git
cd agrogreenbits
```

#### **Step 2: Install Dependencies**

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

#### **Step 3: Configure Environment**

Create `.env` file in `backend/` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/agrogreenbits
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/agrogreenbits

# Security
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Firebase (Optional)
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com

# CORS Origins
CORS_ORIGIN=http://localhost:3000
```

#### **Step 4: Database Setup**

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Seed sample data
cd backend
node seed.js
```

**Option B: MongoDB Atlas**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and user
3. Copy connection string to `.env` file

#### **Step 5: Start the Application**

**Backend Server:**
```bash
cd backend
npm start
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

**Frontend (new terminal):**
```bash
cd frontend
npm start
# OR use Live Server in VS Code
```

#### **Step 6: Verify Installation**

1. Open browser: `http://localhost:5000` or `http://localhost:3000`
2. You should see the AgroGreenBits login page
3. Test login with seed data (see [Test Accounts](#test-accounts))

### 3. First Time Verification Checklist

- [ ] MongoDB is running and connected
- [ ] Backend server started on port 5000
- [ ] Frontend accessible in browser
- [ ] Can login with test farmer account
- [ ] Can login with test buyer account
- [ ] Dashboard loads without errors
- [ ] API responds to requests

### 4. Common Setup Issues

| Issue | Solution |
|-------|----------|
| **MongoDB connection refused** | Ensure MongoDB service is running: `mongod` |
| **Port 5000 already in use** | Change PORT in `.env` file |
| **CORS errors** | Add your URL to CORS_ORIGIN in `.env` |
| **Module not found** | Run `npm install` again in respective folder |
| **JWT errors** | Check JWT_SECRET in `.env` file |

---

## Architecture & Design

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A["🖥️ Web Browser<br/>Farmer/Buyer/Admin"]
    end
    
    subgraph "Presentation"
        B["HTML/CSS/JavaScript<br/>Components & UI"]
        C["Chart.js<br/>Data Visualization"]
    end
    
    subgraph "API Gateway"
        D["Express Router<br/>Request Handler"]
    end
    
    subgraph "Authentication"
        E["JWT Middleware<br/>Token Verification"]
        F["Role-Based Access Control<br/>RBAC"]
    end
    
    subgraph "Business Logic"
        G["Farmer Service<br/>Farm Management"]
        H["Buyer Service<br/>Purchase Logic"]
        I["AI Service<br/>SOC Prediction"]
        J["Transaction Service<br/>Credit Handling"]
    end
    
    subgraph "Data Layer"
        K["MongoDB<br/>Collections"]
        K --> K1["Users"]
        K --> K2["Farms"]
        K --> K3["Transactions"]
        K --> K4["Readings"]
    end
    
    subgraph "ML Pipeline"
        L["PLSR Model<br/>Soil Prediction"]
        M["Sensor Data<br/>AS7341 Spectrometer"]
    end
    
    A --> B & C
    B & C -->|REST API| D
    D --> E --> F
    F -->|Route to| G & H & I & J
    G & H & J -->|Query/Update| K
    I -->|Input| L
    M -->|Feed| L
    L -->|Result| I
    
    style A fill:#90EE90
    style B fill:#98FB98
    style D fill:#87CEEB
    style E fill:#FFB6C1
    style F fill:#FFB6C1
    style K fill:#DDA0DD
    style L fill:#F0E68C
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ Frontend
    participant Backend as 🔧 Backend API
    participant MongoDB as 💾 Database
    
    User->>Frontend: Enter email & password
    Frontend->>Backend: POST /api/auth/register or /login
    Backend->>MongoDB: Check if user exists
    MongoDB-->>Backend: User data or empty
    
    alt User Registration
        Backend->>Backend: Hash password (bcrypt)
        Backend->>MongoDB: Save new user
        MongoDB-->>Backend: Saved user object
    else User Login
        Backend->>Backend: Verify password
        Backend->>Backend: Generate JWT token
    end
    
    Backend-->>Frontend: Return token & user data
    Frontend->>Frontend: Store token in localStorage
    Frontend->>Frontend: Redirect to dashboard
    
    Note over Frontend: Include token in all future requests<br/>Authorization: Bearer {token}
```

### Data Flow - Farmer Publishing Credits

```mermaid
graph LR
    A["📱 Farmer Records<br/>Sensor Reading"] --> B["🔍 Raw Data<br/>Validation"]
    B --> C["🤖 PLSR Model<br/>Processes Data"]
    C --> D["📊 SOC Predicted<br/>Value"]
    D --> E["🧮 Calculate<br/>Carbon Credits"]
    E --> F["💳 Credits<br/>Generated"]
    F --> G["📈 Listed on<br/>Marketplace"]
    G --> H["🛒 Buyers Can<br/>Purchase"]
    
    style A fill:#90EE90
    style C fill:#F0E68C
    style D fill:#FFB6C1
    style F fill:#87CEEB
    style H fill:#DDA0DD
```

### User Journey Maps

#### Farmer Journey
```mermaid
graph TD
    A["Start"] --> B["Sign Up<br/>as Farmer"]
    B --> C["Verify Farm<br/>+ Add Location"]
    C --> D["Install Sensor<br/>AS7341"]
    D --> E["Record Soil<br/>Readings"]
    E --> F["AI Predicts<br/>SOC Levels"]
    F --> G["Review<br/>Credits Generated"]
    G --> H{"Satisfied?"}
    H -->|No| E
    H -->|Yes| I["List Credits<br/>on Market"]
    I --> J["Buyers<br/>Purchase"]
    J --> K["Track<br/>Earnings"]
    K --> L["Withdraw<br/>Funds"]
    
    style A fill:#90EE90
    style L fill:#87CEEB
```

#### Buyer Journey
```mermaid
graph TD
    A["Start"] --> B["Sign Up<br/>as Buyer"]
    B --> C["Browse<br/>Marketplace"]
    C --> D["Filter by<br/>Location/Price"]
    D --> E{"Interested?"}
    E -->|No| C
    E -->|Yes| F["Review Farm<br/>Details"]
    F --> G["Check SOC<br/>Certification"]
    G --> H["Purchase<br/>Credits"]
    H --> I["Credits in<br/>Portfolio"]
    I --> J["View Carbon<br/>Offset Summary"]
    J --> K["Download<br/>Certificate"]
    
    style A fill:#87CEEB
    style K fill:#90EE90
```

---

## Database Guide

### Database Schema

```mermaid
erDiagram
    USERS ||--o{ FARMS : "owns"
    USERS ||--o{ TRANSACTIONS : "performs"
    FARMS ||--o{ READINGS : "has"
    READINGS ||--o{ TRANSACTIONS : "generates"
    
    USERS {
        string _id PK
        string name
        string email UK
        string passwordHash
        string role
        string phone
        string companyName
        boolean verified
        timestamp createdAt
    }
    
    FARMS {
        string _id PK
        string farmerId FK
        string name
        string location
        float acreage
        string soilType
        timestamp createdAt
    }
    
    READINGS {
        string _id PK
        string farmId FK
        float spectralData
        float soilMoisture
        float temperature
        timestamp recordedAt
    }
    
    TRANSACTIONS {
        string _id PK
        string farmerId FK
        string buyerId FK
        float creditAmount
        float pricePerCredit
        float totalPrice
        string status
        timestamp createdAt
    }
```

### MongoDB Collections Structure

#### **Users Collection**
```json
{
  "_id": "ObjectId",
  "name": "John Farmer",
  "email": "john@farm.com",
  "passwordHash": "bcrypted_hash",
  "role": "farmer",
  "phone": "+1234567890",
  "companyName": null,
  "verified": true,
  "profileImage": "url",
  "wallet": {
    "balance": 5000,
    "totalEarnings": 15000
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

#### **Farms Collection**
```json
{
  "_id": "ObjectId",
  "farmerId": "ObjectId",
  "name": "Green Valley Farm",
  "location": "Iowa, USA",
  "coordinates": {
    "latitude": 42.0115,
    "longitude": -93.2104
  },
  "acreage": 500,
  "soilType": "Loamy",
  "cropType": "Corn",
  "sensors": [
    {
      "sensorId": "AS7341_001",
      "type": "Spectroscopy",
      "installed": "2024-01-10"
    }
  ],
  "verified": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### **Readings Collection**
```json
{
  "_id": "ObjectId",
  "farmId": "ObjectId",
  "sensorId": "AS7341_001",
  "spectralData": {
    "wavelength_415": 45.2,
    "wavelength_445": 48.1,
    "wavelength_480": 52.3,
    "wavelength_510": 55.1,
    "wavelength_645": 38.2,
    "wavelength_880": 72.5,
    "wavelength_nir": 85.4
  },
  "soilMoisture": 34.5,
  "temperature": 22.1,
  "socValue": 28.5,
  "socConfidence": 0.92,
  "recordedAt": "2024-01-20T14:30:00Z",
  "createdAt": "2024-01-20T14:35:00Z"
}
```

#### **Transactions Collection**
```json
{
  "_id": "ObjectId",
  "farmerId": "ObjectId",
  "buyerId": "ObjectId",
  "credits": [
    {
      "readingId": "ObjectId",
      "creditAmount": 500,
      "pricePerCredit": 10,
      "totalPrice": 5000
    }
  ],
  "status": "completed",
  "paymentMethod": "credit_card",
  "transactionHash": "hash_for_verification",
  "createdAt": "2024-01-20T15:00:00Z",
  "completedAt": "2024-01-20T15:30:00Z"
}
```

### Database Indexes for Performance

```javascript
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "verified": 1 })

// Farms collection
db.farms.createIndex({ "farmerId": 1 })
db.farms.createIndex({ "coordinates": "2dsphere" })

// Readings collection
db.readings.createIndex({ "farmId": 1, "recordedAt": -1 })
db.readings.createIndex({ "recordedAt": 1 })

// Transactions collection
db.transactions.createIndex({ "farmerId": 1, "createdAt": -1 })
db.transactions.createIndex({ "buyerId": 1, "createdAt": -1 })
db.transactions.createIndex({ "status": 1 })
```

### Backup & Recovery

#### Backup Strategy
```bash
# Backup MongoDB locally
mongodump --uri="mongodb://localhost:27017/agrogreenbits" \
          --out=./backup/agrogreenbits_$(date +%Y%m%d)

# For MongoDB Atlas
mongobackup --uri="mongodb+srv://user:pass@..." --out=./backup
```

#### Restore Data
```bash
# Restore from local backup
mongorestore --uri="mongodb://localhost:27017/agrogreenbits" \
             ./backup/agrogreenbits_YYYYMMDD

# Schedule daily backups (cron job)
0 2 * * * mongodump --uri="mongodb://localhost:27017/agrogreenbits" \
                     --out=/backups/agrogreenbits_$(date +\%Y\%m\%d)
```

---

## API Documentation

### API Base URL

- **Development:** `http://localhost:5000`
- **Production:** `https://api.agrogreenbits.com`

### Authentication

All API requests (except `/register` and `/login`) require JWT token in header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Endpoints Overview

```mermaid
graph TB
    A["🔐 Authentication<br/>Routes"] --> A1["POST /register"]
    A --> A2["POST /login"]
    A --> A3["POST /refresh-token"]
    
    B["👨‍🌾 Farmer<br/>Routes"] --> B1["GET /farms"]
    B --> B2["POST /farms"]
    B --> B3["POST /readings"]
    B --> B4["GET /credits"]
    B --> B5["PUT /credits/list"]
    
    C["🛒 Buyer<br/>Routes"] --> C1["GET /marketplace"]
    C --> C2["POST /purchase"]
    C --> C3["GET /portfolio"]
    C --> C4["GET /transactions"]
    
    D["🤖 AI<br/>Routes"] --> D1["POST /predict-soc"]
    D --> D2["GET /model-info"]
    
    E["⚙️ Admin<br/>Routes"] --> E1["GET /users"]
    E --> E2["GET /analytics"]
    E --> E3["POST /verify-farm"]
    
    style A fill:#FFB6C1
    style B fill:#90EE90
    style C fill:#87CEEB
    style D fill:#F0E68C
    style E fill:#DDA0DD
```

### Authentication Endpoints

#### **1. Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Farmer",
  "email": "john@farm.com",
  "password": "securepassword123",
  "role": "farmer",
  "phone": "+1234567890",
  "companyName": "John's Farm"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@farm.com",
    "role": "farmer"
  }
}
```

#### **2. Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@farm.com",
  "password": "securepassword123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@farm.com",
    "role": "farmer"
  }
}
```

### Farmer Endpoints

#### **3. Get All Farms**
```
GET /api/farmer/farms
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "farms": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Green Valley Farm",
      "location": "Iowa, USA",
      "acreage": 500,
      "soilType": "Loamy",
      "verified": true
    }
  ]
}
```

#### **4. Add New Farm**
```
POST /api/farmer/farms
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "North Field",
  "location": "Illinois, USA",
  "acreage": 350,
  "soilType": "Clay",
  "cropType": "Soybeans"
}

Response (201):
{
  "success": true,
  "farm": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "North Field",
    "location": "Illinois, USA",
    "acreage": 350
  }
}
```

#### **5. Record Soil Reading**
```
POST /api/farmer/readings
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmId": "507f1f77bcf86cd799439012",
  "sensorId": "AS7341_001",
  "spectralData": {
    "wavelength_415": 45.2,
    "wavelength_445": 48.1,
    "wavelength_480": 52.3,
    "wavelength_510": 55.1,
    "wavelength_645": 38.2,
    "wavelength_880": 72.5,
    "wavelength_nir": 85.4
  },
  "soilMoisture": 34.5,
  "temperature": 22.1
}

Response (201):
{
  "success": true,
  "reading": {
    "_id": "507f1f77bcf86cd799439014",
    "farmId": "507f1f77bcf86cd799439012",
    "socValue": 28.5,
    "socConfidence": 0.92,
    "predictedCredits": 285
  }
}
```

#### **6. Get Carbon Credits**
```
GET /api/farmer/credits
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "credits": {
    "available": 1250,
    "listed": 500,
    "sold": 750,
    "totalEarnings": 7500
  }
}
```

#### **7. List Credits for Sale**
```
PUT /api/farmer/credits/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "readingId": "507f1f77bcf86cd799439014",
  "creditAmount": 100,
  "pricePerCredit": 10
}

Response (200):
{
  "success": true,
  "listing": {
    "readingId": "507f1f77bcf86cd799439014",
    "creditAmount": 100,
    "pricePerCredit": 10,
    "totalPrice": 1000,
    "status": "active"
  }
}
```

### Buyer Endpoints

#### **8. Browse Marketplace**
```
GET /api/buyer/marketplace?location=Iowa&maxPrice=15&minCredits=50
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "listings": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "farmName": "Green Valley Farm",
      "location": "Iowa, USA",
      "creditAmount": 250,
      "pricePerCredit": 12,
      "totalPrice": 3000,
      "socValue": 28.5,
      "farmerId": "507f1f77bcf86cd799439001"
    }
  ],
  "total": 24
}
```

#### **9. Purchase Credits**
```
POST /api/buyer/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "listingId": "507f1f77bcf86cd799439020",
  "creditAmount": 100,
  "paymentMethod": "credit_card"
}

Response (201):
{
  "success": true,
  "transaction": {
    "_id": "507f1f77bcf86cd799439030",
    "farmerId": "507f1f77bcf86cd799439001",
    "buyerId": "507f1f77bcf86cd799439002",
    "creditAmount": 100,
    "totalPrice": 1200,
    "status": "completed"
  }
}
```

#### **10. Get Portfolio**
```
GET /api/buyer/portfolio
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "portfolio": {
    "totalCredits": 2500,
    "totalSpent": 25000,
    "carbonOffset": 250,
    "acquisitions": [
      {
        "farmName": "Green Valley Farm",
        "creditAmount": 500,
        "purchaseDate": "2024-01-15",
        "certificationUrl": "..."
      }
    ]
  }
}
```

### AI/ML Endpoints

#### **11. Predict SOC**
```
POST /api/ai/predict-soc
Authorization: Bearer {token}
Content-Type: application/json

{
  "spectralData": {
    "wavelength_415": 45.2,
    "wavelength_445": 48.1,
    "wavelength_480": 52.3,
    "wavelength_510": 55.1,
    "wavelength_645": 38.2,
    "wavelength_880": 72.5,
    "wavelength_nir": 85.4
  },
  "soilMoisture": 34.5,
  "temperature": 22.1
}

Response (200):
{
  "success": true,
  "prediction": {
    "socValue": 28.5,
    "confidence": 0.92,
    "predictedCredits": 285,
    "modelVersion": "PLSR_v2"
  }
}
```

### Admin Endpoints

#### **12. Get Platform Analytics**
```
GET /api/admin/analytics
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "analytics": {
    "totalUsers": 150,
    "totalFarmers": 95,
    "totalBuyers": 55,
    "totalCreditsTraded": 45000,
    "totalRevenue": 450000,
    "averageSOC": 26.3
  }
}
```

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate entry (email exists) |
| 500 | Server Error - Internal issue |

---

## Farmer User Guide

### Overview

Farmers are the core of AgroGreenBits. They:
1. Register their farms
2. Record soil measurements using sensors
3. Get SOC (Soil Organic Carbon) predictions
4. Earn carbon credits
5. List credits on marketplace
6. Track earnings

### Step-by-Step: Getting Started as a Farmer

#### **Step 1: Create Account**

```
1. Go to AgroGreenBits login page
2. Click "Sign Up Now"
3. Select "Farmer" role
4. Fill in your details:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Phone Number
   - Farm Name (optional)
5. Click "Create Account"
6. Verify your email link
7. Login with credentials
```

#### **Step 2: Register Your Farm**

```
1. From Farmer Dashboard, click "Add New Farm"
2. Enter Farm Details:
   - Farm Name: "Green Valley Farm"
   - Location: "Latitude & Longitude or Address"
   - Acreage: Total area in acres
   - Soil Type: Clay/Loam/Sandy/etc
   - Crop Type: Corn/Soybean/Wheat/etc
3. Click "Verify Farm" (admin review)
4. Wait for verification email
5. Once verified, farm appears in your dashboard
```

#### **Step 3: Install Sensor & Connect**

```
1. Order AS7341 Spectroscopy Sensor (if not installed)
2. In Dashboard, go to "Sensor Management"
3. Click "Connect Sensor"
4. Enter Sensor ID: AS7341_001
5. Pair sensor to farm
6. Test connection by reading sensor data
```

#### **Step 4: Record Your First Soil Reading**

```
1. For each field location, record reading:
2. Click "Record Reading"
3. Select Farm: "Green Valley Farm"
4. Place sensor on soil surface
5. Wait for sensor to capture spectral data
6. System automatically measures:
   - Spectral reflectance (wavelengths)
   - Soil moisture
   - Temperature
7. Click "Submit Reading"
8. AI model processes data (2-5 seconds)
```

#### **Step 5: Review AI Prediction**

```
1. After processing, see results:
   - Predicted SOC Value: 28.5 mg/kg
   - Confidence Score: 92%
   - Carbon Credits Generated: 285
2. Review prediction accuracy
3. Accept or request reanalysis
4. Reading saved to history
```

#### **Step 6: Generate & List Credits**

```
1. Go to "My Credits" section
2. View:
   - Total Credits Available: 1,250
   - Credits Listed: 500
   - Credits Sold: 750
   - Pending Sales: in progress
3. Click "List New Credits"
4. Select reading/amount
5. Set Price Per Credit: €10
6. Choose listing duration: 30/60/90 days
7. Click "List on Marketplace"
8. Credit now visible to buyers
```

#### **Step 7: Track Earnings**

```
1. Go to "Earnings & Transactions"
2. View:
   - Current Balance: €5,000
   - Total Earnings (All Time): €15,000
   - Current Month: €2,500
3. Recent Transactions Table:
   - Buyer Name
   - Credits Sold
   - Price
   - Date & Status
4. Download transaction report (PDF/CSV)
```

### Farmer Dashboard Sections

#### **📊 Dashboard Overview**
```
┌─────────────────────────────────────────────────────┐
│         Welcome, John Farmer!                        │
├─────────────────────────────────────────────────────┤
│ [My Farms] [Add Farm] [Sensors] [Readings]           │
├─────────────────────────────────────────────────────┤
│                                                       │
│ 📈 Total Credits: 1,250                              │
│ 💰 Earnings This Month: €2,500                       │
│ 🔄 Pending Sales: 3                                  │
│                                                       │
├─────────────────────────────────────────────────────┤
│ My Farms                                             │
│ • Green Valley Farm (Iowa) - 500 acres ✓ Verified   │
│ • North Field (Illinois) - 350 acres ⏳ Pending     │
├─────────────────────────────────────────────────────┤
│ Recent Readings                                      │
│ Green Valley Farm | SOC: 28.5 | 285 credits         │
│ North Field      | SOC: 31.2 | 312 credits         │
└─────────────────────────────────────────────────────┘
```

### Tips for Maximum Credits

| Strategy | Benefit |
|----------|---------|
| **Record multiple readings** | Capture seasonal variations |
| **Maintain soil health** | Higher SOC = more credits |
| **Consistent monitoring** | Weekly readings show trends |
| **Competitive pricing** | Match market rates |
| **Build reputation** | More buyers trust your data |

### Troubleshooting

| Issue | Solution |
|-------|----------|
| **Sensor not connecting** | Restart sensor, check Wi-Fi |
| **Low SOC predictions** | Take multiple measurements, check soil health |
| **Credits not selling** | Adjust price, improve farm certification |
| **Account locked** | Verify email, contact support |

---

## Buyer User Guide

### Overview

Buyers are companies seeking to offset their carbon footprint. They:
1. Register as buyer
2. Browse carbon credit marketplace
3. Filter by location, price, SOC level
4. Purchase verified credits
5. Track portfolio
6. Download certificates

### Step-by-Step: Getting Started as a Buyer

#### **Step 1: Create Buyer Account**

```
1. Go to AgroGreenBits login page
2. Click "Sign Up Now"
3. Select "Buyer" role
4. Fill in details:
   - Company Name: "EcoTech Solutions"
   - Email (corporate domain)
   - Password
   - Phone
   - Industry/Sector: Manufacturing/Tech/
5. Click "Create Account"
6. Verify email
7. Login
```

#### **Step 2: Set Up Company Profile**

```
1. Go to "Company Settings"
2. Enter:
   - Company Legal Name
   - Registration Number
   - Industry Type
   - Carbon Target: 500 tons CO₂
   - Budget: €50,000
3. Upload Corporate Logo
4. Set contact persons
5. Save Profile
```

#### **Step 3: Explore Marketplace**

```
1. Click "Marketplace" (main menu)
2. View all available listings with:
   - Farm name & location
   - Credit amount
   - Price per credit
   - Total price
   - SOC level
   - Farm verification status
   
3. Map View:
   - See all farms geographically
   - Click pins for info
   - Filter by region
```

#### **Step 4: Filter & Browse Credits**

```
Filters Available:
- Location: Iowa, Illinois, etc
- Price Range: €5 - €20
- Credit Amount: 50 - 1000
- Minimum SOC: 25 mg/kg
- Farm Verification: Verified only ✓
- Freshness: Last 30 days

Use combination of filters to find best options
```

#### **Step 5: Review Farm & Data**

```
When clicking a listing, see:
1. Farm Overview:
   - Farm name & owner
   - Location & acreage
   - Soil type & crop
   - Years operating
   
2. Verification Status:
   - ✓ Verified by platform
   - Certification date
   - Verification details
   
3. Historical Data:
   - Past SOC readings (chart)
   - Average SOC trend
   - Number of readings
   
4. Credit Details:
   - Credit amount: 250 tons
   - Price per credit: €12
   - Total cost: €3,000
   - Confidence score: 92%
```

#### **Step 6: Purchase Credits**

```
1. Click "Purchase" on listing
2. Enter purchase details:
   - Quantity: 100 credits (leave default or change)
   - Purpose: Corporate offset / Sustainability report
   - Purchase date: Today (default)
3. Review Total: 100 × €12 = €1,200
4. Select Payment Method:
   - Credit card
   - Bank transfer
   - Company account
5. Review Terms:
   - Credits non-refundable
   - Certification included
6. Click "Confirm Purchase"
7. Payment processed
8. Credits appear in portfolio
```

#### **Step 7: View Portfolio**

```
Go to "My Portfolio" to see:

📊 Summary:
- Total Credits Owned: 2,500
- Total Spent: €25,000
- Carbon Offset: 250 tons CO₂
- Portfolio Value: €30,000 (current market)

🏆 Holdings:
| Farm | Credits | Price | Date | Total | Cert |
|------|---------|-------|------|-------|------|
| Green Valley | 500 | €12 | Jan 15 | €6K | ✓ |
| North Field | 300 | €10 | Jan 18 | €3K | ✓ |

📋 Export Options:
- Download Portfolio (PDF)
- Certificate Bundle (with verification)
- CSV for accounting
```

#### **Step 8: Download Certificates**

```
1. In Portfolio, click credit listing
2. Click "Download Certificate"
3. PDF includes:
   - Farm verification info
   - SOC data & confidence
   - Carbon offset calculation
   - Legal terms
   - Your company name
4. Use for:
   - CSR reporting
   - Stakeholder communication
   - Regulatory compliance
```

### Buyer Dashboard Layout

```
┌──────────────────────────────────────────────────┐
│ EcoTech Solutions - Buyer Dashboard              │
├──────────────────────────────────────────────────┤
│ [Browse Market] [My Portfolio] [Settings]        │
├──────────────────────────────────────────────────┤
│                                                   │
│ 📊 Carbon Portfolio Summary                       │
│ ├─ Total Credits: 2,500                          │
│ ├─ Carbon Offset: 250 tons CO₂                   │
│ ├─ Total Investment: €25,000                     │
│ └─ Carbon Target: 500 tons (50% achieved)        │
│                                                   │
│ 🛒 Recent Purchases                              │
│ • Green Valley Farm | 500 credits | €6,000       │
│ • North Field | 300 credits | €3,000             │
│                                                   │
│ 📈 Market Stats                                   │
│ • Avg Price: €11.50 per credit                   │
│ • Recent Transactions: 145                       │
│ • Top Regions: Iowa, Illinois                    │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Best Practices for Buyers

| Practice | Benefit |
|----------|---------|
| **Diversify sources** | Spread risk across regions |
| **Check verification** | Ensure credits are legitimate |
| **Monitor prices** | Buy when market dips |
| **Long-term strategy** | Build portfolio gradually |
| **Track certificates** | Organize for audits |

---

## Administrator Guide

### Admin Dashboard

Administrators have complete platform oversight:

```mermaid
graph TB
    A["Admin Dashboard"] --> B["User Management"]
    A --> C["Analytics & Reports"]
    A --> D["Verification System"]
    A --> E["Platform Settings"]
    
    B --> B1["List All Users"]
    B --> B2["Verify Farmers"]
    B --> B3["Suspend Accounts"]
    B --> B4["View KYC Documents"]
    
    C --> C1["Transaction Analytics"]
    C --> C2["Revenue Reports"]
    C --> C3["User Growth"]
    C --> C4["Export Data"]
    
    D --> D1["Review Farm Applications"]
    D --> D2["Verify Sensor Data"]
    D --> D3["Approve Credits"]
    
    E --> E1["Settings"]
    E --> E2["Maintenance"]
    E --> E3["Logs and Monitoring"]
```

### Admin Tasks

#### **1. User Management**

```
GET /api/admin/users
- List all farmers and buyers
- View registration details
- Check verification status
- Search by email/name
- Filter by role

POST /api/admin/users/{id}/verify
- Manually verify user
- Add verification notes

POST /api/admin/users/{id}/suspend
- Suspend fraudulent accounts
- Disable for review
- Add suspension reason
```

#### **2. Farm Verification**

```
GET /api/admin/farms/pending
- Review pending farm applications
- Check farm documents
- View location on map
- Verify ownership

POST /api/admin/farms/{id}/verify
- Approve farm for marketplace
- Generate verification certificate

POST /api/admin/farms/{id}/reject
- Reject application with reason
- Notify farmer
```

#### **3. Platform Analytics**

```
GET /api/admin/analytics
Returns:
{
  "users": {
    "total": 150,
    "farmers": 95,
    "buyers": 55,
    "newThisMonth": 12
  },
  "transactions": {
    "total": 450,
    "volume": "€4.5M",
    "avgPrice": €11.50
  },
  "credits": {
    "totalTraded": 45000,
    "avgSOC": 26.3,
    "topFarms": [...]
  },
  "revenue": {
    "platformFees": €45000,
    "thisMonth": €8500
  }
}
```

---

## Machine Learning Component

### SOC Prediction Model

#### **What is SOC?**

**Soil Organic Carbon (SOC)** is a key indicator of soil health and fertility:
- Measured in mg/kg of dry soil
- Higher SOC = better soil quality
- Directly correlates to carbon credits worth
- AgroGreenBits converts SOC to credits: `Credits = SOC × 10`

#### **How Prediction Works**

```mermaid
graph LR
    A["AS7341 Sensor<br/>Measures Reflectance"] --> B["Spectral Data<br/>7 wavelengths"]
    B --> C["Environmental Data<br/>Moisture, Temp"]
    C --> D["Feature Engineering<br/>Transform Data"]
    D --> E["PLSR Model<br/>Trained on OSSL"]
    E --> F["SOC Prediction<br/>+ Confidence"]
    F --> G["Convert to<br/>Carbon Credits"]
    
    style A fill:#F0E68C
    style E fill:#FFB6C1
    style G fill:#90EE90
```

### PLSR Model Details

#### **Model Version:** PLSR v2 (Production)

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Partial Least Squares Regression |
| **Training Data** | OSSL (OpenSoil Spectral Library) |
| **Samples** | 10,000+ soil readings |
| **Wavelengths** | AS7341: 415, 445, 480, 510, 645, 880 nm |
| **R² Score** | 0.87 (87% accuracy) |
| **RMSE** | 1.2 mg/kg |
| **Prediction Time** | < 100ms |

### Model Retraining

#### **When to Retrain**

- Monthly with new data
- Declining accuracy (< 85%)
- New sensor types
- Seasonal corrections

#### **Retraining Process**

```bash
# Step 1: Collect new data
cd backend/ml
python ossl_processor.py

# Step 2: Prepare training data
python train_plsr_ossl.py

# Step 3: Evaluate model
# Check metrics in models/plsr_ossl_metrics.json
cat models/plsr_ossl_metrics.json

# Step 4: If approved, deploy
cp models/plsr_ossl_*.npy models/production/
```

### API: Make Predictions

```
POST /api/ai/predict-soc
Authorization: Bearer {token}

Request:
{
  "spectralData": {
    "wavelength_415": 45.2,
    "wavelength_445": 48.1,
    "wavelength_480": 52.3,
    "wavelength_510": 55.1,
    "wavelength_645": 38.2,
    "wavelength_880": 72.5,
    "wavelength_nir": 85.4
  },
  "soilMoisture": 34.5,
  "temperature": 22.1,
  "spatialContext": "Iowa"
}

Response:
{
  "socValue": 28.5,
  "confidence": 0.92,
  "predictedCredits": 285,
  "modelVersion": "PLSR_v2",
  "wavelengthsUsed": 6,
  "processingTime": 0.087
}
```

### Sensor: AS7341 Spectrometer

#### **Specifications**

| Spec | Detail |
|------|--------|
| **Wavelengths** | 415, 445, 480, 510, 645, 880 nm +NIR |
| **Resolution** | ~80 nm per channel |
| **Accuracy** | ±10% typical |
| **Response** | 1 measurement/second |
| **Output** | Digital (I2C/SPI) |

#### **Installation Guide**

```
1. Mount sensor on soil surface
2. Position perpendicular to soil
3. Connect power (3.3V USB)
4. Connect to Raspberry Pi/WiFi gateway
5. Calibrate with white reference
6. Test with known soil standard
```

---

## Deployment Guide

### Development Environment

```bash
# Install & Run
git clone https://github.com/.../agrogreenbits
cd agrogreenbits

# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm start

# Access at http://localhost:3000
```

### Production Deployment

#### **Architecture**

```mermaid
graph TB
    A["🌐 CDN<br/>CloudFlare"]
    B["🖥️ Frontend<br/>Vercel/Netlify"]
    C["🔧 Backend API<br/>Heroku/Railway"]
    D["💾 Database<br/>MongoDB Atlas"]
    E["🔐 Auth<br/>Firebase"]
    
    A --> B --> C --> D
    E -.->|JWT| C
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#FFB6C1
    style D fill:#DDA0DD
    style E fill:#F0E68C
```

#### **Option 1: Deploy on Heroku**

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create agrogreenbits-api

# Set environment variables
heroku config:set MONGO_URI=mongodb+srv://user:pass@...
heroku config:set JWT_SECRET=your_secret_key_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### **Option 2: Deploy on Railway**

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Create project
railway init

# Add environment variables in Railway dashboard
# Deploy
railway up
```

#### **Database Backup (MongoDB Atlas)**

```bash
# Automatic backups enabled in Atlas dashboard

# Manual backup trigger
# In MongoDB Atlas Console:
# 1. Go to Cluster > Backup
# 2. Click "Take Backup Now"
# 3. Backup stored and can be restored
```

#### **Monitoring & Logging**

```bash
# View logs
heroku logs --tail

# Set up alerts
# In Heroku dashboard:
# 1. Resources tab
# 2. Add "Papertrail" addon
# 3. Configure alerts for errors

# Application Performance Monitoring
# Use DataDog or New Relic for detailed metrics
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      - name: Run tests
        run: npm test
      - name: Deploy to Heroku
        run: |
          git push heroku main
```

---

## Security & Compliance

### Authentication & Authorization

```mermaid
graph TD
    A["User Login"] --> B["Email & Password"]
    B --> C["Password Hash<br/>Verification"]
    C --> D{"Valid?"}
    D -->|No| E["Reject Login"]
    D -->|Yes| F["Generate JWT Token"]
    F --> G["Return Token"]
    G --> H["Client stores<br/>localStorage"]
    H --> I["Attach to every<br/>API call"]
    I --> J["Verify Token<br/>Signature"]
    J --> K{"Valid?"}
    K -->|No| L["401 Unauthorized"]
    K -->|Yes| M["Check Role<br/>RBAC"]
    M --> N["Grant Access"]
    
    style A fill:#90EE90
    style N fill:#87CEEB
    style E fill:#FFB6C1
    style L fill:#FFB6C1
```

### Security Best Practices

#### **1. Password Security**

```javascript
// DO: Hash passwords with bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

// DON'T: Store plain text passwords
// DON'T: Use simple hashing like MD5

// Password Requirements:
- Minimum 6 characters (require 8+ for production)
- Mix of uppercase, lowercase, numbers
- No dictionary words
```

#### **2. JWT Token Security**

```javascript
// Token payload
{
  "_id": "user_id",
  "role": "farmer",
  "iat": 1645000000,  // issued at
  "exp": 1645604800   // expires in 7 days
}

// Secret key must be:
- Long (32+ characters)
- Random
- Never committed to repo
- Rotated regularly
```

#### **3. API Security**

```javascript
// CORS Protection
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Input Validation
const { body, validationResult } = require('express-validator');
router.post('/register', 
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Proceed with registration
  }
);
```

#### **4. Database Security**

```javascript
// Use environment variables for credentials
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

// Enable MongoDB authentication
// Use IP whitelist in Atlas
// Encrypt connections (HTTPS)

// Data validation before storage
const farmSchema = new Schema({
  location: {
    type: String,
    validate: {
      validator: v => /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(v),
      message: 'Invalid coordinates format'
    }
  }
});
```

### Data Privacy

| Requirement | Implementation |
|-------------|-----------------|
| **EU GDPR** | Data export, deletion on request |
| **Data Classification** | User data marked sensitive |
| **Encryption** | HTTPS for all communication |
| **Backups** | Encrypted, tested recovery |
| **Access Control** | Role-based permissions |
| **Audit Logs** | All user actions tracked |

### Compliance Checklist

- [ ] SSL/HTTPS enabled
- [ ] Password hashing implemented
- [ ] JWT tokens with expiration
- [ ] Rate limiting on APIs
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens for state-changing operations
- [ ] Regular security audits
- [ ] Dependency updates for vulnerabilities

---

## Troubleshooting & FAQ

### Common Installation Issues

#### **Issue: MongoDB connection refused**

```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solutions:
1. Check MongoDB service:
   Windows: net start MongoDB
   macOS: brew services start mongodb-community
   Linux: sudo systemctl start mongod

2. Check .env has correct MONGO_URI
3. Verify MongoDB is on port 27017
4. Check firewall rules
```

#### **Issue: Port 5000 already in use**

```
Error: listen EADDRINUSE: address already in use :::5000

Solutions:
1. Kill process using port:
   Windows: netstat -ano | findstr :5000
           taskkill /PID {PID} /F
   
   Linux/Mac: lsof -i :5000
              kill -9 {PID}

2. Or change PORT in .env:
   PORT=5001
```

#### **Issue: Cannot find module**

```
Error: Cannot find module 'express'

Solutions:
1. Run npm install:
   cd backend && npm install

2. Check package.json exists
3. Clear node_modules:
   rm -rf node_modules
   npm install
```

### API Troubleshooting

#### **Issue: 401 Unauthorized on API requests**

```
Problem: {"success": false, "message": "Unauthorized"}

Causes & Fixes:
1. Missing token header:
   ✓ Add: Authorization: Bearer {token}

2. Token expired:
   ✓ Login again to get new token

3. Invalid token:
   ✓ Check token in localStorage
   ✓ Verify JWT_SECRET in .env

4. CORS error blocking request:
   ✓ Add frontend URL to CORS_ORIGIN
```

#### **Issue: SOC Prediction fails**

```
Error: {"success": false, "message": "ML model error"}

Fixes:
1. Check spectral data format:
   - 7 values required (wavelengths)
   - Values should be 0-100

2. Verify sensor data:
   - Connect sensor properly
   - Check sensor calibration

3. Model file missing:
   - Check models/ folder exists
   - Run training script

4. Check logs:
   - View backend console for errors
```

#### **Issue: Database seeding fails**

```
Error: seed.js fails with connection error

Fixes:
1. Start MongoDB first
2. Check MONGO_URI in .env
3. Ensure database exists:
   - Login to MongoDB
   - db.createCollection("users")
   
4. Run seed again:
   node seed.js
```

### Performance Issues

#### **Slow API responses**

```
Diagnosis:
1. Check response time in:
   - Browser DevTools Network tab
   - Backend logs

2. Likely causes:
   - Missing database indexes
   - Large result sets
   - Network latency

Solution:
1. Add indexes (see Database Guide)
2. Paginate results
3. Cache frequent queries
4. Use CDN for assets
```

#### **High memory usage**

```
Symptoms:
- Server crashes after time
- Memory grows continuously

Causes:
- Memory leaks in code
- Large arrays accumulating
- Missing garbage collection

Fixes:
1. Check for setInterval not cleared
2. Remove event listeners
3. Monitor with:
   npm install node-inspector
   node-debug server.js
```

### FAQ

**Q: How do I reset a user password?**
```
Admin can reset via:
POST /api/admin/users/{id}/reset-password
Body: { newPassword: "..." }

Or user can use:
POST /api/auth/forgot-password
Then click link in email
```

**Q: Can I export my data?**
```
Yes! Go to user settings > "Export My Data"
Generates PDF with all your info and transactions
```

**Q: How often should I record soil readings?**
```
Recommended: Weekly for active monitoring
Minimum: Monthly for baseline
More frequent = more accurate trends
```

**Q: What's the minimum farm size?**
```
No minimum set technically
Practically: 5+ acres recommended
Smaller: May accumulate insufficient credit data
```

**Q: How long until credits are tradeable?**
```
Timeline:
- Record reading: Instant
- AI prediction: 2-5 seconds
- Admin verification: 1-2 hours
- Listed on market: 2-24 hours
- Buyer can purchase: Immediately available
```

**Q: Are carbon credits refundable after purchase?**
```
No. Once purchased, credits are:
- Permanent asset in portfolio
- Can be sold to other buyers
- Non-refundable per terms
```

---

## Developer Guide

### Project Structure Overview

```
agrogreenbits/
├── backend/
│   ├── config/
│   │   └── firebase.js          # Firebase config
│   ├── middleware/
│   │   └── auth.js              # JWT & RBAC
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Farm.js              # Farm schema
│   │   └── Transaction.js       # Transaction schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── farmer.js            # Farmer routes
│   │   ├── buyer.js             # Buyer routes
│   │   ├── admin.js             # Admin routes
│   │   ├── ai.js                # ML endpoints
│   │   └── profile.js           # Profile routes
│   ├── ml/
│   │   ├── plsr_service.py      # PLSR model
│   │   ├── train_plsr_model.py  # Training script
│   │   └── models/              # Trained models
│   ├── server.js                # Express app
│   ├── seed.js                  # Database seeding
│   └── package.json             # Dependencies
│
├── frontend/
│   ├── index.html               # Main SPA
│   ├── firebase-plsr-integration.js
│   ├── enhanced-features.js
│   ├── translations.js
│   └── package.json
│
└── Documentation files (README, guides, etc)
```

### Adding a New Feature

#### **Example: Add Transaction Refund Feature**

**Step 1: Database Model**
```javascript
// backend/models/Transaction.js - Add field
const transactionSchema = new Schema({
  // ... existing fields ...
  refundRequested: Boolean,
  refundReason: String,
  refundDate: Date,
  refundStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  }
});
```

**Step 2: API Route**
```javascript
// backend/routes/transactions.js
router.post('/request-refund', protect, async (req, res) => {
  const { transactionId, reason } = req.body;
  
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({  
      success: false,
      message: 'Transaction not found'
    });
  }
  
  // Check if within refund window (7 days)
  const daysSincePurchase = (Date.now() - transaction.createdAt) / (1000 * 60 * 60 * 24);
  if (daysSincePurchase > 7) {
    return res.status(400).json({
      success: false,
      message: 'Refund window expired'
    });
  }
  
  transaction.refundRequested = true;
  transaction.refundReason = reason;
  transaction.refundStatus = 'pending';
  await transaction.save();
  
  res.json({ success: true, message: 'Refund requested' });
});
```

**Step 3: Frontend Integration**
```javascript
// frontend/index.html - Add refund button in portfolio
async function requestRefund(transactionId) {
  const reason = prompt('Enter refund reason:');
  const response = await fetch('/api/transactions/request-refund', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ transactionId, reason })
  });
  
  const data = await response.json();
  if (data.success) {
    alert('Refund requested. Admin will review within 48 hours.');
  }
}
```

**Step 4: Admin Approval**
```javascript
// backend/routes/admin.js
router.post('/approve-refund/:transactionId', protect, authorizeRoles('admin'), 
  async (req, res) => {
    const transaction = await Transaction.findById(req.params.transactionId);
    transaction.refundStatus = 'approved';
    transaction.refundDate = Date.now();
    // Process refund to buyer's wallet
    await transaction.save();
    res.json({ success: true });
  }
);
```

### Code Style Guidelines

#### **JavaScript**
```javascript
// ✓ DO
const getUserById = async (id) => {
  const user = await User.findById(id);
  return user || null;
};

// ✗ DON'T
const getuserbyid = async (id) => {
  var user = User.findById(id);
  return user;
};

// Good naming
const fetchUserByEmail, calculateSOCCredits, verifyFarmOwnership

// Avoid
const get1, calculate, verify123
```

#### **Error Handling**
```javascript
// ✓ DO
try {
  const farm = await Farm.findById(farmId);
  if (!farm) {
    return res.status(404).json({
      success: false,
      message: 'Farm not found'
    });
  }
} catch (error) {
  console.error('Error fetching farm:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

// ✗ DON'T
Farm.findById(farmId).then(farm => farm.doSomething());
```

### Running Tests

```bash
# Install test framework
npm install jest supertest --save-dev

# Create test
cat > __tests__/auth.test.js << 'EOF'
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('Register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        role: 'farmer'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
EOF

# Run tests
npm test
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/refund-system
git add .
git commit -m "feat: add transaction refund functionality"
git push origin feature/refund-system

# Create Pull Request on GitHub
# After review and approval:
git checkout main
git merge feature/refund-system
git push origin main

# Deploy to production
git push heroku main
```

---

## Appendices

### Glossary

| Term | Definition |
|------|-----------|
| **SOC** | Soil Organic Carbon - measure of soil health in mg/kg |
| **AqUA Credits** | Carbon credits earned from verified SOC measurements |
| **PLSR** | Partial Least Squares Regression - ML algorithm |
| **AS7341** | Spectral sensor capturing light reflectance |
| **JWT** | JSON Web Token - secure authentication method |
| **RBAC** | Role-Based Access Control |
| **MongoDB Atlas** | Cloud database service |
| **Vercel/Netlify** | Frontend hosting platforms |
| **Heroku** | Backend hosting platform |

### Useful Resources

#### **Official Documentation**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT.io](https://jwt.io/)

#### **AI/ML Resources**
- [Scikit-learn (PLSR)](https://scikit-learn.org/stable/)
- [OpenSoil Database](https://www.soilspectroscopy.org/)
- [Spectroscopy Basics](https://en.wikipedia.org/wiki/Spectroscopy)

#### **Development Tools**
- [Postman API Client](https://www.postman.com/)
- [VS Code](https://code.visualstudio.com/)
- [Git/GitHub](https://github.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

### Test Accounts

Use these credentials to test the platform:

#### **Farmer Account**
```
Email: farmer@test.com
Password: farmer123
Role: Farmer
Farm: Test Farm (Iowa)
Status: Verified
```

#### **Buyer Account**
```
Email: buyer@test.com
Password: buyer123
Role: Buyer
Company: Test Corp
Status: Verified
```

#### **Admin Account**
```
Email: admin@test.com
Password: admin123
Role: Admin
Access: Full platform access
```

### Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0** | April 2026 | Initial release, all core features |
| **0.9** | March 2026 | Beta testing |
| **0.5** | January 2026 | Alpha phase |

### Support & Contact

| Channel | Details |
|---------|---------|
| **Email** | support@agrogreenbits.com |
| **Documentation** | https://docs.agrogreenbits.com |
| **GitHub Issues** | https://github.com/agrogreenbits/issues |
| **Community Forum** | https://forum.agrogreenbits.com |

---

## Document Information

**Document Title:** AgroGreenBits - Complete Project Manual  
**Version:** 1.0  
**Last Updated:** April 8, 2026  
**Created By:** Development Team  
**Status:** Active  
**Access Level:** Public

---

*For the latest updates and resources, visit the AgroGreenBits documentation site.*

**🌿 Building a sustainable future through technology 🌿**
