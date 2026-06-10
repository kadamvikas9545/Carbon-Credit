# 🌿 Enhanced Features Implementation Guide

## Overview
This guide shows you how to integrate three major features into AgroGreenBits:
1. **User Profile Management** - Edit personal/company information
2. **Multi-Language Support** - English & Hindi interface  
3. **Advanced AI Prediction Graphs** - Better visualization of carbon credit predictions

---

## 1. USER PROFILE MANAGEMENT

### Backend Setup

**Database Changes:**
- ✅ Added new fields to User model:
  - `bio`: User bio/description (500 chars max)
  - `location`: User location
  - `profileImage`: Base64 or URL
  - `language`: Preferred UI language (en/hi)

**New API Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/profile` | Get current user profile |
| PUT | `/api/profile` | Update user profile (name, phone, bio, etc.) |
| PUT | `/api/profile/password` | Change user password |

**Implementation File:** `backend/routes/profile.js`

### Frontend Integration

**Add to HTML head:**
```html
<script src="enhanced-features.js"></script>
<script src="translations.js"></script>
```

**Key Functions:**
- `loadUserProfile()` - Fetches user data from backend
- `openProfileModal()` - Shows profile edit modal
- `saveUserProfile()` - Saves changes to backend
- `updateProfileUI()` - Updates navbar with user info

**Usage:**
1. When user logs in, call `loadUserProfile()`
2. Click profile button to open modal
3. Edit any field and click "Save Changes"
4. Gets reflected immediately in navbar

### What Users Can Edit:

**All Users:**
- Full Name
- Phone Number  
- Bio/Description
- Location
- Profile Image (future feature)

**Buyers Only:**
- Company Name

**Cannot Edit:**
- Email (locked)
- Password (separate endpoint)
- Role (set at registration)

---

## 2. MULTI-LANGUAGE SUPPORT

### Languages Supported
- 🇬🇧 **English** (en) - Default
- 🇮🇳 **Hindi** (हिंदी) - (hi)

### How It Works

**File:** `frontend/translations.js`

Contains translation dictionary for 200+ terms covering:
- Navigation labels
- Form fields
- Button text
- Error messages
- Charts and descriptions
- Status messages

### Implementation Steps

**Step 1: Add to HTML**
```html
<script src="translations.js"></script>
<script src="enhanced-features.js"></script>
```

**Step 2: Mark Elements for Translation**

Use `data-i18n` attribute for text content:
```html
<h1 data-i18n="dashboard">Dashboard</h1>
<p data-i18n="herePerformance">Here's your farm performance</p>
```

For placeholders:
```html
<input data-i18n-placeholder="searchLocation" />
```

**Step 3: Language Selector**

Automatically added by `createLanguageSelector()`.
Users can change language from top-right dropdown.

**Workflow:**
1. User selects language from dropdown
2. `changeLanguage(lang)` is called
3. All `data-i18n` elements update instantly
4. Choice saved to `localStorage`
5. Page reloads to apply all changes

### Adding New Translations

Edit `frontend/translations.js`:

```javascript
const translations = {
  en: {
    myKey: 'English text here',
  },
  hi: {
    myKey: 'हिंदी पाठ यहाँ',
  }
};
```

Then use in HTML:
```html
<div data-i18n="myKey"></div>
```

---

## 3. ADVANCED AI PREDICTION GRAPHS

### New Visualizations

**Graph 1: SOC vs Confidence Scatter Plot**
- X-axis: Confidence Score (0-100%)
- Y-axis: SOC % (0-10%)
- Shows relationship between model confidence and prediction
- Each dot = one prediction

**Graph 2: Carbon Credits by Depth (Horizontal Bar)**
- Shows how deeper sampling produces more credits
- Helps farmers understand depth importance
- Visual comparison across samples

**Graph 3: Prediction History Timeline (Dual-Axis Line)**
- Left Y-axis: SOC % trend over time
- Right Y-axis: Confidence Score trend
- X-axis: Dates of predictions
- Shows improvement/deterioration of soil health

### Prediction Insight Card

Visual card showing:
```
┌─────────────────────────────────┐
│ Quality Level     │ Credits Generated    │
│ High (70% conf)   │ 45.2 credits @₹800   │
├─────────────────────────────────┤
│ Carbon Stock      │ CO₂ Equivalent       │
│ 1.23 tC/ha        │ 4.52 tCO₂           │
└─────────────────────────────────┘
```

Plus formula breakdown:
```
SOC(2.1%) × Area(5ha) × Depth(30cm) × 0.4747 = 45.2 Credits
```

### Implementation

**Function:** `createAIPredictionCharts(predictions)`

**Input Data Format:**
```javascript
const predictions = [
  {
    soc: 2.1,           // SOC percentage
    confidence: 75,     // 0-100
    depth: 30,          // in cm
    date: '2026-04-04'  // ISO date
  },
  { soc: 2.3, confidence: 68, depth: 30, date: '2026-03-28' },
  { soc: 1.9, confidence: 82, depth: 30, date: '2026-03-15' }
];

// Create all charts
createAIPredictionCharts(predictions);
```

**HTML Setup:**
```html
<!-- Add these canvas elements -->
<canvas id="socConfidenceChart"></canvas>
<canvas id="carbonByDepthChart"></canvas>
<canvas id="predictionTimelineChart"></canvas>

<!-- Insight card -->
<div id="predictionInsight"></div>
```

**JavaScript:**
```javascript
// Generate insight card
const cardHTML = createPredictionInsightCard(predictions[0]);
document.getElementById('predictionInsight').innerHTML = cardHTML;
```

---

## 4. INTEGRATION STEPS

### Step 1: Update Backend

```bash
cd backend
# Update User model - already done ✅
# Add profile routes - already done ✅
# Update server.js - already done ✅

# No restart needed if server auto-reloads
```

### Step 2: Update Frontend HTML

Add these scripts in `<head>` section:

```html
<!-- Before closing </head> -->
<script src="translations.js"></script>
<script src="enhanced-features.js"></script>
```

### Step 3: Add New Elements

Add these canvas elements to AI Predict tab:

```html
<div id="tab-ai" style="display:none">
  <!-- Existing content -->
  
  <!-- Add these new chart sections -->
  <div class="chart-card" style="margin-top: 2rem">
    <div class="chart-header">
      <span class="chart-title" data-i18n="socConfidenceTitle">SOC vs Model Confidence</span>
    </div>
    <div class="chart-wrap">
      <canvas id="socConfidenceChart"></canvas>
    </div>
  </div>
  
  <div class="chart-card">
    <div class="chart-header">
      <span class="chart-title" data-i18n="carbonDepthTitle">Carbon by Soil Depth</span>
    </div>
    <div class="chart-wrap" style="height: 300px">
      <canvas id="carbonByDepthChart"></canvas>
    </div>
  </div>
  
  <div class="chart-card">
    <div class="chart-header">
      <span class="chart-title" data-i18n="predictionHistoryTitle">Prediction History</span>
    </div>
    <div class="chart-wrap">
      <canvas id="predictionTimelineChart"></canvas>
    </div>
  </div>
  
  <div id="predictionInsight"></div>
</div>
```

### Step 4: Initialize on Login

When farmer logs in, add to your JavaScript:

```javascript
// After successful login
loadUserProfile();           // Load profile from backend
initializeLanguage();        // Set language preference
createLanguageSelector();    // Show language dropdown
addProfileToNavbar();        // Add profile button
```

### Step 5: Load Prediction Data

When showing AI prediction results:

```javascript
// After prediction completes
const predictions = [
  // Your prediction data
  { soc: 2.1, confidence: 75, depth: 30, date: new Date().toISOString() }
];

createAIPredictionCharts(predictions);
updateUILanguage(getCurrentLanguage()); // Refresh i18n
```

---

## 5. FILES CREATED/MODIFIED

### New Files:
```
frontend/translations.js           - 200+ translation strings
frontend/enhanced-features.js      - Profile, language, graph logic
backend/routes/profile.js          - Profile API endpoints
```

### Modified Files:
```
backend/models/User.js             - Added bio, location, language fields
backend/server.js                  - Added profile route
```

---

## 6. USAGE EXAMPLES

### Example 1: User Opens Profile

```javascript
// User clicks "Profile" button
openProfileModal();
// Modal appears with current data
// User edits and clicks "Save Changes"
// saveUserProfile() runs
// Profile updates in DB
// Navbar reflects changes instantly
```

### Example 2: User Changes Language

```javascript
// User selects Hindi from dropdown
changeLanguage('hi');
// All text updates to Hindi
// Language saved to localStorage
// Page reloads
```

### Example 3: Show Prediction Analytics

```javascript
// After AI prediction
const result = {
  soc: 2.3,
  confidence: 72,
  carbonStock: 3.5,
  co2Equivalent: 12.8,
  credits: 45.2
};

// Create charts
const predictions = [result]; // Can be multiple historic predictions
createAIPredictionCharts(predictions);

// Show insight card
const card = createPredictionInsightCard(result);
document.getElementById('predictionInsight').innerHTML = card;
```

---

## 7. TESTING CHECKLIST

- [ ] Backend profile endpoint returns user data
- [ ] Update profile changes persist in DB
- [ ] Language selector appears on page
- [ ] English/Hindi translations switch correctly
- [ ] All elements with `data-i18n` update when language changes
- [ ] Profile modal opens/closes properly
- [ ] Charts render with sample data
- [ ] Charts update when new predictions added
- [ ] Insight card displays correct calculations
- [ ] localStorage saves language preference
- [ ] Page reload maintains selected language

---

## 8. FUTURE ENHANCEMENTS

Suggested improvements:
- Add more languages (Tamil, Telugu, Gujarati)
- Profile image upload with preview
- User notification preferences (language for emails)
- Analytics dashboard with more graph types
- Export predictions as PDF/JSON
- Real-time multi-user updates
- Mobile app profile management

---

## 9. TROUBLESHOOTING

**Problem:** Profile not loading
- Check localStorage has valid token
- Verify backend server running on port 5000
- Check browser console for CORS errors

**Problem:** Translations not updating
- Ensure `data-i18n` attributes are correct
- Check translations.js is loaded
- Clear browser cache
- Re-run `initializeLanguage()`

**Problem:** Charts not showing
- Verify Chart.js v4.4.1+ is included
- Check canvas IDs match JavaScript
- Ensure prediction data format is correct
- Check browser console for errors

---

## 10. API REFERENCE

### GET /api/profile
Get current user profile

**Request:**
```
Headers: Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "62a2b1c3d4e5f6g7h8i9j0k1",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "phone": "+91 9876543210",
    "bio": "Organic farmer from Maharashtra",
    "location": "Nashik, Maharashtra",
    "createdAt": "2026-03-01T10:30:00Z"
  }
}
```

### PUT /api/profile
Update user profile

**Request:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "+91 9876543210",
  "bio": "Organic farmer from Maharashtra",
  "location": "Nashik, Maharashtra",
  "companyName": null
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

**Ready to implement? Start with Step 1 of the Integration Steps section!** 🚀

