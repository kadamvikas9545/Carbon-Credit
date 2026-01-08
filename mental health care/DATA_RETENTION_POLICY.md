# 📋 Data Retention Policy - 15-Day Auto-Delete

## Overview
All user data in Aura3.0 is **automatically deleted after 15 days**. This includes reviews, vibe checks, chat history, meditation sessions, and mood check-ins.

---

## 🎯 What Gets Deleted After 15 Days?

| Data Type | Storage | Deletion Timeline |
|-----------|---------|-------------------|
| ⭐ Reviews | `reviews` collection | 15 days from creation |
| 🎯 Vibe Checks | `vibechecks` collection | 15 days from completion |
| 💬 Chat Sessions | `chathistories` collection | 15 days from session start |
| 🧘 Meditation Logs | `meditations` collection | 15 days from completion |
| 😊 Mood Check-ins | `moods` collection | 15 days from creation |

---

## ⚙️ How It Works

### 1️⃣ MongoDB TTL Indexes (Automatic)
Each collection has a TTL (Time To Live) index configured:

```javascript
// Reviews - Delete after 15 days
ReviewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });

// Vibe Checks - Delete after 15 days  
VibeCheckSchema.index({ timestamp: 1 }, { expireAfterSeconds: 1296000 });

// Chat History - Delete after 15 days
ChatHistorySchema.index({ startedAt: 1 }, { expireAfterSeconds: 1296000 });

// Meditations - Delete after 15 days
MeditationSchema.index({ completedAt: 1 }, { expireAfterSeconds: 1296000 });

// Moods - Delete after 15 days
MoodSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });
```

**How it works:**
- MongoDB automatically runs a background task every 60 seconds
- Checks for documents with timestamp older than 15 days
- Automatically removes expired documents
- No manual intervention needed

---

### 2️⃣ Backend Cleanup Function (Scheduled)
```javascript
// Runs every 24 hours
setInterval(cleanupOldData, 24 * 60 * 60 * 1000);
```

**What it does:**
- Manually deletes data older than 15 days
- Logs number of deleted records
- Acts as backup to TTL index
- Can be triggered manually via API

---

## 📊 Data Retention Timeline

```
Day 0 - Data Created
  │
  ├─ Day 1-7: Full data available
  │
  ├─ Day 8-14: Data still available
  │
  └─ Day 15: Data marked for deletion
       │
       └─ Within 24 hours: Automatic deletion occurs
            │
            └─ After deletion: Data no longer accessible
```

---

## 🔍 Check Data Retention Status

### API Endpoint
```
GET /api/data-retention/status
```

### Response Example
```json
{
  "success": true,
  "status": "active",
  "retentionDays": 15,
  "nextCleanupTime": "2025-12-28T12:00:00Z",
  "currentTimestamp": "2025-12-27T12:00:00Z",
  "dataExpiresBefore": "2025-12-12T12:00:00Z",
  "collections": {
    "reviews": 45,
    "vibeChecks": 120,
    "chatHistory": 89,
    "meditations": 34,
    "moods": 200
  },
  "expiredData": {
    "expiredReviews": 12,
    "expiredVibeChecks": 35,
    "expiredChats": 18,
    "expiredMeditations": 5,
    "expiredMoods": 50
  }
}
```

---

## 🧹 Manual Data Cleanup

### Trigger Cleanup
```bash
curl -X POST http://localhost:5000/api/data-retention/cleanup
```

### Response
```json
{
  "success": true,
  "message": "Data cleanup completed successfully",
  "timestamp": "2025-12-27T12:00:00Z"
}
```

---

## 📝 Implementation Details

### 15 Days in Seconds
```
15 days = 15 × 24 × 60 × 60 = 1,296,000 seconds
```

### TTL Index Configuration
```javascript
{
  expireAfterSeconds: 1296000  // 15 days
}
```

### How MongoDB TTL Works
1. **Document Creation:** Timestamp field recorded
2. **Background Task:** MongoDB checks every 60 seconds
3. **Comparison:** Checks if `timestamp + TTL seconds < current time`
4. **Deletion:** Auto-removes expired documents
5. **Cleanup:** Freed up database space

---

## 🛡️ Data Safety

### ✅ Before Deletion
- Data is accessible for full 15 days
- Users can export/backup data if needed
- Meditation history available for 15 days
- Chat history available for 15 days

### ✅ After Deletion
- Data is permanently removed
- Cannot be recovered
- Storage space freed
- Privacy maintained

---

## ⚙️ Configuration

### To Change Retention Period

Edit `server.js` and update the TTL in all schemas:

```javascript
// Current: 15 days (1296000 seconds)
// Change to different value as needed:

// 7 days = 604800 seconds
ReviewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// 30 days = 2592000 seconds
ReviewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Disable auto-delete (keep forever - not recommended)
// Remove the index entirely
```

---

## 📋 Conversion Reference

| Duration | Seconds |
|----------|---------|
| 1 day | 86,400 |
| 7 days | 604,800 |
| 15 days | 1,296,000 ✅ (Current) |
| 30 days | 2,592,000 |
| 60 days | 5,184,000 |
| 90 days | 7,776,000 |

---

## 🔔 Data Deletion Schedule

### Automatic Deletion
- **Frequency:** Every 60 seconds (MongoDB TTL)
- **Fallback:** Every 24 hours (Backend cleanup function)
- **Timing:** Non-blocking, background process

### Example Timeline
```
Dec 27: User submits review
  │
  └─→ Dec 28-Jan 11: Data available (15 days)
       │
       └─→ Jan 12: Automatic deletion triggers
            │
            └─→ Data permanently removed
```

---

## 🔐 Privacy & Compliance

### GDPR Compliance
✅ Automatic data deletion complies with data minimization principle
✅ Users don't retain data longer than necessary
✅ Right to be forgotten implemented automatically

### Data Privacy
✅ No manual deletion needed
✅ Automated process, no human intervention
✅ All data types covered equally
✅ Timestamp-based, not user-based

---

## 📊 Monitoring

### Check MongoDB TTL Status
```bash
# Connect to MongoDB
mongo mongodb://127.0.0.1:27017/aura3

# Check indexes on reviews collection
db.reviews.getIndexes()

# Look for indexes with "expireAfterSeconds": 1296000
```

### Expected Output
```javascript
{
  "v" : 2,
  "key" : { "createdAt" : 1 },
  "expireAfterSeconds" : 1296000
}
```

---

## 🚨 Important Notes

### ⚠️ Database Size Reduction
- Deletes occur automatically
- Freed space can be reclaimed with:
  ```bash
  db.reviews.reIndex()
  ```

### ⚠️ Backup Recommendation
- If critical data, **backup before 15 days**
- No recovery possible after deletion
- Consider implementing export feature

### ⚠️ User Notification
- Users should know data expires in 15 days
- Consider adding in-app notification
- Recommend exports/screenshots if needed

---

## 🔧 Troubleshooting

### Issue: Data Not Being Deleted

**Solution 1: Verify TTL Index**
```bash
db.reviews.getIndexes()
# Should show expireAfterSeconds: 1296000
```

**Solution 2: Manual Cleanup**
```bash
curl -X POST http://localhost:5000/api/data-retention/cleanup
```

**Solution 3: Restart MongoDB**
- TTL monitor may need restart
- Stop and start MongoDB service

### Issue: TTL Not Working

**Causes:**
- TTL index not created
- MongoDB TTL monitor disabled
- Index expired settings incorrect

**Fix:**
```javascript
// Recreate index in server.js
ReviewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });

// Restart backend
node server.js
```

---

## 📝 Example: User Journey

```
Day 0:
  ├─ 9:00 AM - User submits review
  └─ Saved to MongoDB with timestamp: 2025-12-27T09:00:00Z

Days 1-14:
  ├─ Review visible in app
  ├─ Can be viewed/fetched via API
  └─ In database storage

Day 15:
  ├─ 9:00 AM - Data reaches 15-day mark
  ├─ MongoDB TTL detects expiration
  └─ Document marked for deletion

Day 15 (within 24 hours):
  ├─ MongoDB background job removes document
  ├─ Backend cleanup function also removes it
  ├─ Storage freed
  └─ Data no longer accessible

Day 16+:
  └─ Data permanently gone (not recoverable)
```

---

## 🎯 API Endpoints

### Get Retention Status
```
GET /api/data-retention/status
```
**Purpose:** Check current data and expiration info
**Response:** JSON with collection counts and expired items

### Trigger Manual Cleanup
```
POST /api/data-retention/cleanup
```
**Purpose:** Manually trigger data deletion
**Response:** Success message and timestamp

### Check Server Health
```
GET /api/health
```
**Purpose:** Verify server status
**Response:** Includes retention policy info

---

## 📚 Environment Configuration

Add to `.env` (if custom retention needed):
```env
# Data retention in days (default: 15)
DATA_RETENTION_DAYS=15

# Cleanup interval in hours (default: 24)
CLEANUP_INTERVAL_HOURS=24
```

---

## 🔄 Summary

| Aspect | Details |
|--------|---------|
| **Retention Period** | 15 days |
| **Auto-Delete** | ✅ Enabled |
| **Deletion Method** | MongoDB TTL Index + Backend Cleanup |
| **Deletion Frequency** | Every 60 seconds (TTL) + Daily (Backend) |
| **Affected Collections** | reviews, vibechecks, chathistories, meditations, moods |
| **Recovery** | ❌ Not possible after deletion |
| **Manual Cleanup** | ✅ Available via API |
| **Monitoring** | ✅ Status endpoint available |
| **User Notification** | ⚠️ Recommended (implement in frontend) |

---

## ✅ Implementation Checklist

- [x] TTL indexes added to all data collections
- [x] Automatic cleanup function created
- [x] Runs every 24 hours automatically
- [x] API endpoint for retention status
- [x] API endpoint for manual cleanup
- [x] Server logs data deletion
- [x] Documented for users
- [ ] Add user notification (frontend task)
- [ ] Add data export feature (optional)
- [ ] Set up monitoring/alerts (optional)

---

**Data Retention Policy Implemented:** December 27, 2025  
**Retention Period:** 15 days  
**Status:** ✅ Active and Running  
**Version:** 1.0
