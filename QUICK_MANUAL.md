# AgroGreenBits - Quick Reference Manual (2026)

**Version:** 1.0 | **Status:** Production Ready

---

## 📖 Table of Contents

1. [What is AgroGreenBits?](#what-is-agrogreenbits)
2. [Quick Start](#quick-start)
3. [System Architecture](#system-architecture)
4. [Farmer Guide](#farmer-guide)
5. [Buyer Guide](#buyer-guide)
6. [Admin Guide](#admin-guide)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)
9. [Contact & Support](#contact--support)

---

## What is AgroGreenBits?

**AgroGreenBits** is an AI-powered carbon credit marketplace connecting farmers with companies.

**How It Works:**
- Farmers measure soil health using spectroscopy sensors
- AI predicts Soil Organic Carbon (SOC) levels
- Automatic carbon credit generation (1 SOC unit = 10 credits)
- Credits listed on marketplace for buyer purchase
- Farmers earn money, buyers offset carbon emissions

**Key Features:**
- 🌾 Farmer farm management & soil monitoring
- 🛒 Buyer marketplace & portfolio tracking
- 🤖 AI-powered SOC prediction (PLSR model)
- 💰 Automatic credit calculation & trading
- 📊 Real-time dashboards & analytics
- 🔐 Secure JWT authentication

**Tech Stack:** Node.js + Express, MongoDB, JavaScript, PLSR ML Model

---

## Quick Start

### Installation (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/your-repo/agrogreenbits
cd agrogreenbits

# 2. Backend setup
cd backend
npm install
# Create .env file:
echo "PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/agrogreenbits
JWT_SECRET=your_secret_key_123" > .env

# 3. Database setup
mongod  # start MongoDB in another terminal
node seed.js  # seed test data

# 4. Start backend
npm start

# 5. Frontend (new terminal)
cd ../frontend
npm start
```

### Access Platform
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Test Farmer: farmer@test.com / farmer123
- Test Buyer: buyer@test.com / buyer123

---

## System Architecture

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ REST API
       ▼
┌──────────────────────┐
│  Express.js Server   │
│  (Port 5000)         │
├──────────────────────┤
│ • Auth & JWT         │
│ • Farmer Routes      │
│ • Buyer Routes       │
│ • Admin Routes       │
│ • AI Predictions     │
└──────┬───────────────┘
       │
   ┌───┴────────────┬─────────────┐
   ▼                ▼             ▼
┌───────────┐  ┌──────────┐  ┌─────────┐
│ MongoDB   │  │PLSR Model│  │Firebase │
│ Database  │  │(Python)  │  │(Auth)   │
└───────────┘  └──────────┘  └─────────┘
```

**Key Components:**
- **Frontend:** HTML/CSS/JavaScript SPA with Chart.js
- **Backend:** Express.js REST API with role-based access
- **Database:** MongoDB with 4 collections (Users, Farms, Readings, Transactions)
- **ML:** PLSR model for SOC prediction (87% accuracy, < 100ms prediction time)
- **Auth:** JWT tokens (7-day expiration) + bcrypt password hashing

---

## Farmer Guide

### Registration & Setup
1. Sign up → Select "Farmer" role → Verify email
2. Register farm (name, location, acreage, soil type)
3. Admin verifies farm (1-2 hours)
4. Install AS7341 sensor & connect to platform

### Record Soil Reading
1. Dashboard → "Record Reading"
2. Select farm & place sensor on soil
3. Capture spectral data (7 wavelengths captured automatically)
4. System auto-calculates SOC value
5. AI confidence score shown

### Generate & Sell Credits
1. View generated credits: "My Credits"
2. Click "List for Sale" → Set price per credit
3. Credits appear on marketplace within 2 hours
4. Buyers can purchase immediately
5. Track earnings: "MyEarnings" section

### Dashboard Summary
```
┌─────────────────────────────────┐
│ FARMER DASHBOARD                │
├─────────────────────────────────┤
│ Total Credits: 1,250            │
│ Credits Listed: 500             │
│ Credits Sold: 750               │
│ Monthly Earnings: €2,500        │
├─────────────────────────────────┤
│ Recent Transactions:            │
│ • Green Valley Farm: 250 credits│
│ • Expected Payment: €3,000      │
└─────────────────────────────────┘
```

**Key Metrics:**
- Average SOC: 25-35 mg/kg
- Credits per reading: SOC × 10
- Average price: €10-15 per credit
- Processing time: 2-5 seconds

---

## Buyer Guide

### Registration & Setup
1. Sign up → Select "Buyer" role → Verify email
2. Enter company details (name, industry, carbon target)
3. Set up payment method
4. Profile ready to browse marketplace

### Browse & Purchase
1. Click "Marketplace" → See all available credits
2. Filter by:
   - Location (region/state)
   - Price range (€5-€20)
   - SOC level (minimum threshold)
   - Farm verification status
3. Click credit listing → Review farm details
4. Check certification & history
5. Click "Purchase" → Confirm details → Pay

### Portfolio Management
1. "My Portfolio" → View all owned credits
2. Summary: Total credits, carbon offset, total spent
3. By-farm breakdown with purchase dates
4. Download certification PDF for each purchase
5. Export portfolio for CSR reporting

### Dashboard Summary
```
┌──────────────────────────────────┐
│ BUYER DASHBOARD                  │
├──────────────────────────────────┤
│ Total Credits Owned: 2,500       │
│ Carbon Offset: 250 tons CO₂      │
│ Total Invested: €25,000          │
│ Carbon Target Progress: 50%      │
├──────────────────────────────────┤
│ Top Acquisitions:                │
│ • Green Valley Farm: 500 credits │
│ • North Field: 300 credits       │
└──────────────────────────────────┘
```

---

## Admin Guide

### User Management
- **View all users:** GET /api/admin/users
- **Verify farmer:** POST /api/admin/farms/{id}/verify
- **Suspend account:** POST /api/admin/users/{id}/suspend
- **View KYC docs:** Check verification status

### Platform Analytics
- **Total users:** Farmers + Buyers count
- **Transaction volume:** Total credits traded
- **Revenue:** Platform commission (typically 10%)
- **Top regions:** Identify active markets
- **Average SOC:** Platform-wide soil health metric

### Verification Process
1. Farmer registers farm
2. Admin reviews documents
3. Verify location on map
4. Check ownership credentials
5. Approve/Reject with notification

---

## API Reference

### Authentication
```json
POST /api/auth/register
{
  "name": "John Farmer",
  "email": "john@farm.com",
  "password": "secure123",
  "role": "farmer"
}

POST /api/auth/login
{
  "email": "john@farm.com",
  "password": "secure123"
}
Response: { token, user }
```

### Farmer Endpoints
```
GET /api/farmer/farms                    // List farms
POST /api/farmer/farms                   // Add farm
POST /api/farmer/readings                // Record soil reading
GET /api/farmer/credits                  // View credits
PUT /api/farmer/credits/list             // List for sale
```

### Buyer Endpoints
```
GET /api/buyer/marketplace               // Browse credits
POST /api/buyer/purchase                 // Buy credits
GET /api/buyer/portfolio                 // View portfolio
GET /api/buyer/transactions              // Transaction history
```

### AI Endpoint
```
POST /api/ai/predict-soc
{
  "spectralData": { wavelength values },
  "soilMoisture": 34.5,
  "temperature": 22.1
}
Response: { socValue, confidence, predictedCredits }
```

### Admin Endpoints
```
GET /api/admin/users                     // List all users
GET /api/admin/analytics                 // Platform stats
POST /api/admin/farms/{id}/verify        // Verify farm
```

---

## Database Schema

**Users Collection**
- _id, name, email, passwordHash, role (farmer/buyer), phone, verified, wallet

**Farms Collection**
- _id, farmerId, name, location, acreage, soilType, cropType, verified

**Readings Collection**
- _id, farmId, sensorId, spectralData, soilMoisture, temperature, socValue, confidence

**Transactions Collection**
- _id, farmerId, buyerId, credits, totalPrice, status, createdAt

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB won't connect** | Start MongoDB: `mongod` or check MONGO_URI in .env |
| **Port 5000 in use** | Kill process: `netstat -ano \| findstr :5000` then `taskkill /PID {id} /F` |
| **npm modules missing** | Run `npm install` in backend & frontend directories |
| **401 Unauthorized** | Check JWT token in localStorage, verify JWT_SECRET in .env |
| **SOC prediction fails** | Verify sensor data format (7 values), check model file exists |
| **Slow API response** | Add database indexes, check network latency |

---

## Deployment

### Heroku (Recommended)
```bash
heroku login
heroku create agrogreenbits-api
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### MongoDB Atlas
1. Create account at mongodb.com/cloud/atlas
2. Create cluster & user
3. Copy connection string to .env
4. Enable IP whitelist

### Frontend Hosting
- **Vercel:** `vercel deploy`
- **Netlify:** Drag-and-drop or `netlify deploy`

---

## Security Checklist

- ✅ Use HTTPS in production
- ✅ Hash passwords with bcrypt
- ✅ Validate all API inputs
- ✅ Set rate limiting on endpoints
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Enable MongoDB authentication
- ✅ Implement CORS properly

---

## Machine Learning Model

**PLSR Model (Production v2)**
- R² Score: 0.87 (87% accuracy)
- RMSE: 1.2 mg/kg
- Prediction time: <100ms
- Training data: 10,000+ soil samples (OSSL)
- Wavelengths: 415, 445, 480, 510, 645, 880 nm

**Retrain Model:**
```bash
cd backend/ml
python train_plsr_ossl.py  # Train with new data
# Check metrics in models/plsr_ossl_metrics.json
# If approved, deploy to production
```

---

## Test Accounts

```
Farmer:  farmer@test.com / farmer123
Buyer:   buyer@test.com / buyer123
Admin:   admin@test.com / admin123
```

---

## Contact & Support

| Channel | Details |
|---------|---------|
| Email | support@agrogreenbits.com |
| Documentation | https://docs.agrogreenbits.com |
| GitHub Issues | https://github.com/agrogreenbits/issues |
| Community | https://forum.agrogreenbits.com |

---

## Quick Reference Card

**Installation:** `npm install && npm start`
**Database:** MongoDB on port 27017
**API:** http://localhost:5000
**Frontend:** http://localhost:3000
**JWT Duration:** 7 days
**SOC Formula:** Credits = SOC × 10
**Prediction:** <100ms per soil reading
**Model Accuracy:** 87% (R²=0.87)

**Key Roles:** 
- Farmer: Record readings, sell credits
- Buyer: Browse marketplace, purchase credits
- Admin: Verify users, oversee platform

---

*Last Updated: April 2026*  
*Build your sustainable future with AgroGreenBits*
