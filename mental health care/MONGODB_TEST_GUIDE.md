# MongoDB Compass Data Storage - Quick Test Guide

## ✅ What Gets Saved to MongoDB?

### 1. **Reviews** 📝
- **When:** User submits a review with rating and comment
- **Collection:** `reviews`
- **Fields Saved:**
  - User name
  - Rating (1-5 stars)
  - Comment/Review text
  - Anonymous flag
  - Date created
  - User email

### 2. **Vibe Checks** 🎯
- **When:** User completes the daily 5-question vibe check
- **Collection:** `vibechecks`
- **Fields Saved:**
  - Overall vibe response (A-E)
  - Energy level (A-E)
  - Focus level (A-E)
  - Motivation level (A-E)
  - Stress level (A-E)
  - User email
  - Timestamp

### 3. **Chat Messages** 💬
- **When:** User sends message to Aura AI
- **Collection:** `chatmessages` (or generic `generic_data`)
- **Fields Saved:**
  - User message
  - AI response
  - User email
  - Timestamp

### 4. **Meditation Sessions** 🧘
- **When:** User completes meditation
- **Collection:** `meditations`
- **Fields Saved:**
  - Duration (minutes)
  - Type (breathing, mindfulness, etc.)
  - Feedback/notes
  - User email
  - Completion timestamp

### 5. **User Profiles** 👤
- **When:** User registers or updates profile
- **Collection:** `users`
- **Fields Saved:**
  - Name
  - Email
  - Hashed password
  - Age
  - Sex/Gender
  - Account creation date

### 6. **Mood Check-ins** 😊
- **When:** User logs daily mood
- **Collection:** `moods`
- **Fields Saved:**
  - Mood emoji/sentiment
  - Optional note
  - Timestamp

---

## 🔧 How to Test MongoDB Integration

### Step 1: Start Backend Server
```bash
cd backend
npm install  # if not already done
node server.js
```

Expected output:
```
🚀 Aura3.0 Backend running on http://localhost:5000
MongoDB Connected
💬 Gemini Chat powered by gemini-1.5-flash
📡 Key Endpoints: /api/chat, /api/auth/login, /api/resources, /api/health
```

### Step 2: Open MongoDB Compass
1. Launch **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. Navigate to database: **aura3**
4. You should see collections being created as you use the app

### Step 3: Test Each Feature

#### **Test Reviews** 
1. Open Aura app (http://localhost:5173 or your dev server)
2. Click "Share Your Story" button
3. Fill in review form:
   - Name: "Test User"
   - Rating: 5 stars
   - Comment: "This app changed my life!"
   - Anonymous: unchecked
4. Click "Review & Confirm"
5. Click "Confirm & Sign"

**Check MongoDB:**
- Go to `aura3` → `reviews` collection
- You should see your review with all fields

---

#### **Test Vibe Check**
1. On dashboard, find "Vibe Check" section
2. Answer all 5 questions (A-E responses)
3. Click "Complete & Unlock Insights"

**Check MongoDB:**
- Go to `aura3` → `vibechecks` collection
- Should contain your responses

---

#### **Test Chat**
1. Go to Chat section
2. Send a message: "How are you?"
3. Aura responds with AI-generated message

**Check MongoDB:**
- Go to `aura3` → look for `chatmessages` or `generic_data`
- Should contain your chat exchange

---

#### **Test Registration**
1. Click "Create Account" or similar
2. Fill in form:
   - Name: "Test Name"
   - Email: "test@aura.local"
   - Password: "testpass123"
3. Submit form

**Check MongoDB:**
- Go to `aura3` → `users` collection
- Should see new user with hashed password
- Email stored for future data tracking

---

## 📊 MongoDB Collections Overview

After using all features, your MongoDB should have:

```
aura3
├── users (user accounts)
├── reviews (star ratings & reviews)
├── vibechecks (daily vibe check responses)
├── chatmessages or generic_data (chat history)
├── meditations (meditation logs)
├── moods (mood check-ins)
└── therapists, resources, etc.
```

---

## 🔍 Sample MongoDB Queries in Compass

### Get All Reviews
```javascript
db.reviews.find({})
```

### Get All Vibe Checks for User
```javascript
db.vibechecks.find({ userEmail: "user@email.com" })
```

### Get Reviews Sorted by Rating (Highest First)
```javascript
db.reviews.find({}).sort({ rating: -1 })
```

### Count Total Reviews
```javascript
db.reviews.countDocuments({})
```

### Get Chat History for User
```javascript
db.generic_data.find({ 
  "data.userEmail": "user@email.com",
  collection: "chatMessages"
})
```

---

## ✅ Troubleshooting

### Issue: MongoDB not saving data
**Solution:**
1. Check backend server is running: `node server.js`
2. Verify MongoDB is running: `mongod`
3. Check browser console for errors (F12)
4. Ensure backend URL is `http://localhost:5000`

### Issue: Data only in localStorage, not MongoDB
**Solution:**
1. Open browser DevTools Console (F12)
2. Look for messages like "✅ Data saved to MongoDB" 
3. If you see warnings about MongoDB unavailable, check server connection

### Issue: MongoDB Compass shows no data
**Solution:**
1. Refresh Compass collections view
2. Click "Refresh" button
3. Make sure connected to correct database: `aura3`
4. Check if app is actually submitting data (check console logs)

---

## 📈 Performance Tips

✅ **Data is automatically saved** - No manual upload needed
✅ **Fallback to localStorage** - Works even if MongoDB unavailable
✅ **Email-based tracking** - All user data linked by email
✅ **Indexed queries** - Fast retrieval of user-specific data

---

## 🎯 Key Features Verification

After completing all tests, verify:
- [ ] Can create user account (saves to `users` collection)
- [ ] Can submit review (saves to `reviews` collection)
- [ ] Can complete vibe check (saves to `vibechecks` collection)
- [ ] Can send chat message (saves to `generic_data` collection)
- [ ] Can view reviews loaded from MongoDB
- [ ] Can view all collections in MongoDB Compass
- [ ] Data persists after refresh

---

## 📞 Support

If data not saving:
1. Check backend logs: `node server.js` output
2. Check browser console: F12 → Console tab
3. Verify MongoDB running: `mongo` or Compass connected
4. Check `.env` file has correct MONGO_URI

---

**Last Updated:** December 27, 2025
**Version:** 1.0
