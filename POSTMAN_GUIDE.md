# 📮 Postman Collection Guide - AgroGreenBits API Testing

## What is This?

A **Postman Collection** is a pre-built set of API requests that you can use to test your backend APIs without writing code. It's perfect for:
- ✅ Testing endpoints manually
- ✅ Verifying response formats
- ✅ Testing different user roles
- ✅ Complete workflow testing
- ✅ Documentation

---

## 📥 How to Import the Collection

### **Step 1: Download Postman**
- Go to [postman.com](https://www.postman.com/downloads/)
- Download and install Postman (Desktop app recommended)
- Create a free account

### **Step 2: Import Collection**

**Option A: Import from File**
1. Open Postman
2. Click **Import** button (top left)
3. Select **Upload Files**
4. Choose: `AgroGreenBits_API_Collection.postman_collection.json`
5. Click **Import**

**Option B: Import from Link**
1. Click **Import**
2. Paste URL if hosting online
3. Click **Import**

---

## 🔧 Setup Environment Variables

Before testing, set up variables:

### **Step 1: Create Environment**
1. Click **Environments** (left sidebar)
2. Click **Create**
3. Name it: `AgroGreenBits Local`
4. Add variables:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:5000/api` |
| `farmer_token` | (empty - you'll fill this) |
| `buyer_token` | (empty - you'll fill this) |
| `farm_id` | (empty - you'll fill this) |

5. Click **Save**

### **Step 2: Select Environment**
- Top right corner, select **AgroGreenBits Local** from dropdown

---

## 📋 Testing Workflow

### **1. Seed Database (Optional)**

First, populate demo data:

```bash
cd backend
node seed.js
```

This creates:
- ✅ Demo farmer: farmer@demo.com / pass123
- ✅ Demo buyer: buyer@demo.com / pass123
- ✅ 3 sample farms with SOC readings

---

### **2. Start Backend**

```bash
cd backend
npm run dev
```

Expected output:
```
🌿 AgroGreenBits API running on http://localhost:5000
✅ MongoDB connected
```

---

### **3. Test Authentication**

#### **Login as Farmer**

1. Open collection → **Authentication** folder
2. Click **Login - Farmer (Demo)**
3. Click **Send**
4. Copy the `token` from response
5. Set it as `{{farmer_token}}` variable:
   - Click **Environments** → Select your environment
   - Paste token in `farmer_token` variable
   - Click **Save**

#### **Login as Buyer**

1. Click **Login - Buyer (Demo)**
2. Click **Send**
3. Copy token and set as `{{buyer_token}}`

✅ **Now authenticated!**

---

### **4. Test Farmer Operations**

#### **Add a Farm**

1. **Farmer Operations** → **Add Farm**
2. Click **Send**
3. Response shows: Farm ID, name, credits calculated
4. Copy `farm_id` from response
5. Set it as `{{farm_id}}` variable in environment

#### **List Credits**

1. **Farmer Operations** → **List Credits for Sale**
2. Update `farmId` in body (use `{{farm_id}}`)
3. Set `listedCredits: 80` and `pricePerCredit: 750`
4. Click **Send**

---

### **5. Test Buyer Operations**

#### **Browse Marketplace**

1. Switch to `{{buyer_token}}` in environment
2. **Buyer Operations** → **Browse Marketplace (All)**
3. Click **Send**
4. See all listed credits

#### **Buy Credits**

1. **Buyer Operations** → **Buy Credits**
2. Use same `{{farm_id}}` from farmer's farm
3. Set `credits: 50`
4. Click **Send**
5. Verify purchase successful

---

### **6. Test AI Prediction**

1. **AI Prediction** → **Predict SOC**
2. Ensure `{{farmer_token}}` is active
3. Provide spectral data (array of 30 values between 0-1)
4. Click **Send**
5. Get SOC prediction, carbon stock, credits calculated

---

## 📊 Request Examples

### **Register New Farmer**

```json
POST /auth/register
{
  "name": "John Farmer",
  "email": "john@farm.com",
  "password": "password123",
  "role": "farmer",
  "phone": "+91 98765 43210"
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
    "email": "john@farm.com",
    "role": "farmer"
  }
}
```

---

### **Add Farm**

```json
POST /farmer/farm
Authorization: Bearer {{farmer_token}}

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
    "farm": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "North Field",
      "credits": 142,
      ...
    },
    "calculation": {
      "soc": 2.8,
      "carbonStock": 3.432,
      "co2Equivalent": 12.595,
      "credits": 142
    }
  }
}
```

---

### **Buy Credits**

```json
POST /buyer/buy-credits
Authorization: Bearer {{buyer_token}}

{
  "farmId": "507f1f77bcf86cd799439012",
  "credits": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully purchased 50 credits for ₹37,500",
  "data": {
    "transaction": {
      "_id": "507f1f77bcf86cd799439013",
      "credits": 50,
      "totalAmount": 37500,
      ...
    },
    "receipt": {
      "paymentRef": "PAY-1704067200000",
      "credits": 50,
      "totalAmount": 37500,
      "farmer": "Ramesh Patil"
    }
  }
}
```

---

## 🧪 Complete Test Scenarios

### **Scenario 1: Farmer Workflow**

```
1. Login as Farmer ✅
2. Get Dashboard ✅
3. Add Farm ✅
4. List Credits for Sale ✅
5. Get All Farms ✅
6. Get Transactions ✅
```

### **Scenario 2: Buyer Workflow**

```
1. Login as Buyer ✅
2. Browse Marketplace ✅
3. Buy Credits ✅
4. Get Portfolio ✅
5. View Transactions ✅
```

### **Scenario 3: AI Prediction**

```
1. Login as Farmer ✅
2. Predict SOC from spectral data ✅
3. Verify credits calculated ✅
4. Check Farm updated ✅
```

---

## 🚨 Common Issues & Solutions

### **401 Unauthorized**
```
Error: "Not authorized. No token provided."

Solution:
1. Check Authorization header has "Bearer {{farmer_token}}"
2. Ensure token is set in environment
3. Token might be expired - login again
```

### **404 - Resource Not Found**
```
Error: "Farm not found"

Solution:
1. Verify {{farm_id}} is correct
2. Ensure farm belongs to logged-in farmer
3. Farm might have been deleted
```

### **400 - Bad Request**
```
Error: "Validation failed"

Solution:
1. Check request body JSON syntax
2. Verify required fields are present
3. Check field value ranges (area 0-1000, SOC 0-10, etc.)
```

### **500 - Server Error**
```
Error: "Internal server error"

Solution:
1. Check backend is running (npm run dev)
2. Verify MongoDB is connected
3. Check console for detailed error
4. Restart backend server
```

---

## 📝 Quick Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/register` | POST | ❌ | Create account |
| `/auth/login` | POST | ❌ | Get JWT token |
| `/auth/profile` | GET | ✅ | Get user info |
| `/farmer/dashboard` | GET | ✅ | Farmer summary |
| `/farmer/farm` | POST | ✅ | Add farm |
| `/farmer/sell-credits` | POST | ✅ | List credits |
| `/buyer/marketplace` | GET | ✅ | Browse credits |
| `/buyer/buy-credits` | POST | ✅ | Purchase credits |
| `/predict` | POST | ✅ | AI prediction |

---

## 💡 Tips & Tricks

### **Save Responses**
1. After sending request, click **Save Response**
2. Give it a meaningful name
3. Can compare against future responses

### **Tests Tab**
Add automated checks:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Token exists", function () {
    pm.expect(pm.response.json().token).to.exist;
});
```

### **Pre-request Script**
Auto-set variables before request:
```javascript
// Automatically set base_url
pm.environment.set("base_url", "http://localhost:5000/api");
```

### **Export Collection**
Share with team:
1. Right-click collection
2. **Export**
3. Share JSON file

---

## 🎯 Next Steps

After testing with Postman:

1. ✅ Verify all endpoints work
2. ✅ Test error scenarios
3. ✅ Test role-based access (farmer vs buyer)
4. ✅ Test data validation
5. ✅ Proceed to frontend integration

---

## 📚 Additional Resources

- [Postman Official Docs](https://learning.postman.com/)
- [API Testing Best Practices](https://postman.postman.co/documentation)
- [Environment Variables Guide](https://learning.postman.com/docs/sending-requests/managing-environments/)

---

**Happy Testing! 🚀**

For issues or questions, refer to the README.md or check backend console output.
