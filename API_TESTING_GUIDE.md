# AgroGreenBits API Testing Guide 🧪

## Backend Status
✅ **Server Running**: http://localhost:5000  
✅ **Database**: MongoDB Connected  
✅ **Port**: 5000  

---

## Testing The Three New Features

### Feature 1: Profile Management API Testing

#### Test 1.1: Get User Profile
```bash
curl -X GET "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "Farmer Name",
    "email": "farmer@demo.com",
    "role": "farmer",
    "phone": "+91 98765 43210",
    "location": "Nashik, Maharashtra",
    "bio": "Sustainable farming enthusiast",
    "language": "en",
    "profileImage": null,
    "createdAt": "2026-04-04T..."
  }
}
```

#### Test 1.2: Update User Profile
```bash
curl -X PUT "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+91 99999 99999",
    "location": "Pune, Maharashtra",
    "bio": "Updated bio text",
    "companyName": "Optional for buyers"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "Updated Name",
    "email": "farmer@demo.com",
    "role": "farmer",
    "phone": "+91 99999 99999",
    "location": "Pune, Maharashtra",
    "companyName": null,
    "bio": "Updated bio text"
  }
}
```

#### Test 1.3: Change Password
```bash
curl -X PUT "http://localhost:5000/api/profile/password" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "pass123",
    "newPassword": "newpass456"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Old password is incorrect"
}
```

---

## How to Get JWT Token

### Method 1: Login via Frontend
1. Open http://localhost:5000 in browser
2. Login with: farmer@demo.com / pass123
3. Token automatically saved to localStorage

### Method 2: Login via API
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@demo.com",
    "password": "pass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Ramesh Patil",
    "email": "farmer@demo.com",
    "role": "farmer"
  }
}
```

Copy the `token` value and use in Authorization header.

---

## Feature 2: Language Support Testing

### Test 2.1: Language Persists in Profile
1. Open Frontend → Profile Modal
2. Observe current language in navbar (EN or हिं)
3. Switch language via dropdown
4. Open Profile modal again
5. **Expected**: Language preference is persistent

### Test 2.2: Language Settings in User Model
```bash
# Check if user has language preference stored
curl -X GET "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Look for `"language": "en"` or `"language": "hi"` in response.

---

## Feature 3: AI Prediction Charts Testing

### Test 3.1: Run Spectral Prediction
```bash
curl -X POST "http://localhost:5000/api/farmer/predict" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "farmId": "farm_id",
    "spectralData": [
      450, 470, 490, 510, 530, 550, 570, 590, 610, 630,
      650, 670, 690, 710, 730, 750, 770, 790, 810, 830
    ],
    "depth": 15,
    "wavelengths": [400, 2500]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "prediction": {
    "soc": 2.8,
    "confidence": 87.5,
    "credits": 142,
    "carbonStock": 13.24,
    "co2Equivalent": 48.53,
    "depth": 15,
    "wavelengths": [400, 2500]
  }
}
```

---

## Frontend UI Testing Checklist ✅

### Test A: Profile Management in UI

**Step 1: Login**
- [ ] Open browser → http://localhost:5000
- [ ] Login: farmer@demo.com / pass123
- [ ] Dashboard loads successfully

**Step 2: Access Profile Modal**
- [ ] Click "👤 Profile" button in navbar
- [ ] Profile modal opens
- [ ] Current profile data displays correctly

**Step 3: Edit Profile**
- [ ] Change name to "Test User"
- [ ] Update phone to "+91 12345 67890"
- [ ] Update location to "Mumbai"
- [ ] Add bio: "Testing profile update"
- [ ] Click "Save Changes"
- [ ] Toast shows: "Profile updated successfully"
- [ ] Avatar updates with new initials

**Step 4: Verify Changes Persisted**
- [ ] Close profile modal
- [ ] Re-open profile modal
- [ ] All changes are still there

**Step 5: Change Password**
- [ ] Scroll to "Change Password" section
- [ ] Enter old password: pass123
- [ ] Enter new password: newpass456
- [ ] Click "Update Password"
- [ ] Toast shows: "Password changed successfully"
- [ ] Fields clear

**Step 6: Login with New Password**
- [ ] Logout
- [ ] Login with: farmer@demo.com / newpass456
- [ ] Login successful ✓

---

### Test B: Language Switching in UI

**Step 1: Access Language Selector**
- [ ] Click "🌐 EN" button in navbar
- [ ] Dropdown appears with language options
- [ ] Shows: 🇬🇧 English and 🇮🇳 हिंदी

**Step 2: Switch to Hindi**
- [ ] Click "🇮🇳 हिंदी"
- [ ] Navbar button changes to "🌐 हिं"
- [ ] Dropdown closes
- [ ] Observe UI text updates (if data-i18n attributes present)

**Step 3: Switch Back to English**
- [ ] Click "🌐 हिं"
- [ ] Click "🇬🇧 English"
- [ ] Navbar button changes back to "🌐 EN"

**Step 4: Verify Persistence**
- [ ] Refresh page (Ctrl+R or Cmd+R)
- [ ] Check navbar display
- [ ] Language preference should persist
- [ ] Check DevTools → Application → LocalStorage
- [ ] Key: `preferredLanguage` should exist

---

### Test C: AI Prediction Charts in UI

**Step 1: Access AI Predict Tab (Farmer Only)**
- [ ] Login as farmer: farmer@demo.com / newpass456
- [ ] Click "AI Predict" tab in navbar
- [ ] AI Predictor section loads

**Step 2: Run Prediction**
- [ ] Select farm from dropdown
- [ ] Keep depth at 15 cm (default)
- [ ] Click "🔀 Randomize Signal" (optional)
- [ ] Click "Run AI Prediction" button
- [ ] Button shows "Processing..."
- [ ] Wait 2-3 seconds

**Step 3: View Results**
- [ ] Result section appears with insight cards
- [ ] Card 1: Shows "Prediction Quality" (High/Medium/Low)
- [ ] Card 2: Shows "Carbon Stock" in tC/ha
- [ ] Card 3: Shows "CO₂ Equivalent" in tCO₂
- [ ] Card 4: Shows "Credits Generated" count
- [ ] Calculation formula visible at bottom

**Step 4: Test Apply Function (if available)**
- [ ] Look for "Apply to Farm" button
- [ ] Click to apply prediction
- [ ] Farm SOC and credits update
- [ ] Dashboard refreshes

**Step 5: Check Dashboard Charts**
- [ ] Go to "Dashboard" tab
- [ ] Look for three charts:
  - [ ] **SOC Over Time** (line chart)
  - [ ] **Credits Generated** (bar chart)
  - [ ] **Monthly Earnings** (line chart in ₹)
- [ ] Charts display correctly with data

---

## Testing with Postman

### Setup Steps

**Step 1: Import Collection**
1. Open Postman
2. Click "Import"
3. Select `AgroGreenBits_API_Collection.postman_collection.json`
4. Click "Import"

**Step 2: Set Variables**
1. In Postman, click "Environments" (or gear icon)
2. Create new environment or edit existing
3. Add variable:
   - Key: `base_url`
   - Value: `http://localhost:5000/api`
4. Add variable:
   - Key: `token`
   - Value: (will be set after login)

**Step 3: Get Token**
1. In collection, find "Authentication" folder
2. Click "Login - Farmer"
3. Send request
4. Copy token from response
5. In Postman, update `token` variable with copied token

### Test Profile Endpoints in Postman

**Test 1: Get Profile**
1. Find request: "Profile" → "Get Profile"
2. Click Send
3. Verify 200 response with user data

**Test 2: Update Profile**
1. Find request: "Profile" → "Update Profile"
2. Modify request body with new values
3. Click Send
4. Verify 200 response with updated data

**Test 3: Change Password**
1. Find request: "Profile" → "Change Password"
2. Update oldPassword and newPassword in body
3. Click Send
4. Verify 200 response

---

## Expected Test Results Summary

### Profile API ✅
| Test | Endpoint | Method | Expected | Status |
|------|----------|--------|----------|--------|
| Get Profile | `/api/profile` | GET | 200, user data | |
| Update Profile | `/api/profile` | PUT | 200, updated user | |
| Change Password | `/api/profile/password` | PUT | 200, success msg | |

### Frontend UI ✅
| Feature | Test | Expected | Status |
|---------|------|----------|--------|
| Profile | Edit & Save | Data persists | |
| Language | Switch EN↔HI | UI updates | |
| Charts | Run Prediction | Results display | |

### Error Cases ✅
| Scenario | Expected | Status |
|----------|----------|--------|
| Missing Token | 401 Unauthorized | |
| Invalid Password | 401, incorrect msg | |
| Required Fields | 400, validation err | |

---

## Quick Test Commands

### Login & Get Token
```bash
# Save this token for other requests
TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@demo.com","password":"pass123"}' | jq -r '.token')

echo "Token: $TOKEN"
```

### Test All Profile Endpoints
```bash
# Set your token
TOKEN="your_jwt_token_here"

# Get Profile
echo "=== GET Profile ==="
curl -X GET "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer $TOKEN" | jq

# Update Profile
echo -e "\n=== PUT Profile ==="
curl -X PUT "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","phone":"+919999999999"}' | jq

# Change Password
echo -e "\n=== PUT Password ==="
curl -X PUT "http://localhost:5000/api/profile/password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"pass123","newPassword":"newpass456"}' | jq
```

---

## Troubleshooting Common Issues

### Issue: 401 Unauthorized
**Cause**: Missing or expired JWT token
**Solution**: 
1. Login via frontend or API to get fresh token
2. Verify token in Authorization header format: `Bearer YOUR_TOKEN`
3. Check token hasn't expired

### Issue: 404 Not Found - /api/profile
**Cause**: Routes not registered
**Solution**:
1. Check backend `server.js` has: `app.use('/api/profile', profileRoutes);`
2. Restart server: `npm start` in backend folder
3. Verify no route conflicts

### Issue: Profile data not updating
**Cause**: Body not sent as JSON or missing Content-Type header
**Solution**:
1. Ensure header: `Content-Type: application/json`
2. Verify request body is valid JSON
3. Check field names match backend schema

### Issue: Password change fails
**Cause**: Old password incorrect or field name mismatch
**Solution**:
1. Use exact current password
2. Verify fields: `oldPassword` and `newPassword`
3. Note: Case-sensitive

---

## Next Steps After Testing ✅

1. ✅ **All Profile APIs working** → Move to frontend testing
2. ✅ **Profile UI working** → Test language switching
3. ✅ **Language switching working** → Test AI charts
4. ✅ **Charts displaying** → Ready for production!

---

**Test Date**: April 4, 2026  
**Backend Port**: 5000  
**Database**: MongoDB  
**Status**: Ready for comprehensive testing 🚀
