# MongoDB Setup Checklist ✅

## Prerequisites
- [ ] Node.js installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] MongoDB Compass installed
- [ ] Terminal/Command Prompt access

---

## Step 1: Start MongoDB Server

### Option A: Local MongoDB
```bash
# Windows (if using local MongoDB)
mongod

# macOS/Linux
mongod

# Verify connection:
mongo mongodb://127.0.0.1:27017/aura3
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & project
3. Create cluster
4. Copy connection string
5. Add to backend `.env`:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/aura3
```

---

## Step 2: Configure Backend

### Create `.env` file in backend folder:
```bash
cd backend
touch .env  # or create file manually
```

### Add content to `.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/aura3
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
PORT=5000
```

### Install dependencies:
```bash
npm install
```

Expected packages:
- express
- mongoose
- mongodb
- cors
- bcryptjs
- jsonwebtoken
- socket.io

---

## Step 3: Verify Database Setup

### Check MongoDB Connection:
```bash
# Connect to MongoDB
mongo mongodb://127.0.0.1:27017/aura3

# In MongoDB shell, verify:
show databases
use aura3
show collections
```

---

## Step 4: Start Backend Server

```bash
cd backend
node server.js
```

### Expected Output:
```
🚀 Aura3.0 Backend running on http://localhost:5000
💬 Gemini Chat powered by gemini-1.5-flash
🔑 Using provided API Key: ***
📡 Key Endpoints: /api/chat, /api/auth/login, /api/resources, /api/health
MongoDB Connected ✅
```

---

## Step 5: Open MongoDB Compass

1. Launch **MongoDB Compass**
2. Click "New Connection"
3. Connection String: `mongodb://localhost:27017`
4. Click "Connect"
5. Select database: **aura3**

You should now see the database structure.

---

## Step 6: Start Frontend Application

In a new terminal:
```bash
# Navigate to project folder
cd "c:\Users\vikas\OneDrive\Desktop\HTML TUTORIAL\mental health care"

# If using Vite:
npm run dev

# Or open simple.html directly in browser
```

---

## Step 7: Test Data Storage

### Test 1: Submit a Review ⭐
- [ ] Click "Share Your Story" button
- [ ] Fill in review form with:
  - Name: "Test User"
  - Rating: 5 stars
  - Comment: "Testing MongoDB integration"
  - Anonymous: unchecked
- [ ] Click "Review & Confirm"
- [ ] Click "Confirm & Sign"
- [ ] Check MongoDB Compass: `aura3` → `reviews` collection
  - Should see your review data

### Test 2: Complete Vibe Check 🎯
- [ ] Go to Vibe Check section
- [ ] Answer all 5 questions
- [ ] Click "Complete & Unlock Insights"
- [ ] Check MongoDB Compass: `aura3` → `vibechecks` collection
  - Should contain your responses

### Test 3: Send Chat Message 💬
- [ ] Go to Chat section
- [ ] Send message: "How can I manage stress?"
- [ ] Wait for Aura response
- [ ] Check MongoDB Compass for saved chat data
  - Look in `generic_data` or similar collection

### Test 4: Create Account 👤
- [ ] Click "Create Account"
- [ ] Fill in form with test data
- [ ] Submit registration
- [ ] Check MongoDB Compass: `aura3` → `users` collection
  - Should see new user with hashed password

---

## Collections Verification Checklist

After testing, verify these collections exist in MongoDB:

- [ ] `users` - User accounts (should have at least 1)
- [ ] `reviews` - Reviews (should have at least 1)
- [ ] `vibechecks` - Vibe check responses (should have at least 1)
- [ ] `generic_data` or `chatmessages` - Chat data (should have entries)
- [ ] `meditations` - Meditation logs (optional, if tested)
- [ ] `moods` - Mood check-ins (optional, if tested)

---

## API Endpoints to Test

You can test API endpoints directly using curl or Postman:

### Test Backend Health:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Aura3.0 Backend is running",
  "geminiModel": "gemini-1.5-flash",
  "date": "2025-12-27T12:00:00Z"
}
```

### Test Create Review:
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@aura.local",
    "rating": 5,
    "comment": "Great app!",
    "anonymous": false,
    "userEmail": "test@aura.local"
  }'
```

### Test Get All Reviews:
```bash
curl http://localhost:5000/api/reviews
```

---

## File Structure

```
mental health care/
├── backend/
│   ├── server.js (✅ Updated with MongoDB models)
│   ├── package.json
│   ├── .env (← Create this)
│   └── node_modules/
├── simple.html (✅ Updated with MongoDB API calls)
├── MONGODB_INTEGRATION.md (← Reference)
├── MONGODB_TEST_GUIDE.md (← Testing guide)
├── MONGODB_SETUP_CHECKLIST.md (← This file)
└── other files...
```

---

## Troubleshooting

### ❌ "MongoDB not connected"
**Solution:**
- [ ] Ensure `mongod` is running
- [ ] Check MONGO_URI in `.env`
- [ ] Verify database name is `aura3`
- [ ] Check firewall isn't blocking port 27017

### ❌ "Cannot find module 'mongoose'"
**Solution:**
```bash
cd backend
npm install mongoose
```

### ❌ "Data saved to localStorage but not MongoDB"
**Solution:**
- [ ] Check if backend server is running
- [ ] Open browser console (F12) and look for errors
- [ ] Verify backend URL is `http://localhost:5000`
- [ ] Check MongoDB is connected (see server logs)

### ❌ "MongoDB Compass shows empty database"
**Solution:**
- [ ] Refresh collections in Compass
- [ ] Make sure data was actually submitted (check console)
- [ ] Verify connected to correct database: `aura3`
- [ ] Try submitting another review/check and refresh

### ❌ "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or use different port in .env
PORT=5001
```

---

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] JWT_SECRET is a strong random string
- [ ] MongoDB password is strong (if using Atlas)
- [ ] CORS configured properly in backend
- [ ] User passwords are hashed with bcryptjs
- [ ] Sensitive data not logged to console

---

## Performance Optimization

- [ ] Database indexes created for common queries
- [ ] Connection pooling configured
- [ ] Fallback to localStorage for offline support
- [ ] API responses cached where appropriate

---

## Documentation Files Created

1. **MONGODB_INTEGRATION.md** - Complete technical reference
2. **MONGODB_TEST_GUIDE.md** - Step-by-step testing guide
3. **MONGODB_SETUP_CHECKLIST.md** - This checklist

---

## Final Verification

Run this final checklist before deployment:

- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] At least one review saved and visible in Compass
- [ ] At least one vibe check saved
- [ ] Chat messages being logged
- [ ] User registration working
- [ ] All API endpoints responding (test with curl/Postman)
- [ ] No console errors in browser
- [ ] No MongoDB connection errors in server logs

---

## Next Steps

✅ **Short Term:**
- [ ] Complete all tests
- [ ] Verify data in MongoDB Compass
- [ ] Fix any bugs found during testing

✅ **Medium Term:**
- [ ] Add data validation
- [ ] Create user analytics dashboard
- [ ] Set up automated backups
- [ ] Add data export feature

✅ **Long Term:**
- [ ] Deploy to production (MongoDB Atlas)
- [ ] Implement data retention policies
- [ ] Add data encryption for sensitive fields
- [ ] Create admin dashboard for monitoring

---

## Quick Start Command Summary

```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend
cd backend
npm install
node server.js

# Terminal 3 - Start Frontend
# Open simple.html in browser or use dev server
```

Then:
- Open http://localhost:5000 (backend health check)
- Open MongoDB Compass → connect → aura3 database
- Test app features → data should appear in MongoDB

---

**Created:** December 27, 2025
**Last Updated:** December 27, 2025
**Version:** 1.0 - Initial Setup
