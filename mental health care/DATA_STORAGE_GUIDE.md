# 📊 User Data Storage Guide - Aura3.0

## Overview
Your Aura3.0 mental health platform now has **full backend data storage capability**. All user-filled data is automatically recorded to MongoDB when users are logged in.

---

## ✅ What Data Gets Stored

### 1. **User Profile Data**
- Name, Email, Age, Sex
- Automatically stored when user registers or updates profile

### 2. **Mood Tracking**
- Mood selections (Down, Content, Peaceful, Happy, Excited)
- Timestamps for each mood entry

### 3. **Vibe Check Assessments**
- All 5 questions responses (q1-q5: A/B/C/D/E)
- Assessment score (0-20)
- Timestamp of completion

### 4. **Chat Messages**
- User messages
- AI companion responses
- Session timestamps

### 5. **Meditation Sessions**
- Duration of meditation (in minutes)
- Session start/end timestamps
- Total meditation minutes tracked

### 6. **Facial Analysis Results**
- Emotion detection data (happiness, sadness, anger, etc.)
- Stress levels
- Session timestamps
- Analysis results

### 7. **Activity Logs**
- Page views
- Login/Logout events
- Registration events
- Parent notification events
- Geofence triggers

### 8. **Geofence Events**
- Therapist proximity alerts
- Distance to therapist
- User location (lat/lon)
- Timestamp

---

## 🚀 How to Run

### **Step 1: Start MongoDB**

**Windows:**
```bash
# If MongoDB is installed locally
mongod
```

**Or use MongoDB Atlas (Cloud):**
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Add to `.env` file in backend folder

### **Step 2: Start Backend Server**

```bash
cd "c:\Users\vikas\OneDrive\Desktop\HTML TUTORIAL\mental health care\backend"
npm install
node server.js
```

Output should show:
```
🚀 Aura3.0 Backend running on http://localhost:5000
MongoDB Connected
```

### **Step 3: Open Frontend in Browser**

```
http://localhost:3000/mental health care/simple.html
```
Or use Live Server in VS Code

---

## 📡 API Endpoints for Data Storage

### **Save Data Endpoint**
```
POST http://localhost:5000/api/save-data
Headers: 
  - Content-Type: application/json
  - x-auth-token: <user_token>

Body:
{
  "collection": "moods",
  "data": { "mood": "happy" }
}
```

### **Retrieve User Data**
```
GET http://localhost:5000/api/data/moods
Headers:
  - x-auth-token: <user_token>
```

### **Get User Profile**
```
GET http://localhost:5000/api/profile
Headers:
  - x-auth-token: <user_token>
```

### **Update User Profile**
```
POST http://localhost:5000/api/profile/update
Headers:
  - Content-Type: application/json
  - x-auth-token: <user_token>

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "sex": "Male"
}
```

---

## 🔐 Authentication Flow

1. **User Registration**
   - POST `/api/register` with name, email, password
   - Backend creates user in MongoDB
   - Returns JWT token

2. **Token Storage**
   - Token automatically stored in browser's localStorage
   - Token sent with every data save request
   - Token expires in 7 days

3. **Auto-Login**
   - On page load, app checks for stored token
   - If valid, user automatically logged in
   - If invalid/expired, user must login again

---

## 📝 Automatic Data Capture

### When Data is Automatically Saved:

#### **Mood Selection**
```javascript
// User clicks mood button → Auto-saved to MongoDB
selectMood() → saveToMongoDB('moods', { mood })
```

#### **Vibe Check Completion**
```javascript
// User submits vibe check form → Auto-saved
completeVibeCheck() → saveToMongoDB('vibeChecks', summary)
```

#### **Chat Messages**
```javascript
// User sends chat message → Auto-saved
sendMessage() → saveToMongoDB('chats', { userMessage, aiResponse })
```

#### **Meditation Session**
```javascript
// User finishes meditation → Auto-saved
stopMeditationSession() → saveToMongoDB('meditations', { duration })
```

#### **Facial Analysis**
```javascript
// User stops camera → Analysis session saved
stopCamera() → saveToMongoDB('emotionAnalysis', sessionData)
```

#### **Activity Logs**
```javascript
// Every major action logged
showSection() → saveToMongoDB('activity', { type: 'page_view', page })
handleLogin() → saveToMongoDB('activity', { type: 'login', email })
logout() → saveToMongoDB('activity', { type: 'logout' })
```

---

## 📊 MongoDB Collections

Collections automatically created:

```
aura3
├── users              # User accounts
├── moods              # Mood entries
├── vibeChecks         # Assessment responses
├── chats              # Chat conversations
├── meditations        # Meditation sessions
├── emotionAnalysis    # Facial analysis results
├── activity           # Activity logs
├── geofence-events    # Therapist proximity alerts
└── (other collections as data is saved)
```

---

## 🛠️ Troubleshooting

### **Data Not Saving?**

1. **Check Backend is Running**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{ "status": "OK" }`

2. **Check MongoDB Connection**
   ```bash
   # Look for "MongoDB Connected" in server output
   node server.js
   ```

3. **Check Auth Token**
   - Open Browser DevTools → Application → localStorage
   - Look for `authToken` key
   - Should have a long JWT string

4. **Check Network Requests**
   - DevTools → Network tab
   - Filter: "save-data"
   - Should show `POST /api/save-data` with 200 status

### **MongoDB Connection Error?**

```bash
# Install MongoDB locally:
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

# Or use MongoDB Atlas:
# Add to .env file:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aura3
```

### **Port Already in Use?**

```bash
# Change PORT in server.js or .env
# Then start on different port
node server.js  # Will use PORT from .env or default 5000
```

---

## 📈 View Stored Data

### **Method 1: Using MongoDB Compass (GUI)**
1. Download: https://www.mongodb.com/products/compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Browse `aura3` database
4. See all collections and documents

### **Method 2: Using MongoDB Shell**
```bash
mongosh
use aura3
db.moods.find()
db.chats.find()
db.vibeChecks.find()
```

### **Method 3: Using API Endpoint**
```bash
# Get user's mood history
curl -H "x-auth-token: YOUR_TOKEN" http://localhost:5000/api/data/moods
```

---

## 🔄 Data Privacy & Security

### **What's Protected?**
- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens expire in 7 days
- ✅ Auth middleware validates token on every request
- ✅ Each user can only access their own data

### **What's Not Protected?**
- ⚠️ Data stored in localStorage (use HTTPS in production)
- ⚠️ API key visible in frontend (use backend proxy in production)

### **For Production:**
1. Add HTTPS/SSL
2. Move API keys to backend .env
3. Implement refresh tokens
4. Add rate limiting
5. Regular database backups

---

## 📱 Example: Complete Data Flow

```
User Action: Selects "Happy" mood
        ↓
Frontend JavaScript: selectMood(element, 'happy')
        ↓
Check if logged in: isLoggedIn === true
        ↓
Call: saveToMongoDB('moods', { mood: 'happy' })
        ↓
Fetch POST /api/save-data:
  - Headers: x-auth-token (JWT)
  - Body: { collection: 'moods', data: { mood: 'happy' } }
        ↓
Backend authMiddleware validates token
        ↓
Create/Insert into MongoDB collection 'moods'
  {
    userId: "635abc123def456",
    data: { mood: "happy" },
    timestamp: "2024-12-27T10:30:00.000Z"
  }
        ↓
Return success response to frontend
        ↓
Show toast: "Mood logged: Happy!"
```

---

## ✨ Features Enabled by Data Storage

1. **Progress Tracking** - See mood trends over time
2. **Analytics Dashboard** - View stats on chat sessions, meditations, etc.
3. **Personalized Recommendations** - AI learns user patterns
4. **Export Reports** - Download progress data
5. **Historical Analysis** - Compare before/after improvements
6. **Therapy Support** - Share data with mental health professionals
7. **Emergency Protocols** - Track high-risk indicators

---

## 📞 Need Help?

**Backend Issues:**
```bash
# Check logs
node server.js | tail -f

# Test API health
curl http://localhost:5000/api/health
```

**Frontend Issues:**
- Check Browser Console (F12 → Console)
- Check Network Tab for failed requests
- Verify localhost:5000 backend is running

**MongoDB Issues:**
- Verify MongoDB service is running
- Check connection string in .env
- Use MongoDB Compass to debug

---

## 🎉 Success Indicators

✅ Data is saving if you see:
- "Saved to MongoDB successfully" in console
- Toast notification: "Data saved"
- Green status in Network tab
- New documents in MongoDB collections

---

**Last Updated:** December 27, 2025
**Backend Version:** 1.0.0
**Database:** MongoDB
**Status:** ✅ Fully Operational
