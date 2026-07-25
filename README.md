# 🌿 AgroGreenBits – AI-Based Carbon Credit Platform

A full-stack web platform connecting farmers and companies in a carbon credit marketplace. Farmers generate carbon credits using soil data (SOC – Soil Organic Carbon) predicted by AI models using spectroscopy sensor data. Companies purchase these credits to offset emissions.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Using the Platform](#using-the-platform)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## ✨ Features

### **Farmer Features**
- 🌾 Register and manage multiple farms
- 📊 Monitor Soil Organic Carbon (SOC) levels over time
- 🤖 AI-powered SOC prediction from spectroscopy sensor data
- 💳 Automatic carbon credit calculation
- 📈 List credits for sale on marketplace
- 💰 Track earnings and transaction history
- 📱 Responsive mobile & desktop dashboard

### **Buyer (Company) Features**
- 🛒 Browse verified carbon credits on marketplace
- 🔍 Filter by location, price, and carbon amount
- ✅ Purchase carbon credits from farmers
- 💼 View portfolio of purchased credits
- 📋 Track purchase history and CO₂ offset
- 📊 Monitor total carbon portfolio

### **Platform Features**
- 🔐 Secure JWT-based authentication
- 🛡️ Role-based access control (Farmer/Buyer)
- 📊 Interactive charts (Chart.js)
- 🌍 Green eco-friendly UI design
- ⚡ Real-time data updates
- 💾 Cloud-based database (MongoDB)
- 🤖 AI SOC prediction engine (simulated)

---

## 🛠 Tech Stack

### **Backend**
- **Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing
- **Utilities:** dotenv, CORS

### **Frontend**
- **Language:** Vanilla HTML/CSS/JavaScript
- **Charts:** Chart.js v4.4.1
- **Styling:** Custom CSS with design system
- **State Management:** In-memory JavaScript
- **Storage:** localStorage for token & user persistence

### **Infrastructure**
- **Server:** Node.js (v14+)
- **Package Manager:** npm
- **Environment:** Development & Production ready

---

## 📁 Project Structure

```
agrogreenbits/
├── backend/
│   ├── .env                    # Environment variables
│   ├── server.js               # Main Express server
│   ├── package.json            # Backend dependencies
│   ├── seed.js                 # Database seeding script
│   ├── middleware/
│   │   └── auth.js             # JWT & role authorization
│   ├── models/
│   │   ├── User.js             # User schema (Farmer/Buyer)
│   │   ├── Farm.js             # Farm & SOC readings schema
│   │   └── Transaction.js      # Carbon credit transactions
│   └── routes/
│       ├── auth.js             # Authentication endpoints
│       ├── farmer.js           # Farmer dashboard & operations
│       ├── buyer.js            # Buyer marketplace & portfolio
│       └── ai.js               # AI prediction endpoint
│
├── frontend/
│   ├── index.html              # Complete SPA application
│   └── package.json            # Frontend metadata
│
└── README.md                    # This file
```

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (Local or Cloud)
   - **Local:** Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Cloud (Recommended):** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

3. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com/)

4. **Code Editor** (VS Code recommended)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

---

## 📦 Installation

### **Step 1: Clone/Download the Project**

```bash
cd c:\Users\vikas\OneDrive\Desktop\carbon@soil\agrogreenbits
```

### **Step 2: Install Backend Dependencies**

```bash
cd backend
npm install
```

This installs:
- express
- mongoose
- cors
- dotenv
- jsonwebtoken
- bcryptjs
- nodemon (dev)

### **Step 3: Configure Environment Variables**

Edit `backend/.env` with your settings:

```env
# Database
MONGO_URI=mongodb://localhost:27017/agrogreenbits

# Authentication
JWT_SECRET=agrogreenbits_jwt_secret_key_2024_change_in_production_env

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:8080
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agrogreenbits
```

### **Step 4: Seed the Database** (Optional but recommended)

```bash
node seed.js
```

This creates:
- Demo farmer account: `farmer@demo.com` / `pass123`
- Demo buyer account: `buyer@demo.com` / `pass123`
- Sample farms with SOC readings
- Sample transactions

---

## 🚀 Running Locally

### **Option 1: Using npm scripts**

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev    # Uses nodemon for auto-reload
```

Expected output:
```
🌿 AgroGreenBits API running on https://carbon-credit-q7fp.onrender.com
✅ MongoDB connected
```

**Terminal 2 - Serve Frontend:**
```bash
cd frontend
python -m http.server 8080
```

Or use VS Code Live Server extension.

Expected output:
```
Serving HTTP on 0.0.0.0 port 8080
```

### **Option 2: Using node directly**

```bash
cd backend
node server.js
```

### **Step 3: Open in Browser**

Navigate to: `http://localhost:8080`

---

## 💾 Database Setup

### **Using MongoDB Locally**

1. **Install MongoDB Community Edition:**
   - Windows: [MongoDB Community Download](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow official docs

2. **Start MongoDB:**
   ```bash
   # Windows
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Connection:**
   ```bash
   mongo  # or mongosh for newer versions
   ```

### **Using MongoDB Atlas (Cloud - Recommended)**

1. **Create Free Account:** [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster:**
   - Select "Create" → Choose free tier
   - Wait for cluster to deploy (~10 min)

3. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Update `.env` with your credentials

4. **Update `.env`:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/agrogreenbits?retryWrites=true&w=majority
   ```

### **MongoDB Data Persistence**

**All data is automatically saved to MongoDB:**

| Data Type | Saved When | Collection | Keys Stored |
|-----------|-----------|------------|------------|
| **User Accounts** | Registration completed | `users` | name, email, password(hashed), role, phone, company, bio, location, profileImage |
| **Farms** | Farm added by farmer | `farms` | name, location, area, SOC readings, totalCredits, availableCredits, listing status, verification |
| **Farm Listings** | Farmer lists credits | `farms` | listing.isListed, listing.listedCredits, listing.pricePerCredit, listing.listedAt |
| **Transactions** | Buyer purchases credits | `transactions` | buyerId, farmerId, credits, pricePerCredit, totalAmount, status, CO₂ offset |
| **Verification** | Admin verifies farm | `farms` | isVerified, verifiedAt, verificationNote |
| **Profiles** | User updates profile | `users` | name, phone, bio, location, profileImage, language |

**See [MONGODB_DATA_PERSISTENCE.md](./MONGODB_DATA_PERSISTENCE.md) for complete data flow documentation.**

---

## 📡 API Documentation

### **Base URL**
```
https://carbon-credit-q7fp.onrender.com
```

### **Authentication Endpoints**

#### **POST /auth/register**
Create a new user account.

**Request:**
```json
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

#### **POST /auth/login**
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "farmer@demo.com",
  "password": "pass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ramesh Patil",
    "role": "farmer"
  }
}
```

---

### **Farmer Endpoints** (Requires: `role: farmer` + valid JWT)

#### **GET /farmer/dashboard**
Get farmer dashboard summary.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalFarms": 3,
      "totalArea": 25.7,
      "avgSOC": 2.7,
      "totalCredits": 422,
      "availableCredits": 256,
      "totalEarnings": 195000
    },
    "farms": [...],
    "recentTransactions": [...]
  }
}
```

#### **POST /farmer/farm**
Add a new farm.

**Request:**
```json
{
  "name": "North Field",
  "location": "Nashik, Maharashtra",
  "area": 8.5,
  "soilType": "Black (Regur)",
  "initialSOC": 2.8
}
```

**Response:**
```json
{
  "success": true,
  "message": "Farm added. 142 carbon credits calculated.",
  "data": {
    "farm": {...},
    "calculation": {
      "soc": 2.8,
      "carbonStock": 3.432,
      "co2Equivalent": 12.595,
      "credits": 142
    }
  }
}
```

#### **GET /farmer/farms**
Get all farms for logged-in farmer.

#### **POST /farmer/sell-credits**
List credits for sale on marketplace.

**Request:**
```json
{
  "farmId": "507f1f77bcf86cd799439011",
  "listedCredits": 80,
  "pricePerCredit": 750
}
```

---

### **Buyer Endpoints** (Requires: `role: buyer` + valid JWT)

#### **GET /buyer/marketplace**
Browse available carbon credits.

**Query Parameters:**
```
?location=Maharashtra&minPrice=500&maxPrice=1000&minCredits=50&verifiedOnly=true
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "farmId": "507f1f77bcf86cd799439011",
      "farmName": "North Field",
      "farmer": "Ramesh Patil",
      "location": "Nashik, Maharashtra",
      "soc": 2.8,
      "credits": 80,
      "pricePerCredit": 750,
      "isVerified": true
    }
  ]
}
```

#### **POST /buyer/buy-credits**
Purchase carbon credits.

**Request:**
```json
{
  "farmId": "507f1f77bcf86cd799439011",
  "credits": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully purchased 50 credits for ₹37,500",
  "data": {
    "transaction": {...},
    "receipt": {
      "paymentRef": "PAY-1704067200000",
      "credits": 50,
      "pricePerCredit": 750,
      "totalAmount": 37500,
      "farmer": "Ramesh Patil",
      "co2OffsetTonnes": 50
    }
  }
}
```

#### **GET /buyer/portfolio**
Get buyer's portfolio and purchase history.

---

### **AI Endpoint**

#### **POST /predict**
Run AI SOC prediction from spectral data.

**Request:**
```json
{
  "spectral_data": [0.45, 0.52, 0.48, ...],
  "depth": 15,
  "farmId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "soc": 2.85,
    "carbonStock": 3.505,
    "co2Equivalent": 12.863,
    "credits": 145,
    "confidence": 87,
    "depth": 15,
    "wavelengths": [400, 450, 500, ...]
  }
}
```

---

## 🎯 Using the Platform

### **For Farmers:**

1. **Register** as a Farmer
2. **Add Farm** - Click "Add Farm", enter details and initial SOC
3. **Check Dashboard** - View SOC, credits, and earnings
4. **AI Prediction** - Use spectral data to get SOC predictions
5. **List Credits** - Click "List for Sale", set amount and price
6. **Track Sales** - Monitor in "Transaction History"

### **For Buyers:**

1. **Register** as a Company/Buyer
2. **Browse Marketplace** - View available credits
3. **Filter** - By location, price, or amount
4. **Purchase** - Select farm, enter quantity, confirm
5. **View Portfolio** - See holdings and offset carbon
6. **Track Purchases** - Transaction history

### **Demo Accounts:**

Already seeded in database:

| Role   | Email              | Password | Company           |
|--------|-------------------|----------|------------------|
| Farmer | farmer@demo.com   | pass123  | -                |
| Buyer  | buyer@demo.com    | pass123  | GreenFuture Corp |

---

## 🐛 Troubleshooting

### **"Cannot connect to MongoDB"**
```
✗ Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Ensure MongoDB is running
2. Check connection string in .env
3. For local MongoDB: mongod should be running
4. For Atlas: Check IP whitelist and credentials
```

### **"Port 5000 already in use"**
```
Solution:
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port in .env
PORT=5001
```

### **"JWT token invalid"**
```
Solution:
1. Clear localStorage: Press F12 → Application → localStorage → Clear
2. Log out and log in again
3. Check JWT_SECRET in .env matches backend
```

### **Frontend not connecting to backend**
```
Error: Failed to fetch from https://carbon-credit-q7fp.onrender.com

Solution:
1. Verify backend is running on port 5000
2. Check CORS settings in server.js
3. Check API_BASE_URL in frontend index.html
4. Verify no firewall blocking port 5000
```

### **"Database seed failed"**
```
Solution:
1. Ensure MongoDB is running
2. Check MONGO_URI in .env
3. Run: node seed.js again
4. Check terminal for specific error
```

---

## 🚢 Deployment

### **Deployment Checklist**

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Set `MONGO_URI` to production MongoDB
- [ ] Ensure frontend API URL points to production backend
- [ ] Test all API endpoints
- [ ] Set up HTTPS certificate
- [ ] Configure CORS for production domain

### **Deploy to Heroku**

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku App:**
   ```bash
   heroku create agrogreenbits-app
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGO_URI=mongodb+srv://...
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### **Deploy to AWS/GCP/Azure**

Use containerization with Docker:

**Dockerfile:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY backend/package.json .
RUN npm install
COPY backend/ .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and deploy using platform's CLI tools.

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Introduction](https://docs.mongodb.com/manual/)
- [JWT Explained](https://jwt.io/introduction)
- [Chart.js Guide](https://www.chartjs.org/docs/latest/)

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**AgroGreenBits Development Team**

For questions or support, contact: support@agrogreenbits.com

---

## 🌍 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Last Updated:** April 2024  
**Version:** 1.0.0

---

Made with 🌿 for sustainable agriculture and carbon offsetting.
