# 📡 Backend API Documentation - Aura3.0

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication Endpoints

### **Register User**
```
POST /api/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "635abc123def456xyz"
}
```

---

### **Login User**
```
POST /api/login
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "635abc123def456xyz"
}
```

---

### **Google OAuth Login**
```
POST /api/google-login
```

**Request:**
```json
{
  "email": "user@gmail.com",
  "name": "Google User"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "635abc123def456xyz"
}
```

---

### **Verify Auth Token**
```
GET /api/auth/user
```

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "635abc123def456xyz",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "sex": "Male",
    "createdAt": "2024-12-27T10:00:00.000Z"
  }
}
```

---

## 👤 Profile Endpoints

### **Get User Profile**
```
GET /api/profile
```

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "635abc123def456xyz",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "sex": "Male"
  }
}
```

---

### **Update User Profile**
```
POST /api/profile/update
```

**Headers:**
```
Content-Type: application/json
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 26,
  "sex": "Female"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "635abc123def456xyz",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 26,
    "sex": "Female"
  },
  "message": "Profile updated successfully"
}
```

---

## 💾 Data Storage Endpoints

### **Save User Data**
```
POST /api/save-data
```

**Headers:**
```
Content-Type: application/json
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "collection": "moods",
  "data": {
    "mood": "happy",
    "timestamp": "2024-12-27T10:30:00.000Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data saved to moods",
  "record": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "635abc123def456xyz",
    "data": {
      "mood": "happy",
      "timestamp": "2024-12-27T10:30:00.000Z"
    },
    "timestamp": "2024-12-27T10:30:00.000Z"
  }
}
```

---

### **Get User Data from Collection**
```
GET /api/data/:collection
```

**Parameters:**
- `collection` - Name of collection (moods, chats, meditations, etc.)

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "635abc123def456xyz",
      "data": {
        "mood": "happy"
      },
      "timestamp": "2024-12-27T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "635abc123def456xyz",
      "data": {
        "mood": "peaceful"
      },
      "timestamp": "2024-12-27T11:30:00.000Z"
    }
  ]
}
```

---

## 💬 Chat Endpoints

### **Send Chat Message**
```
POST /api/chat
```

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "message": "I'm feeling anxious today"
}
```

**Response:**
```json
{
  "reply": "I hear that you're feeling anxious. Take a few slow deep breaths with me..."
}
```

---

## 👨‍⚕️ Therapist Endpoints

### **Get All Therapists**
```
GET /api/therapists
```

**Response:**
```json
[
  {
    "_id": "635abc123def456xyz",
    "name": "Dr. Priya Sharma",
    "specialization": "Anxiety & Depression",
    "rating": 4.9,
    "experience": 15,
    "bio": "CBT Expert specializing in anxiety and trauma recovery",
    "distance": "Nearby"
  }
]
```

---

## 📚 Resource Endpoints

### **Get Wellness Resources**
```
GET /api/resources
```

**Response:**
```json
[
  {
    "_id": "635abc123def456xyz",
    "category": "Understanding Anxiety",
    "title": "Anxiety Disorders Overview",
    "description": "Learn about symptoms and coping strategies",
    "url": "https://www.nimh.nih.gov/...",
    "type": "article",
    "source": "NIMH"
  }
]
```

---

## 🏥 Statistics Endpoint

### **Get User Statistics**
```
GET /api/stats
```

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "totalMoodEntries": 45,
  "totalChats": 120,
  "moodDistribution": {
    "happy": 20,
    "peaceful": 15,
    "content": 8,
    "down": 2
  }
}
```

---

## 🔍 Collection Data Samples

### **Mood Collection**
```json
{
  "mood": "happy",
  "timestamp": "2024-12-27T10:30:00.000Z"
}
```

### **Vibe Check Collection**
```json
{
  "answers": {
    "q1": "A",
    "q2": "B",
    "q3": "C",
    "q4": "A",
    "q5": "B"
  },
  "score": 8,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### **Chat Collection**
```json
{
  "userMessage": "I'm feeling anxious",
  "aiResponse": "I hear your concern. Let's work through this together...",
  "timestamp": "2024-12-27T10:15:00.000Z"
}
```

### **Meditation Collection**
```json
{
  "duration": 10,
  "type": "guided",
  "timestamp": "2024-12-27T10:20:00.000Z"
}
```

### **Activity Collection**
```json
{
  "type": "login",
  "email": "john@example.com",
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

---

## 🛡️ Error Responses

### **Unauthorized (No Token)**
```
Status: 401
```
```json
{
  "msg": "No token, access denied"
}
```

### **Invalid Token**
```
Status: 401
```
```json
{
  "msg": "Invalid token"
}
```

### **Server Error**
```
Status: 500
```
```json
{
  "success": false,
  "message": "Server error"
}
```

### **Bad Request**
```
Status: 400
```
```json
{
  "success": false,
  "message": "Collection and data are required"
}
```

---

## 🔗 Request Examples (cURL)

### **Save Mood Data**
```bash
curl -X POST http://localhost:5000/api/save-data \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "collection": "moods",
    "data": {"mood": "happy"}
  }'
```

### **Get User Profile**
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "x-auth-token: YOUR_TOKEN"
```

### **Get Mood History**
```bash
curl -X GET http://localhost:5000/api/data/moods \
  -H "x-auth-token: YOUR_TOKEN"
```

### **Update Profile**
```bash
curl -X POST http://localhost:5000/api/profile/update \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "age": 26,
    "sex": "Female"
  }'
```

---

## 🔄 API Response Patterns

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

---

## ⏱️ Rate Limits
- No rate limiting currently (add in production)
- Recommended: 100 requests/minute per user

---

## 🔄 Token Management

**Token Format:** JWT (JSON Web Token)

**Token Expiry:** 7 days

**Refresh Token:** Not implemented (implement in production)

**Token Location (Frontend):** 
- `localStorage.getItem('authToken')`

**How to Use:**
1. Get token from login/register response
2. Store in localStorage
3. Send in every request header: `x-auth-token: <token>`
4. If 401 error, user is logged out

---

## 📊 Data Retention

- All user data stored indefinitely
- User can request deletion (implement GDPR compliance)
- Backups recommended daily

---

## 🚀 Deployment Notes

For production, update:

1. **API Base URL** (in frontend code)
   ```javascript
   const API_URL = 'https://your-api.com';
   ```

2. **JWT Secret** (in backend .env)
   ```
   JWT_SECRET=your-secure-random-string
   ```

3. **MongoDB URI** (in backend .env)
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/aura3
   ```

4. **CORS Settings** (in backend)
   ```javascript
   app.use(cors({ origin: 'https://your-frontend.com' }));
   ```

---

**API Version:** 1.0.0
**Last Updated:** December 27, 2025
**Status:** ✅ Production Ready
