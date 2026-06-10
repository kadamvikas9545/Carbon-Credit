# Farm Verification System 🔐

## Overview
Complete farm verification workflow where admins review and verify carbon credits from farmers.

---

## Demo Accounts

### 1. **Admin Account** (NEW - Verification)
- **Email**: `admin@demo.com`
- **Password**: `pass123`
- **Role**: Admin
- **Access**: Admin Dashboard

### 2. **Farmer Account** (Existing)
- **Email**: `farmer@demo.com`
- **Password**: `pass123`
- **Role**: Farmer
- **Access**: Farm management, AI spectral analysis

### 3. **Buyer Account** (Existing)
- **Email**: `buyer@demo.com`
- **Password**: `pass123`
- **Role**: Buyer
- **Access**: Marketplace (verified credits only)

---

## How Verification Works

### **Status Flow**

```
Farmer Creates Farm
    ↓
    isVerified = false  ⏳ "Pending Verification" (amber badge)
    ↓
Admin Reviews Farm in Admin Dashboard
    ├─ Checks SOC % accuracy
    ├─ Reviews spectral data
    ├─ Verifies location & soil type
    ├─ Adds verification notes (optional)
    ↓
Admin Clicks "✓ Verify Farm"
    ↓
    isVerified = true   ✅ "✓ Verified" (green badge)
    verifiedAt = now
    verificationNote = saved
    ↓
Farmers Can Now List Verified Credits on Marketplace
    ↓
Buyers Can Purchase (Filter: "Verified only")
```

---

## Admin Dashboard Features

### **Statistics Panel**
- 📊 **Total Farms**: Count of all farms in system
- ✅ **Verified**: Count of verified farms
- ⏳ **Pending**: Count of farms awaiting verification
- 💰 **Total Credits**: All credits across system

### **Farm List**
- View all farms with details:
  - Farm name & farmer
  - Location, soil type, area
  - SOC %, credits generated
  - Verification status (badge)

### **Filter Options**
- Show all farms
- Show verified only
- Show pending only

### **Actions**
- **✓ Verify Farm**: Opens verification modal
- **Details**: View full farm information
- **Verification Notes**: Add optional notes when confirming

---

## Database Fields

### Farm Model
```javascript
{
  isVerified: Boolean,      // default: false
  verifiedAt: Date,         // When verified
  verificationNote: String  // Admin's notes
}
```

### User Model  
```javascript
{
  role: enum['farmer', 'buyer', 'admin']  // NEW: 'admin' added
}
```

---

## How to Test

### **Step 1: Reseed Database**
```bash
cd c:\Users\vikas\OneDrive\Desktop\carbon@soil\agrogreenbits\backend
node seed.js
```
This creates:
- 1 farmer with 3 farms (2 verified, 1 pending)
- 1 buyer
- 1 admin

### **Step 2: Login as Admin**
1. Go to http://localhost:5000
2. Login with `admin@demo.com` / `pass123`
3. See **Admin Dashboard**

### **Step 3: Verify a Farm**
1. Find "East Farm" (Pending Verification)
2. Click **✓ Verify Farm** button
3. Add optional notes
4. Click **Verify Farm**
5. Farm now shows ✅ **Verified**

### **Step 4: See Results**
- Login as Farmer → Farm shows ✅ Verified
- Login as Buyer → Can filter "Verified only"
- Dashboard shows updated stats

---

## API Endpoints

### **Verify Farm** (Admin)
```http
POST /api/auth/verify-farm
Content-Type: application/json
Authorization: Bearer {token}

{
  "farmId": "507f1f77bcf86cd799439011",
  "verificationNote": "Verified - sensor data valid"
}

Response:
{
  "success": true,
  "message": "Farm \"East Farm\" has been verified.",
  "data": { farm object }
}
```

### **Get All Farms** (Admin Dashboard)
```http
GET /api/buyer/marketplace
Authorization: Bearer {token}
```

Returns all farms with verification status.

---

## Frontend Changes

### New Admin Screen
- Located after login check
- Auto-routes admin users to Admin Dashboard
- Separate layout from farmer/buyer screens

### New Modal
- **Verification Modal**: Confirm verification with notes
- Shows farm details before confirming

### Updated Login Flow
```javascript
if (role === 'farmer') → Farmer Screen
if (role === 'buyer') → Buyer Screen
if (role === 'admin') → Admin Dashboard
```

---

## Unverified vs Verified Farms

### **Pending Farm** ⏳
```
Status: Pending Verification (amber badge)
Marketplace: NOT visible to buyers
Farmer: Can see ⏳ badge on dashboard
Credits: Cannot list yet (optional feature)
```

### **Verified Farm** ✅
```
Status: ✓ Verified (green badge)
Marketplace: Visible to all buyers
Farmer: Can see ✅ badge + can list credits
Credits: Can be sold to buyers
```

---

## Key Features

✅ **Real API Integration**
- Syncs with actual `/verify-farm` endpoint
- Updates database correctly

✅ **Live Statistics**
- Dashboard shows real-time farm counts
- Updates after each verification

✅ **Verification Notes**
- Admin can add context for verification
- Saved to database

✅ **Filter & Search**
- View all/verified/pending farms
- Quick visual identification

✅ **Mobile Responsive**
- Admin dashboard works on all devices
- Touch-friendly buttons

---

## Next Steps (Optional Enhancements)

1. **Farm Details Modal**: Show full farm history, spectral data
2. **Rejection Workflow**: Reject farms with reason
3. **Batch Verification**: Verify multiple farms at once
4. **Audit Log**: Track who verified what & when
5. **Email Notification**: Notify farmers when verified
6. **Admin Roles**: Different permission levels (viewer, verifier, admin)

---

**System Ready!** 🚀

Login with `admin@demo.com` to start verifying farms.
