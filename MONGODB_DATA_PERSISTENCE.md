# MongoDB Data Persistence Guide
## AgroGreenBits - Complete Data Flow

---

## 📊 Database Schema Overview

### Collections & Models

#### 1. **User Collection**
Stores all user accounts (farmers, buyers, admins)

**Fields Saved:**
- `name` - User full name
- `email` - Email address (unique)
- `password` - Hashed password (bcrypt)
- `role` - User type: 'farmer' | 'buyer' | 'admin'
- `phone` - Phone number
- `companyName` - Company name (for buyers)
- `bio` - User biography
- `location` - User location
- `profileImage` - Base64 or URL of profile picture
- `language` - Preferred language: 'en' | 'hi'
- `isActive` - Account status
- `timestamps` - createdAt, updatedAt

**API Endpoints:**
- `POST /api/auth/register` - Create new user account
- `GET /api/profile` - Fetch user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/password` - Change password

---

#### 2. **Farm Collection**
Stores farm details and carbon credit data

**Fields Saved:**
- `userId` - Reference to User (farmer owner)
- `name` - Farm name
- `location` - Farm location
- `area` - Farm area in hectares
- `soilType` - Type of soil
- `socReadings[]` - Array of SOC (Soil Organic Carbon) readings
  - `value` - SOC percentage
  - `depth` - Sample depth (cm)
  - `spectralData[]` - Raw sensor data
  - `predictedAt` - Timestamp of reading
  - `source` - 'manual' | 'ai' | 'lab'
- `currentSOC` - Latest SOC reading
- `totalCredits` - Total credits ever generated
- `availableCredits` - Credits available to sell
- `soldCredits` - Credits already sold
- `listing` - Marketplace listing details
  - `isListed` - Whether farm is on marketplace
  - `listedCredits` - Number of credits for sale
  - `pricePerCredit` - Price in INR
  - `listedAt` - When listed
- `isVerified` - Admin verification status
- `verifiedAt` - Verification timestamp
- `verificationNote` - Admin notes
- `timestamps` - createdAt, updatedAt

**API Endpoints:**
- `POST /api/farmer/farm` - Create new farm
- `GET /api/farmer/farms` - Get all farms for farmer
- `GET /api/farmer/farm/:farmId` - Get farm details
- `PUT /api/farmer/farm/:farmId` - Update farm details
- `POST /api/farmer/sell-credits` - List credits for sale
- `POST /api/admin/verify-farm` - Admin verification
- `GET /api/admin/farms` - Get all farms (admin)

---

#### 3. **Transaction Collection**
Records every carbon credit purchase

**Fields Saved:**
- `buyerId` - Reference to User (buyer)
- `farmerId` - Reference to User (farmer)
- `farmId` - Reference to Farm
- `credits` - Number of credits purchased
- `pricePerCredit` - Price at time of purchase (INR)
- `totalAmount` - credits × pricePerCredit
- `status` - 'pending' | 'completed' | 'failed' | 'refunded'
- `paymentRef` - Payment reference ID
- `paymentMethod` - Payment method used
- `co2OffsetTonnes` - CO₂ equivalent offset (1 credit = 1 tonne)
- `socAtSale` - Farm's SOC at time of transaction
- `timestamps` - createdAt, updatedAt

**API Endpoints:**
- `POST /api/buyer/buy-credits` - Purchase credits
- `GET /api/farmer/transactions` - Get farmer sales history
- `GET /api/buyer/transactions` - Get buyer purchase history

---

## 🔄 Complete Data Flow by User Actions

### 👨‍🌾 FARMER OPERATIONS

#### 1. **Farmer Registration**
```
Frontend Action: User clicks register → fills form
→ Frontend calls: POST /api/auth/register
→ Backend saves: New User document in MongoDB
→ Data persisted: name, email, hashed password, role='farmer'
```

#### 2. **Add New Farm**
```
Frontend Action: Farmer clicks "Add Farm" → fills details
→ Frontend calls: POST /api/farmer/farm
→ Backend saves: New Farm document with:
   - userId (farmer's ID)
   - name, location, area, soilType
   - initialSOC → calculated credits
   - currentSOC, totalCredits, availableCredits
→ Data persisted: ✅ MONGODB
```

#### 3. **List Credits for Sale**
```
Frontend Action: Farmer selects farm → enters credits & price → clicks "List"
→ Frontend calls: POST /api/farmer/sell-credits
→ Backend saves: Updates Farm document:
   - listing.isListed = true
   - listing.listedCredits = amount
   - listing.pricePerCredit = price
   - listing.listedAt = timestamp
→ Data persisted: ✅ MONGODB (Farm collection)
```

#### 4. **View Dashboard**
```
Frontend Action: Farmer opens "Dashboard" tab
→ Frontend calls: GET /api/farmer/dashboard
→ Backend retrieves from MongoDB:
   - All farms for this farmer
   - Calculate: totalArea, totalCredits, avgSOC
   - Recent transactions (last 10)
   - Total earnings
→ All data: ✅ FROM MONGODB
```

#### 5. **View Farms List**
```
Frontend Action: Farmer opens "My Farms" tab
→ Frontend calls: GET /api/farmer/farms
→ Backend retrieves: All Farm documents where userId = farmer's ID
→ All data: ✅ FROM MONGODB
```

#### 6. **View Transaction History**
```
Frontend Action: Farmer opens "History" tab
→ Frontend calls: GET /api/farmer/transactions
→ Backend retrieves: All Transaction documents where farmerId = farmer's ID
→ All data: ✅ FROM MONGODB
```

#### 7. **Update Profile**
```
Frontend Action: Farmer updates name/phone/bio/location in profile
→ Frontend calls: PUT /api/profile
→ Backend saves: Updates User document with:
   - name, phone, bio, location, profileImage
→ Data persisted: ✅ MONGODB (User collection)
```

---

### 👤 BUYER OPERATIONS

#### 1. **Buyer Registration**
```
Frontend Action: User clicks register → selects "Buyer" role
→ Frontend calls: POST /api/auth/register
→ Backend saves: New User document in MongoDB
→ Data persisted: name, email, hashed password, role='buyer'
```

#### 2. **Browse Marketplace**
```
Frontend Action: Buyer opens "Marketplace" tab
→ Frontend calls: GET /api/buyer/marketplace
→ Backend retrieves from MongoDB:
   - All Farm documents where listing.isListed = true
   - Filters applied: location, price, verified status
→ All data: ✅ FROM MONGODB
```

#### 3. **Purchase Credits**
```
Frontend Action: Buyer selects listing → enters amount → clicks "Buy"
→ Frontend calls: POST /api/buyer/buy-credits
→ Backend:
   - Creates new Transaction document:
     * buyerId, farmerId, farmId
     * credits, pricePerCredit, totalAmount
     * co2OffsetTonnes, socAtSale
   - Updates Farm document:
     * listing.listedCredits -= amount
     * availableCredits -= amount
     * soldCredits += amount
→ Data persisted: ✅ MONGODB (Transaction + Farm documents)
```

#### 4. **View Portfolio**
```
Frontend Action: Buyer opens "Portfolio" tab
→ Frontend calls: GET /api/buyer/marketplace (for holdings)
→ Backend retrieves: Holdings data from MongoDB
→ All data: ✅ FROM MONGODB
```

#### 5. **View Purchase History**
```
Frontend Action: Buyer opens "History" tab
→ Frontend calls: GET /api/buyer/transactions
→ Backend retrieves: All Transaction documents where buyerId = buyer's ID
→ All data: ✅ FROM MONGODB
```

#### 6. **Update Company Profile**
```
Frontend Action: Buyer updates company name/details in profile
→ Frontend calls: PUT /api/profile
→ Backend saves: Updates User document with:
   - name, companyName, phone, bio, location
→ Data persisted: ✅ MONGODB (User collection)
```

---

### 🔐 ADMIN OPERATIONS

#### 1. **View Admin Dashboard**
```
Frontend Action: Admin opens dashboard
→ Frontend calls: GET /api/admin/dashboard
→ Backend calculates from MongoDB:
   - totalFarms (count)
   - verifiedFarms, pendingFarms (counts)
   - totalCredits (sum of all credits)
   - totalUsers (count farmers + buyers)
   - totalTransactions (count completed)
→ All data: ✅ FROM MONGODB
```

#### 2. **View All Farms**
```
Frontend Action: Admin opens "Farms" tab
→ Frontend calls: GET /api/admin/farms
→ Backend retrieves from MongoDB:
   - All Farm documents (no filter)
   - Includes verification status
→ All data: ✅ FROM MONGODB
```

#### 3. **Verify Farm**
```
Frontend Action: Admin clicks farm → clicks "Verify" → adds note
→ Frontend calls: POST /api/admin/verify-farm
→ Backend saves: Updates Farm document:
   - isVerified = true
   - verifiedAt = timestamp
   - verificationNote = admin's note
→ Data persisted: ✅ MONGODB (Farm collection)
```

#### 4. **View Transactions**
```
Frontend Action: Admin can view marketplace/transaction data
→ Frontend calls: GET /api/buyer/marketplace or transaction endpoints
→ Backend retrieves from MongoDB:
   - Transaction documents with transaction details
→ All data: ✅ FROM MONGODB
```

---

## 📋 Data Persistence Checklist

| Operation | Frontend | Backend Route | MongoDB Save |
|-----------|----------|---------------|--------------|
| Register User | ✅ | POST /auth/register | ✅ User |
| Add Farm | ✅ | POST /farmer/farm | ✅ Farm |
| List Credits | ✅ | POST /farmer/sell-credits | ✅ Farm |
| Buy Credits | ✅ | POST /buyer/buy-credits | ✅ Transaction + Farm |
| Verify Farm | ✅ | POST /admin/verify-farm | ✅ Farm |
| Update Profile | ✅ | PUT /profile | ✅ User |
| Change Password | ✅ | PUT /profile/password | ✅ User |
| Get Dashboard | ✅ | GET /farmer/dashboard | ✅ From MongoDB |
| Get Marketplace | ✅ | GET /buyer/marketplace | ✅ From MongoDB |
| Get Transactions | ✅ | GET /farmer/transactions | ✅ From MongoDB |
| Download Receipt | ✅ | N/A (Client-side PDF) | ✅ Reads from MongoDB |

---

## 🔗 API Configuration

**Base URL:** `http://localhost:5000/api` (configurable in frontend settings)

**Database:** MongoDB URI from `.env` file

**Authentication:** JWT Token stored in localStorage

**CORS Enabled For:**
- http://localhost:5173
- http://localhost:5174
- http://127.0.0.1:5500 (VS Code Live Server)
- http://localhost:8080

---

## 💾 Storage Summary

### Data Stored in MongoDB:
- ✅ All user accounts
- ✅ All farms & SOC readings
- ✅ All credit listings
- ✅ All transactions
- ✅ Verification records
- ✅ User profiles & settings

### Data Stored in Browser (localStorage):
- 🔐 JWT authentication token
- 👤 Current user info
- 🌐 Backend URL configuration
- 🗣️ Language preference (transient)

### Data Stored in Browser Memory (session only):
- 📊 Dashboard charts (recreated on load)
- 🏷️ UI state (modals, tabs, selections)
- 🔢 Temporary form values

---

## ✅ Verification Steps

To verify all data is being saved:

1. **Check MongoDB Collections:**
   ```bash
   mongosh
   use agrogreenbits
   db.users.find()
   db.farms.find()
   db.transactions.find()
   ```

2. **Monitor Backend Logs:**
   - Watch console for API requests
   - Verify "✅ MongoDB connected" on server startup

3. **Test Persistence:**
   - Create farmer account → Verify in MongoDB
   - Add farm → Check mongosh for new farm document
   - List credits → Confirm farm.listing updated
   - Buy credits → Check transaction + farm updates

---

## 🚀 Data Backup & Recovery

**Important Files to Backup:**
- `.env` - Database connection string
- `models/` - Schema definitions
- MongoDB database itself

**Recovery Process:**
1. Restore MongoDB database
2. Ensure `.env` has correct MONGO_URI
3. Restart backend server
4. All data will be available immediately

---

**Last Updated:** April 5, 2026  
**Status:** All operations properly persisted to MongoDB ✅
