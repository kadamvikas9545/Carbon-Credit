# 🚀 Quick Start - Data Storage Setup

## 5 Minutes to Full Data Storage

### **1. Ensure Backend is Running**

```bash
cd "c:\Users\vikas\OneDrive\Desktop\HTML TUTORIAL\mental health care\backend"
npm install
node server.js
```

**Expected Output:**
```
🚀 Aura3.0 Backend running on http://localhost:5000
MongoDB Connected
```

### **2. Ensure MongoDB is Running**

**Windows - MongoDB Local:**
```bash
mongod
```

**OR use MongoDB Atlas (Cloud):**
- Update `MONGO_URI` in backend server.js or create `.env` file

### **3. Open Application**

Open in browser:
```
http://localhost:5000/mental%20health%20care/simple.html
```

Or use VS Code Live Server (right-click HTML → Open with Live Server)

### **4. Register/Login**

1. Click "Sign In"
2. Click "Create Your Aura Account" 
3. Fill name, email, password
4. Click "Create Account"

### **5. Data is Now Saving!**

Try these actions - all data is automatically saved:

✅ **Select a Mood** → Auto-saved
✅ **Complete Vibe Check** → Auto-saved  
✅ **Send Chat Message** → Auto-saved
✅ **Do Meditation** → Auto-saved
✅ **Update Profile** → Auto-saved

---

## 🔍 Verify Data is Saving

### **Method 1: Check Console (Easiest)**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Send a chat message
4. Look for success messages in console

### **Method 2: Check MongoDB**

```bash
mongosh
use aura3
db.chats.find().pretty()
```

### **Method 3: Download Progress Report**

1. Go to Dashboard
2. Click "Generate Progress Report"
3. Click "Download"
4. Should download JSON file with your data

---

## 📊 What's Being Saved

| Feature | Collection | Auto-Saved? |
|---------|-----------|------------|
| Mood Selection | moods | ✅ Yes |
| Vibe Check | vibeChecks | ✅ Yes |
| Chat Messages | chats | ✅ Yes |
| Meditation | meditations | ✅ Yes |
| Profile Update | users | ✅ Yes |
| Emotion Analysis | emotionAnalysis | ✅ Yes |
| Activity Logs | activity | ✅ Yes |
| Geofence Events | geofence-events | ✅ Yes |

---

## ⚡ Common Issues & Fixes

### "Backend not responding"
```bash
# Make sure backend is running
node server.js

# If port 5000 is busy:
# Edit server.js line: const PORT = process.env.PORT || 5001;
```

### "MongoDB Connection Error"
```bash
# Start MongoDB
mongod

# Or update connection string in server.js:
# mongoose.connect("mongodb://localhost:27017/aura3")
```

### "Auth Token Not Saving"
- Check browser localStorage (DevTools → Application → localStorage)
- Token should be there as `authToken` key
- If missing, logout and login again

---

## 📝 Manual Test

**Test Save Data:**
```bash
# 1. Get your token from browser console:
localStorage.getItem('authToken')

# 2. Use this curl command (replace TOKEN):
curl -X POST http://localhost:5000/api/save-data \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN_HERE" \
  -d '{"collection":"moods","data":{"mood":"happy"}}'

# Should return: { "success": true, ... }
```

---

## 🎯 Next Steps

1. ✅ Backend running → http://localhost:5000/api/health
2. ✅ MongoDB running → mongod active
3. ✅ Frontend running → http://localhost:3000
4. ✅ User logged in → Can see Dashboard
5. ✅ Data saving → Check MongoDB collections

---

## 🆘 Emergency Help

**Nothing is saving?**

1. Check backend console for errors
2. Check browser console (F12)
3. Check network tab for failed requests
4. Verify MongoDB is running
5. Check token exists in localStorage

**Still stuck?**

- Open browser DevTools (F12)
- Go to Network tab
- Perform an action (send chat message)
- Look for POST `/api/save-data`
- Click it and check Response tab

---

**Status:** ✅ Ready to Store Data
**Backend:** http://localhost:5000
**Database:** MongoDB (Local or Atlas)
**Created:** December 27, 2025
