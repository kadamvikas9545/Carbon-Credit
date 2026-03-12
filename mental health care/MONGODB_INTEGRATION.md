# MongoDB Integration - Data Storage Guide

## Overview
All user data in Aura3.0 is now automatically saved to MongoDB Compass. This includes reviews, vibe checks, chat history, meditation sessions, and user profiles.

---

## 📦 Data Collections in MongoDB

### 1. **Users Collection**
Stores user account information.

```json
{
  "_id": ObjectId,
  "name": "User Name",
  "email": "user@email.com",
  "password": "hashed_password",
  "age": 25,
  "sex": "Male|Female|Other",
  "createdAt": ISODate
}
```

**API Endpoints:**
- `POST /api/register` - Create new user
- `POST /api/login` - Authenticate user
- `GET /api/profile` - Get user profile (requires auth)
- `POST /api/profile/update` - Update user profile (requires auth)

---

### 2. **Reviews Collection** ⭐
Stores all user reviews and ratings.

```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "userEmail": "user@email.com",
  "name": "John Doe",
  "rating": 5,
  "comment": "Aura helped me so much!",
  "anonymous": false,
  "createdAt": ISODate("2025-12-27T10:00:00Z")
}
```

**API Endpoints:**
- `POST /api/reviews` - Submit new review
  ```javascript
  {
    "name": "John Doe",
    "email": "john@email.com",
    "rating": 5,
    "comment": "Your review text",
    "anonymous": false,
    "userEmail": "john@email.com"
  }
  ```
- `GET /api/reviews` - Fetch all reviews

**Frontend Integration:**
- Reviews are automatically sent to MongoDB when user submits
- Fallback to localStorage if MongoDB unavailable
- Reviews loaded from MongoDB on page load

---

### 3. **VibeCheck Collection** 🎯
Stores vibe check questionnaire responses.

```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "userEmail": "user@email.com",
  "vibes": {
    "overallVibe": "A|B|C|D|E",
    "energy": "A|B|C|D|E",
    "focus": "A|B|C|D|E",
    "motivation": "A|B|C|D|E",
    "stress": "A|B|C|D|E"
  },
  "timestamp": ISODate
}
```

**API Endpoints:**
- `POST /api/vibecheck` - Save vibe check response
  ```javascript
  {
    "vibes": {
      "overallVibe": "C",
      "energy": "B",
      "focus": "D",
      "motivation": "C",
      "stress": "E"
    },
    "userEmail": "user@email.com"
  }
  ```
- `GET /api/vibecheck/:userEmail` - Get user's vibe check history

**Frontend Integration:**
- Automatically saved when user completes vibe check
- Tracked for stress analysis and emergency alerts

---

### 4. **ChatHistory Collection** 💬
Stores chat messages between user and Aura AI.

```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "userEmail": "user@email.com",
  "messages": [
    {
      "text": "How are you today?",
      "from": "user",
      "timestamp": ISODate
    },
    {
      "text": "I'm doing well, thanks for asking!",
      "from": "Aura",
      "timestamp": ISODate
    }
  ],
  "startedAt": ISODate,
  "endedAt": ISODate,
  "sessionDuration": 300 // in seconds
}
```

**API Endpoints:**
- `POST /api/chat-session` - Save chat session
  ```javascript
  {
    "messages": [...],
    "userEmail": "user@email.com",
    "duration": 300
  }
  ```
- `GET /api/chat-history/:userEmail` - Get chat history

**Frontend Integration:**
- Each chat message automatically saved to MongoDB
- Can retrieve past conversations for continuity

---

### 5. **Meditation Collection** 🧘
Stores meditation session records.

```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "userEmail": "user@email.com",
  "duration": 10,
  "type": "breathing|mindfulness|guided",
  "feedback": "Felt very relaxed",
  "completedAt": ISODate
}
```

**API Endpoints:**
- `POST /api/meditation` - Log meditation session
  ```javascript
  {
    "duration": 10,
    "type": "breathing",
    "feedback": "Felt great!",
    "userEmail": "user@email.com"
  }
  ```
- `GET /api/meditation/:userEmail` - Get meditation history

---

### 6. **Moods Collection** 😊
Stores daily mood check-ins.

```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "mood": "😊|😐|😢|😰|😡",
  "note": "Had a great day at work",
  "createdAt": ISODate
}
```

**API Endpoints:**
- `POST /api/moods` - Save mood (requires auth)
- `GET /api/moods` - Get user's moods (requires auth)
- `GET /api/moods/stats` - Get mood statistics

---

### 7. **Generic Data Storage Collection**
For storing any other user data with dynamic schemas.

```json
{
  "_id": ObjectId,
  "userId": "user_id",
  "data": { /* any data structure */ },
  "timestamp": ISODate
}
```

**API Endpoint:**
- `POST /api/save-data` - Save any data type
  ```javascript
  {
    "collection": "collectionName",
    "data": { /* your data */ }
  }
  ```
- `GET /api/data/:collection` - Retrieve data

---

## 🚀 Setup Instructions

### 1. **Start MongoDB Compass**
```bash
# Make sure MongoDB is running locally
mongod

# Or if using MongoDB Atlas, ensure connection string is configured
```

### 2. **Backend Server Setup**
```bash
cd backend
npm install
# Create .env file with:
MONGO_URI=mongodb://127.0.0.1:27017/aura3
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000

node server.js
```

### 3. **MongoDB Connection String**
Update in `server.js`:
```javascript
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aura3")
```

For MongoDB Atlas (cloud):
```
mongodb+srv://username:password@cluster.mongodb.net/aura3
```

---

## 📊 Data Flow

### Review Submission Flow:
```
User submits review in modal
        ↓
previewReview() - Show confirmation
        ↓
submitReviewConfirmed() - Send to MongoDB
        ↓
POST /api/reviews
        ↓
Save to MongoDB (with fallback to localStorage)
        ↓
loadReviews() - Fetch from MongoDB and display
```

### Vibe Check Flow:
```
User completes vibe check form
        ↓
completeVibeCheck(event)
        ↓
Save to localStorage + MongoDB
        ↓
POST /api/vibecheck
        ↓
MongoDB stores response
```

### Chat Flow:
```
User sends message
        ↓
sendMessage()
        ↓
Generate AI response
        ↓
Save both messages to MongoDB
        ↓
POST /api/chat-session or /api/save-data
```

---

## 🔍 Viewing Data in MongoDB Compass

1. Open **MongoDB Compass**
2. Connect to `mongodb://127.0.0.1:27017/aura3`
3. Navigate to **aura3** database
4. Browse collections:
   - `users` - User accounts
   - `reviews` - User reviews
   - `vibechecks` - Vibe check responses
   - `chathistories` - Chat sessions
   - `meditations` - Meditation logs
   - `moods` - Mood check-ins

---

## 🔐 Security Features

✅ **Password Hashing** - bcryptjs hashes passwords before storage
✅ **JWT Authentication** - Token-based auth for protected endpoints
✅ **User Association** - All data linked to specific user accounts
✅ **Anonymous Reviews** - Option to post reviews anonymously
✅ **Email Tracking** - All data tagged with user email for privacy

---

## 📝 API Summary Table

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---|
| `/api/register` | POST | Create account | ❌ |
| `/api/login` | POST | Login | ❌ |
| `/api/reviews` | POST | Submit review | ❌ |
| `/api/reviews` | GET | Get all reviews | ❌ |
| `/api/vibecheck` | POST | Save vibe check | ❌ |
| `/api/vibecheck/:email` | GET | Get vibe history | ❌ |
| `/api/chat-session` | POST | Save chat session | ❌ |
| `/api/chat-history/:email` | GET | Get chat history | ❌ |
| `/api/meditation` | POST | Log meditation | ❌ |
| `/api/meditation/:email` | GET | Get meditation history | ❌ |
| `/api/moods` | POST | Save mood | ✅ |
| `/api/moods` | GET | Get moods | ✅ |
| `/api/save-data` | POST | Save any data | ❌ |
| `/api/data/:collection` | GET | Fetch any data | ❌ |

---

## ⚠️ Error Handling

The system implements **graceful fallback**:
- If MongoDB is unavailable, data falls back to localStorage
- MongoDB integration is logged for debugging
- Toast notifications inform users of save status

---

## 🎯 Next Steps

1. **Database Backups** - Set up automated MongoDB backups
2. **Data Validation** - Add input validation for all fields
3. **Privacy Policy** - Create terms for data storage
4. **Analytics** - Add charts/dashboards for user data insights
5. **Data Export** - Allow users to export their data

---

**Last Updated:** December 27, 2025
**Version:** 1.0 - MongoDB Integration Complete
