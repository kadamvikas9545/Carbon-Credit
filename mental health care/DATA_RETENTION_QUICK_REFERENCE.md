# 🗑️ Data Retention - Quick Reference

## What Happens
All user data **automatically deletes after 15 days**.

## Collections Affected
- ⭐ Reviews
- 🎯 Vibe Checks
- 💬 Chat History
- 🧘 Meditation Sessions
- 😊 Mood Check-ins

## How It Works
```
Day 0 → Submit data
Days 1-14 → Data available
Day 15 → Auto-delete trigger
Within 24h → Data removed permanently
```

## Check Status
```bash
curl http://localhost:5000/api/data-retention/status
```

## Manual Cleanup
```bash
curl -X POST http://localhost:5000/api/data-retention/cleanup
```

## Change Retention Period
Edit `server.js` - Find TTL index lines:

```javascript
// Current: 15 days (1296000 seconds)
ReviewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });

// Change to different duration:
// 7 days = 604800
// 30 days = 2592000
// 60 days = 5184000
```

## How It's Implemented
1. **MongoDB TTL Index** - Auto-deletes every 60 seconds
2. **Backend Cleanup** - Runs every 24 hours as backup

## Server Log Output
```
✅ Data retention policy: 15 days (auto-cleanup enabled)
🗑️ Deleted X reviews older than 15 days
🗑️ Deleted X vibe checks older than 15 days
🗑️ Deleted X chat sessions older than 15 days
🗑️ Deleted X meditation records older than 15 days
🗑️ Deleted X mood records older than 15 days
```

## Verify It's Working
```bash
# In MongoDB
mongo mongodb://127.0.0.1:27017/aura3

# Check reviews collection indexes
db.reviews.getIndexes()

# Should show:
# { "v" : 2, "key" : { "createdAt" : 1 }, "expireAfterSeconds" : 1296000 }
```

## Important Notes
⚠️ **Once deleted, data cannot be recovered**
⚠️ **No manual recovery possible**
⚠️ **Automatic - no user action needed**
✅ **GDPR compliant**
✅ **Privacy-focused**

---

**Data Retention: 15 Days** | **Auto-Delete: Enabled** | **Status: Active**
