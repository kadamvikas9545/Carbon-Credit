# 📊 MongoDB Integration - Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         AURA 3.0 PLATFORM                   │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────┐        ┌─────────────────────┐
│   FRONTEND (Browser)   │        │  BACKEND (Node.js)  │
│  - simple.html         │◄──────►│  - Express Server   │
│  - React Components    │ HTTP   │  - Port 5000        │
│  - User Interface      │        │  - Gemini AI        │
└────────────────────────┘        └─────────────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │   MONGODB    │
                                  │  - aura3 DB  │
                                  │  - Collections
                                  │  - Documents │
                                  └──────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ Compass Viewer
                                  │ (Data Browser)
                                  └──────────────┘
```

---

## Data Flow - Review Submission

```
User Fills Review Form
    │
    ▼
┌─────────────────────────────────┐
│  Review Modal (simple.html)     │
│ - Name field                    │
│ - Rating (1-5 stars)            │
│ - Comment text                  │
│ - Anonymous checkbox            │
└─────────────────────────────────┘
    │
    ▼ (User clicks "Review & Confirm")
┌─────────────────────────────────┐
│  previewReview() Function       │
│ - Validate inputs               │
│ - Store in window.tempReviewData│
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Confirmation Modal Appears     │
│ - Shows review summary          │
│ - Displays star rating          │
│ - Shows comment                 │
│ - Edit or Confirm buttons       │
└─────────────────────────────────┘
    │
    ▼ (User clicks "Confirm & Sign")
┌─────────────────────────────────┐
│  submitReviewConfirmed()        │
│ - Prepare request               │
│ - Get user email from storage   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  POST /api/reviews              │
│  Request to Backend             │
│  {name, rating, comment,        │
│   email, anonymous}             │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Backend (server.js)            │
│ - Validate data                 │
│ - Create review object          │
│ - Save to MongoDB               │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  MongoDB - reviews Collection   │
│ {                               │
│   _id: ObjectId,                │
│   name: "John Doe",             │
│   rating: 5,                    │
│   comment: "Great app!",        │
│   anonymous: false,             │
│   userEmail: "john@email.com",  │
│   createdAt: Date               │
│ }                               │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  loadReviews() Function         │
│ - Fetch from MongoDB            │
│ - Parse response                │
│ - Display in UI                 │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Toast: "Review posted!"        │
│  Reviews updated on page        │
└─────────────────────────────────┘
```

---

## Data Flow - Vibe Check

```
User Navigates to Vibe Check
    │
    ▼
┌─────────────────────────────────┐
│  Vibe Check Form                │
│ - 5 Questions (A-E answers)     │
│ - Overall vibe                  │
│ - Energy level                  │
│ - Focus level                   │
│ - Motivation level              │
│ - Stress level                  │
└─────────────────────────────────┘
    │
    ▼ (User submits form)
┌─────────────────────────────────┐
│  completeVibeCheck() Function   │
│ - Extract answers               │
│ - Calculate scores              │
│ - Check for alerts              │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  POST /api/vibecheck            │
│  Request to Backend             │
│  {vibes: {...}, userEmail}      │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Backend (server.js)            │
│ - Create vibecheck object       │
│ - Save to MongoDB               │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  MongoDB - vibechecks Collection│
│ {                               │
│   _id: ObjectId,                │
│   userEmail: "user@email.com",  │
│   vibes: {                      │
│     overallVibe: "C",           │
│     energy: "B",                │
│     focus: "D",                 │
│     motivation: "C",            │
│     stress: "E"                 │
│   },                            │
│   timestamp: Date               │
│ }                               │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Redirect to Dashboard          │
│  Store in localStorage backup   │
└─────────────────────────────────┘
```

---

## Data Flow - Chat Messages

```
User Types Message in Chat
    │
    ▼
┌─────────────────────────────────┐
│  sendMessage() Function         │
│ - Get message from input        │
│ - Add to chat display           │
│ - Clear input                   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  generateAiResponse() Function  │
│ - POST to backend /api/chat     │
│ - Call Gemini API               │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Backend receives /api/chat     │
│ - Process with Gemini           │
│ - Return AI response            │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  saveChatMessage() Function     │
│ - Save to localStorage          │
│ - POST to MongoDB               │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  POST /api/save-data            │
│  {                              │
│   collection: "chatMessages",   │
│   data: {                       │
│     userMessage: "...",         │
│     aiResponse: "...",          │
│     userEmail: "...",           │
│     timestamp: Date             │
│   }                             │
│  }                              │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  MongoDB saves chat message     │
│  Display in conversation        │
│  Continue chatting              │
└─────────────────────────────────┘
```

---

## Database Schema Hierarchy

```
aura3 (Database)
├── users
│   ├── _id: ObjectId (primary key)
│   ├── name: String
│   ├── email: String (unique)
│   ├── password: String (hashed)
│   ├── age: Number
│   ├── sex: String
│   └── createdAt: Date
│
├── reviews
│   ├── _id: ObjectId
│   ├── user: ObjectId (reference)
│   ├── name: String
│   ├── email: String
│   ├── rating: Number (1-5)
│   ├── comment: String
│   ├── anonymous: Boolean
│   └── createdAt: Date
│
├── vibechecks
│   ├── _id: ObjectId
│   ├── user: ObjectId
│   ├── userEmail: String
│   ├── vibes: {
│   │   ├── overallVibe: String
│   │   ├── energy: String
│   │   ├── focus: String
│   │   ├── motivation: String
│   │   └── stress: String
│   │ }
│   └── timestamp: Date
│
├── chathistories
│   ├── _id: ObjectId
│   ├── user: ObjectId
│   ├── userEmail: String
│   ├── messages: [{
│   │   ├── text: String
│   │   ├── from: String
│   │   └── timestamp: Date
│   │ }]
│   ├── startedAt: Date
│   ├── endedAt: Date
│   └── sessionDuration: Number
│
├── meditations
│   ├── _id: ObjectId
│   ├── user: ObjectId
│   ├── userEmail: String
│   ├── duration: Number
│   ├── type: String
│   ├── feedback: String
│   └── completedAt: Date
│
└── moods
    ├── _id: ObjectId
    ├── user: ObjectId
    ├── mood: String
    ├── note: String
    └── createdAt: Date
```

---

## API Endpoint Connections

```
FRONTEND                        BACKEND                      MONGODB
─────────────────────────────────────────────────────────────────────

[Review Form]
    │
    └──► POST /api/reviews ──────► reviewController ──► db.reviews
    │
    └──► GET /api/reviews ──────► reviewController ──► db.reviews


[Vibe Check]
    │
    └──► POST /api/vibecheck ──────► vibeCheckController ──► db.vibechecks
    │
    └──► GET /api/vibecheck/:email ──────► vibeCheckController ──► db.vibechecks


[Chat Input]
    │
    ├──► POST /api/chat ──────► Gemini API (AI Response)
    │
    └──► POST /api/save-data ──────► dataController ──► db.generic_data


[Registration]
    │
    └──► POST /api/register ──────► authController ──► db.users


[Login]
    │
    └──► POST /api/login ──────► authController ──► db.users
```

---

## Error Handling Flow

```
User Action
    │
    ▼
┌──────────────────────┐
│ Try MongoDB save     │
└──────────────────────┘
    │
    ├─────Success──────────┐
    │                      ▼
    │            ┌──────────────────┐
    │            │ Data in MongoDB  │
    │            │ + localStorage   │
    │            │ Toast: Success   │
    │            └──────────────────┘
    │
    └─────Error─────────────┐
                             ▼
                  ┌──────────────────────┐
                  │ Fallback to localStorage
                  │ Console: Error logged
                  │ Toast: Partial success
                  │ Data still available  │
                  └──────────────────────┘
```

---

## Authentication Flow

```
User Registration/Login
    │
    ▼
┌────────────────────────────────┐
│ Validate credentials           │
│ Hash password (bcryptjs)       │
│ Create user in MongoDB         │
└────────────────────────────────┘
    │
    ▼
┌────────────────────────────────┐
│ Generate JWT Token             │
│ Return token to frontend       │
└────────────────────────────────┘
    │
    ▼
┌────────────────────────────────┐
│ Frontend stores:               │
│ - authToken (in localStorage)  │
│ - currentUserId                │
│ - userEmail ← TRACKING         │
│ - userName ← TRACKING          │
└────────────────────────────────┘
    │
    ▼
┌────────────────────────────────┐
│ All future submissions          │
│ tagged with userEmail          │
│ Enables user-specific queries  │
└────────────────────────────────┘
```

---

## Data Backup & Recovery

```
┌─────────────────────┐
│  Production Data    │
│  in MongoDB         │
└─────────────────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
    ┌─────────┐  ┌─────────┐  ┌─────────────┐
    │ Compass │  │ Backup  │  │ localStorage│
    │ Viewer  │  │ Service │  │ (Fallback)  │
    └─────────┘  └─────────┘  └─────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Data Available  │
    │ for Recovery    │
    │ & Analysis      │
    └─────────────────┘
```

---

## Integration Timeline

```
Step 1: MongoDB Setup
    │
    ├── Install MongoDB
    ├── Start mongod
    └── Create aura3 database
            │
            ▼
Step 2: Backend Configuration  
    │
    ├── Create .env file
    ├── npm install dependencies
    ├── Add Schemas to server.js
    └── Add API endpoints
            │
            ▼
Step 3: Frontend Integration
    │
    ├── Update review submission
    ├── Update vibe check saving
    ├── Update chat logging
    ├── Add email tracking
    └── Add fallback logic
            │
            ▼
Step 4: Testing
    │
    ├── Test review submission
    ├── Test vibe check
    ├── Test chat messages
    ├── Verify MongoDB data
    └── Check MongoDB Compass
            │
            ▼
Step 5: Production Ready
    │
    └── All systems operational!
```

---

**Diagrams Created:** December 27, 2025
**Version:** 1.0
