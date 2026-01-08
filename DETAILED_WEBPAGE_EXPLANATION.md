# 🧠 AURA 3.0 - COMPLETE WEBPAGE EXPLANATION

## TABLE OF CONTENTS
1. [HTML Structure Overview](#html-structure)
2. [CSS Styling System](#css-styling)
3. [Navigation & Layout](#navigation)
4. [Hero Section](#hero-section)
5. [Dashboard Section](#dashboard)
6. [Vibe Check Section](#vibe-check)
7. [Chat Section](#chat)
8. [Mood Analysis Section](#mood-analysis)
9. [Meditation Section](#meditation)
10. [Therapists Section](#therapists)
11. [Resources Section](#resources)
12. [Profile Section](#profile)
13. [JavaScript Functions](#javascript)

---

# HTML STRUCTURE

## 1. DOCTYPE & HEAD SECTION (Lines 1-9)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura3.0 - Advanced Mental Health Platform</title>
```

### **Explanation:**
- **`<!DOCTYPE html>`** - Tells browser this is HTML5 (latest standard)
- **`<html lang="en">`** - Root element, language set to English
- **`<meta charset="UTF-8">`** - Specifies character encoding (Unicode supports all languages)
- **`<meta name="viewport">`** - Makes page responsive on mobile devices
- **`<title>`** - What appears in browser tab and search results

## 2. EXTERNAL LIBRARIES (Lines 7-9)
```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/dist/face-api.js"></script>
```

### **Explanation:**
- **TensorFlow.js** - AI library for emotion detection from facial expressions
- **Face-API.js** - Detects faces and analyzes emotions in real-time
- These enable the "Mood Analysis" feature that reads your emotions

---

# CSS STYLING SYSTEM

## 3. UNIVERSAL STYLES & COLOR PALETTE (Lines 10-35)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### **Explanation:**
- **`*` selector** - Applies to ALL elements on page
- **`margin: 0; padding: 0;`** - Removes default spacing (browsers add default spacing)
- **`box-sizing: border-box`** - Includes padding/borders in element width/height calculation

### **Color Variables (--primary, --secondary, etc.)**

```css
:root {
  --primary: #58cc02;        /* Bright green - main color */
  --secondary: #1cb0f6;      /* Bright blue - accent */
  --accent: #ff9600;         /* Orange - highlights */
  --danger: #ff4b4b;         /* Red - warnings */
}
```

**How they're used throughout the site:**
- Main buttons: Green (#58cc02)
- Links: Blue (#1cb0f6)
- Highlights: Orange (#ff9600)
- Errors: Red (#ff4b4b)

## 4. ANIMATIONS (Lines 37-120)

### **Float Animation**
```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}
```
**Used for:** Logo and floating elements - goes up and down smoothly

### **Bounce Animation**
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```
**Used for:** Badges and calls-to-action - playful bouncing effect

### **Wiggle Animation**
```css
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
```
**Used for:** Mood icons - gentle left-right rotation

---

# NAVIGATION & LAYOUT

## 5. NAVIGATION BAR (Lines 155-210)

```html
<nav>
  <div class="logo" onclick="showSection('home')">
    <div class="logo-icon">🧠</div>
    <div>Aura3.0</div>
  </div>
  <div class="nav-links" id="mainNav">
    <a onclick="showSection('features')">Features</a>
    <a onclick="showSection('therapists')">Find Therapist</a>
    <a onclick="showSection('resources')">Resources</a>
    <button class="btn btn-primary" onclick="showModal('login')">Sign In</button>
  </div>
  <div class="nav-links hidden" id="dashboardNav">
    <a onclick="showSection('dashboard')">Dashboard</a>
    <a onclick="showSection('vibe-check')">Vibe Check</a>
    <a onclick="showSection('chat')">Chat</a>
    <a onclick="showSection('meditation')">Meditation</a>
    <a onclick="showSection('therapists')">Therapists</a>
    <a onclick="showSection('resources')">Resources</a>
    <a onclick="showSection('profile')">👤 Profile</a>
    <button class="btn btn-secondary" onclick="logout()">Logout</button>
  </div>
</nav>
```

### **Explanation:**

1. **Logo Section:**
   - 🧠 Brain emoji inside colored circle
   - Clicking it takes you to home section
   - Changes color on hover (scale 1.05)

2. **mainNav (Before Login):**
   - Shows: Features, Find Therapist, Resources, Sign In button
   - Visible to guests (not logged in)

3. **dashboardNav (After Login):**
   - Shows: Dashboard, Vibe Check, Chat, Meditation, Therapists, Resources, Profile, Logout
   - Hidden by default (class="hidden")
   - Only appears after user logs in

### **Navigation Styling:**
```css
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  width: 0;
  height: 3px;
  background: var(--primary);
  transition: width 0.3s;
}

.nav-links a:hover::after {
  width: 100%;  /* Green underline appears on hover */
}
```

## 6. LANGUAGE SELECTOR (Lines 211-240)

```html
<div class="language-selector">
  <select id="languageSelect" onchange="changeLanguage(this.value)">
    <option value="en">🌍 English</option>
    <option value="es">🇪🇸 Español</option>
    <option value="fr">🇫🇷 Français</option>
    <option value="hi">🇮🇳 हिंदी</option>
  </select>
</div>
```

### **Explanation:**
- Fixed position (bottom-right corner): `position: fixed; bottom: 30px; right: 30px;`
- Dropdown menu with 4 languages
- `onchange="changeLanguage(this.value)"` - Triggers translation when selection changes
- Green border with smooth hover effect

---

# HERO SECTION (Home Page)

## 7. HERO SECTION HTML (Lines 1282-1330)

```html
<section class="hero" id="home">
  <div class="badge">🌸 Your AI-Powered Mental Health Companion</div>
  
  <h1>Your Wellness Journey Starts Here</h1>
  
  <p>Track your mood • Practice meditation • Connect with therapists • Manage stress</p>
  
  <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin:2rem 0;">
    <button class="btn btn-primary" onclick="handleFeatureClick('dashboard')">
      🎯 Get Started
    </button>
    <button class="btn btn-secondary" onclick="handleFeatureClick('meditation')">
      🧘 Try Meditation
    </button>
  </div>
</section>
```

### **Styling - CSS (Lines 240-290):**

```css
.hero {
  padding: 8rem 5% 4rem;              /* Top: 8rem (space from nav) */
  text-align: center;                 /* All content centered */
  min-height: 100vh;                  /* Takes full viewport height */
  display: flex;                      /* Uses flexbox */
  flex-direction: column;              /* Stacks items vertically */
  justify-content: center;             /* Centers vertically */
  position: relative;                 /* For background positioning */
}

.badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease, bounce 2s ease infinite;
  box-shadow: 0 4px 15px rgba(255, 150, 0, 0.3);
}
```

### **What Each Line Does:**

| CSS Property | Effect |
|---|---|
| `padding: 8rem 5% 4rem` | Top: 8rem (below navbar), sides: 5%, bottom: 4rem |
| `min-height: 100vh` | Minimum height = full viewport (100% of visible screen) |
| `flex-direction: column` | Items stack vertically (top to bottom) |
| `justify-content: center` | Items centered vertically within the space |
| `animation: bounce 2s infinite` | Bounces up/down every 2 seconds, loops forever |

---

# DASHBOARD SECTION

## 8. DASHBOARD HTML (Lines 1331-1500)

```html
<section class="section-container hidden" id="dashboard">
  <div class="section-header">
    <h2>📊 Dashboard</h2>
    <p>Your mental wellness overview</p>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value" id="moodCount">0</div>
      <div class="stat-label">Mood Check-ins</div>
      <button onclick="showMoodHistory()">View History</button>
    </div>
    
    <div class="stat-card">
      <div class="stat-value" id="meditationMinutes">0</div>
      <div class="stat-label">Meditation Minutes</div>
      <button onclick="showMeditationHistory()">View History</button>
    </div>
    
    <div class="stat-card">
      <div class="stat-value" id="dayStreak">0</div>
      <div class="stat-label">Day Streak</div>
      <button onclick="showStreakDetails()">View Details</button>
    </div>
    
    <div class="stat-card">
      <div class="stat-value" id="chatCount">0</div>
      <div class="stat-label">Chat Sessions</div>
      <button onclick="showChatHistory()">View History</button>
    </div>
  </div>
</section>
```

### **Explanation:**

1. **Section Container:**
   - `id="dashboard"` - Used by JavaScript to show/hide this section
   - `class="section-container hidden"` - Hidden by default until user logs in

2. **Section Header:**
   - Title: "📊 Dashboard"
   - Description text

3. **Stats Grid:**
   - Shows 4 cards in grid layout (responsive)
   - Each card displays:
     - **Value:** ID like `id="moodCount"` (updated by JavaScript)
     - **Label:** What the stat represents
     - **Button:** To view detailed history

4. **Stat Card Example:**
   ```
   ┌─────────────────────┐
   │        10           │  ← Number (stat-value)
   │  Mood Check-ins     │  ← Description (stat-label)
   │  View History       │  ← Button (onclick function)
   └─────────────────────┘
   ```

---

# VIBE CHECK SECTION

## 9. VIBE CHECK (Emotional Survey) - HTML (Lines 1501-1650)

```html
<section class="section-container hidden" id="vibe-check">
  <div class="section-header">
    <h2>✨ Vibe Check - How Are You Feeling?</h2>
    <p>Quick mood & wellness assessment</p>
  </div>
  
  <form id="vibeCheckForm" onsubmit="completeVibeCheck(event)">
    <!-- Sleep Schedule Question -->
    <div class="form-section">
      <label>How's your sleep schedule?</label>
      <div class="options">
        <input type="radio" name="sleepSchedule" value="Excellent" required>
        <label>✨ Excellent (7-9 hrs)</label>
        
        <input type="radio" name="sleepSchedule" value="Good">
        <label>👍 Good (5-7 hrs)</label>
        
        <input type="radio" name="sleepSchedule" value="Poor">
        <label>😴 Poor (< 5 hrs)</label>
      </div>
    </div>
    
    <!-- Current State Question -->
    <div class="form-section">
      <label>Your current state?</label>
      <div class="options">
        <input type="radio" name="currentState" value="Energetic" required>
        <label>⚡ Energetic</label>
        
        <input type="radio" name="currentState" value="Calm">
        <label>😌 Calm</label>
        
        <input type="radio" name="currentState" value="Stressed">
        <label>😰 Stressed</label>
      </div>
    </div>
    
    <!-- More form sections... -->
    <button type="submit" class="btn btn-primary">Submit Vibe Check</button>
  </form>
</section>
```

### **Form Structure:**

Each question has:
1. **`<label>`** - Question text
2. **Radio buttons** - User selects one option
   - `type="radio"` - Only one can be selected per group
   - `name="sleepSchedule"` - Groups them together
   - `value="Excellent"` - What gets saved
3. **Associated labels** - Emoji + text that users see

### **JavaScript Processing (Simplified):**
```javascript
function completeVibeCheck(event) {
  event.preventDefault();  // Stop page reload
  
  // Get all form values
  const sleepSchedule = document.querySelector('[name="sleepSchedule"]:checked').value;
  const currentState = document.querySelector('[name="currentState"]:checked').value;
  // ... more fields ...
  
  // Calculate wellness score (0-100)
  // Show recommendations based on score
  // Save to localStorage
}
```

---

# CHAT SECTION

## 10. CHAT WITH AI COMPANION (Lines 1651-1750)

```html
<section class="section-container hidden" id="chat">
  <div class="section-header">
    <h2>💬 Chat with Aura</h2>
    <p>AI-powered emotional support</p>
  </div>
  
  <div class="chat-container">
    <div id="chatMessages">
      <div class="message">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          Hello! I'm here to listen and support you. How are you feeling today?
        </div>
      </div>
    </div>
    
    <div class="chat-input-area">
      <input 
        type="text" 
        id="chatInput" 
        placeholder="Type your message..." 
        onkeypress="handleChatKeypress(event)"
      >
      <button onclick="sendMessage()" class="btn btn-primary">Send</button>
      <button onclick="clearChat()" class="btn btn-secondary">Clear</button>
    </div>
  </div>
</section>
```

### **Chat Flow:**

1. **Chat Container:**
   - `id="chatMessages"` - Where all messages appear
   - Starts with AI greeting

2. **Messages Format:**
   ```
   ┌──────────────────────────────┐
   │ 🤖 Message avatar           │
   │ "Hello! I'm here to listen..." │
   └──────────────────────────────┘
   
   ┌──────────────────────────────┐
   │ 👤 User message            │
   │ "I'm feeling stressed"       │
   └──────────────────────────────┘
   ```

3. **Input Area:**
   - Text field for user to type
   - Send button calls `sendMessage()`
   - Clear button resets chat

### **JavaScript Processing:**
```javascript
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  // Add user message to chat
  addMessage('user', message);
  input.value = '';
  
  // Send to backend AI for response
  const aiResponse = await generateAiResponse(message);
  
  // Add AI response to chat
  addMessage('ai', aiResponse);
  
  // Save to localStorage
  saveChatMessage(message, aiResponse);
}
```

---

# MOOD ANALYSIS SECTION (Facial Expression Reading)

## 11. MOOD ANALYSIS - Emotion Detection (Lines 1751-1900)

```html
<section class="section-container hidden" id="facial-analysis">
  <div class="section-header">
    <h2>🎥 Mood Analysis - Real-time Emotion Detection</h2>
    <p>We use AI to analyze your facial expressions</p>
  </div>
  
  <div class="analysis-container">
    <!-- Video Feed -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      <div>
        <video 
          id="video" 
          width="100%" 
          height="400" 
          style="border-radius: 20px; background: #000;"
        ></video>
        
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button class="btn btn-primary" onclick="startCamera()">
            📹 Start Analysis
          </button>
          <button class="btn btn-secondary" onclick="stopCamera()">
            ⏹️ Stop
          </button>
        </div>
      </div>
      
      <!-- Emotions Display -->
      <div id="emotionBars">
        <!-- Happy: 85% -->
        <!-- Sad: 20% -->
        <!-- Stressed: 15% -->
        <!-- ... etc -->
      </div>
    </div>
  </div>
</section>
```

### **How It Works:**

1. **Video Element:**
   - `<video id="video">` - Camera feed display
   - TensorFlow.js + Face-API loads
   - Analyzes face every frame

2. **Emotion Detection Process:**
   ```
   📷 Camera captures frame
      ↓
   🧠 TensorFlow analyzes facial features
      ↓
   😊 Detects emotions: Happy, Sad, Angry, etc.
      ↓
   📊 Shows as percentage bars
      ↓
   💾 Saves to localStorage
   ```

3. **Emotion Percentages:**
   - Happy: 0-100%
   - Sad: 0-100%
   - Angry: 0-100%
   - Fearful: 0-100%
   - Disgusted: 0-100%
   - Neutral: 0-100%
   - Surprised: 0-100%

---

# MEDITATION SECTION

## 12. MEDITATION & EXERCISES (Lines 1901-2100)

```html
<section class="section-container hidden" id="meditation">
  <div class="section-header">
    <h2>🧘 Guided Meditation & Exercises</h2>
    <p>Start a meditation session to relax and learn exercises</p>
  </div>
  
  <!-- Timer Section -->
  <div style="text-align: center; margin: 2rem 0;">
    <div style="margin-bottom: 1rem; font-weight: 700;">Choose Duration:</div>
    
    <div style="display: flex; gap: 0.5rem; justify-content: center;">
      <button class="btn btn-secondary" data-minutes="5" onclick="selectMeditationPreset(this)">
        5 min
      </button>
      <button class="btn btn-secondary" data-minutes="10" onclick="selectMeditationPreset(this)">
        10 min
      </button>
      <button class="btn btn-secondary" data-minutes="15" onclick="selectMeditationPreset(this)">
        15 min
      </button>
      <button class="btn btn-secondary" data-minutes="30" onclick="selectMeditationPreset(this)">
        30 min
      </button>
    </div>
    
    <button class="btn btn-primary" id="startMeditation" onclick="startMeditation()">
      ▶️ Start Meditation
    </button>
    <button class="btn btn-secondary" id="stopMeditation" style="display: none;" onclick="stopMeditation()">
      ⏹️ Stop
    </button>
    
    <p id="timerDisplay" style="font-size: 2.5rem; margin-top: 1rem;">00:00</p>
  </div>
  
  <!-- Meditation Video -->
  <div style="max-width: 900px; margin: 2rem auto;">
    <h3 style="text-align: center; margin-bottom: 1rem;">
      📺 STEP-BY-STEP MEDITATION TUTORIAL
    </h3>
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
      <iframe 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
        src="https://www.youtube.com/embed/3rTdYCWrm8c"
        title="Beginner Meditation Guide"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </div>
  
  <!-- Exercise Guide -->
  <div style="max-width: 900px; margin: 3rem auto;">
    <h3 style="text-align: center; margin-bottom: 2rem;">
      💪 DETAILED EXERCISE INSTRUCTIONS
    </h3>
    
    <!-- Exercise 1: Deep Breathing -->
    <div style="background: white; padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h4 style="color: #4CAF50; margin-bottom: 1rem;">
            🫁 DEEP BREATHING (4-4-4 TECHNIQUE)
          </h4>
          <p><strong>Difficulty:</strong> ⭐ Beginner | <strong>Duration:</strong> 3-5 minutes</p>
          
          <h5 style="color: var(--primary); margin-bottom: 0.5rem;">STEP-BY-STEP:</h5>
          <ol style="padding-left: 1.5rem;">
            <li><strong>Sit comfortably</strong> - Keep back straight</li>
            <li><strong>Inhale through nose</strong> - Count to 4 slowly</li>
            <li><strong>Hold breath</strong> - Count to 4</li>
            <li><strong>Exhale through mouth</strong> - Count to 4 slowly</li>
            <li><strong>Repeat</strong> - 5-10 times</li>
          </ol>
          <p style="color: #4CAF50; margin-top: 1rem;">
            ✅ Benefits: Reduces stress, increases oxygen
          </p>
        </div>
        
        <img src="https://images.unsplash.com/..." alt="Deep Breathing" style="border-radius: 15px;">
      </div>
    </div>
    
    <!-- Similar cards for Child's Pose, Stretching, Walking, Body Scan, Hydration -->
  </div>
  
  <!-- Background Audio -->
  <audio id="meditationAudio" loop volume="0.25">
    <source src="https://cdn.pixabay.com/..." type="audio/mpeg">
  </audio>
</section>
```

### **Meditation Features Breakdown:**

#### **Timer System:**
| Component | What It Does |
|---|---|
| Duration buttons (5/10/15/30) | User selects how long to meditate |
| `data-minutes` attribute | Stores selected duration |
| `timerDisplay` | Shows countdown (MM:SS format) |
| Start/Stop buttons | Controls meditation session |

#### **Video Embedding:**
```html
<iframe src="https://www.youtube.com/embed/3rTdYCWrm8c">
```
- Embeds YouTube video directly on page
- `padding-bottom: 56.25%` - Maintains 16:9 aspect ratio
- Responsive - scales on mobile

#### **Exercise Cards:**
Each exercise has:
- **Name & emoji** - Easy identification
- **Difficulty** - ⭐ rating
- **Duration** - Time needed
- **Step-by-step instructions** - Numbered list
- **Image** - Visual demonstration
- **Benefits** - Why do it

#### **Background Audio:**
```html
<audio id="meditationAudio" loop volume="0.25">
```
- Peaceful meditation music
- Volume set to 0.25 (25% - lower than video)
- `loop` - Repeats continuously

### **JavaScript Functions (Meditation):**

```javascript
function selectMeditationPreset(button) {
  const minutes = button.getAttribute('data-minutes');
  meditationTime = minutes * 60;  // Convert to seconds
  updateTimerDisplay();
}

function startMeditation() {
  // Play audio at 25% volume
  const audio = document.getElementById('meditationAudio');
  audio.volume = 0.25;
  audio.play();
  
  // Start countdown timer
  meditationInterval = setInterval(() => {
    meditationTime--;
    updateTimerDisplay();
    
    if (meditationTime <= 0) {
      stopMeditation();
      showToast('🎉 Meditation complete!', 'success');
    }
  }, 1000);  // Update every second
}

function updateTimerDisplay() {
  const mins = Math.floor(meditationTime / 60);
  const secs = meditationTime % 60;
  document.getElementById('timerDisplay').textContent = 
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
```

---

# THERAPISTS SECTION

## 13. FIND MENTAL HEALTH PROFESSIONALS (Lines 2101-2300)

```html
<section class="section-container" id="therapists">
  <!-- Emergency Section -->
  <div class="emergency-section">
    <h3>🆘 Need Immediate Help?</h3>
    <p>If you're in crisis, please reach out immediately</p>
    <button class="emergency-btn" onclick="callEmergency('suicide')">
      Suicide Helpline: 9152987821
    </button>
    <button class="emergency-btn" onclick="callEmergency('mental')">
      Mental Health: 08046110007
    </button>
  </div>
  
  <div class="section-header">
    <h2>Find Mental Health Professionals</h2>
    <p>Connect with licensed therapists in your area</p>
  </div>
  
  <div id="therapistLoading" class="spinner"></div>
  <div class="therapist-grid" id="therapistGrid"></div>
</section>
```

### **Emergency Section:**
- Always visible (not hidden)
- Shows crisis helpline numbers
- Calls functions: `callEmergency('suicide')` or `callEmergency('mental')`

### **Therapist Grid:**
- `id="therapistLoading"` - Loading spinner while fetching data
- `id="therapistGrid"` - Where therapist cards appear

### **Therapist Card Structure (Generated by JavaScript):**
```html
<div class="therapist-card">
  <div style="margin-bottom: 1rem;">
    <div style="background: #58cc02; color: white; padding: 0.3rem 0.8rem; 
                border-radius: 20px; display: inline-block;">
      ⭐ NEAREST
    </div>
    <div style="background: #1cb0f6; color: white; display: inline-block;">
      🎯 IN GEOFENCE
    </div>
  </div>
  
  <div class="therapist-header">
    <div class="therapist-avatar">👨‍⚕️</div>
    <div>
      <h3>Dr. Rajesh Kumar</h3>
      <p>Clinical Psychologist</p>
      <div>⭐ 4.8/5 • 45 reviews</div>
    </div>
  </div>
  
  <div style="margin: 1rem 0; padding: 1rem; background: #f7f7f7;">
    <p><strong>📍 123 Health Street, Mumbai</strong></p>
    <p>⏰ Mon-Fri: 9am-5pm, Sat: 10am-2pm</p>
    <p>📞 +91-9876543210</p>
    <p style="color: #58cc02;">📍 2.5 km away</p>
  </div>
  
  <div style="display: flex; gap: 0.5rem;">
    <button onclick="bookTherapist('Dr. Rajesh Kumar', '+91-9876543210')">
      📅 Book
    </button>
    <button onclick="callTherapist('Dr. Rajesh Kumar', '+91-9876543210')">
      📞 Call
    </button>
    <button onclick="showTherapistLocation('Dr. Rajesh Kumar', 19.0760, 72.8777)">
      🗺️ Map
    </button>
  </div>
</div>
```

### **Geofencing Feature:**
```javascript
function loadTherapists() {
  // Get user location
  navigator.geolocation.getCurrentPosition(position => {
    userLocation = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
    
    // Calculate distance to each therapist
    therapistDatabase.forEach(t => {
      t.distance = calculateDistance(
        userLocation.lat, userLocation.lon,
        t.lat, t.lon
      );
    });
    
    // Sort by distance (nearest first)
    therapistDatabase.sort((a, b) => a.distance - b.distance);
    
    // Render cards
    renderTherapistCards();
  });
}
```

---

# RESOURCES SECTION

## 14. MENTAL HEALTH RESOURCES (Lines 2301-2500)

```html
<section class="section-container hidden" id="resources">
  <div class="section-header">
    <h2>Wellness Resources</h2>
    <p>Educational content to support your mental health journey</p>
  </div>
  
  <div id="resourcesLoading" class="spinner"></div>
  <div id="resourceGrid"></div>
</section>
```

### **Resource Card Structure (Generated by JavaScript):**
```html
<div class="resource-card" onclick="showResourceDetails('Understanding Anxiety')">
  <div style="background: linear-gradient(135deg, #FF6B6B, #FF8E8E); padding: 2rem; 
              border-radius: 15px 15px 0 0; color: white;">
    <p style="font-size: 2.5rem;">📚</p>
    <p style="font-weight: 700; font-size: 0.95rem;">Understanding Anxiety</p>
  </div>
  
  <div style="padding: 1.5rem; background: white;">
    <p style="color: var(--text-medium); font-size: 0.9rem;">
      Learn about anxiety symptoms, triggers, and evidence-based coping strategies
    </p>
    <p style="margin-top: 0.75rem; color: var(--text-light); font-size: 0.85rem;">
      NIMH (National Institute of Mental Health)
    </p>
  </div>
</div>
```

### **Resource Categories:**
1. Understanding Anxiety
2. Understanding Depression
3. Stress Management
4. Sleep Better
5. Building Resilience
6. Self-Care Guide
7. Support Groups
8. Crisis & Suicide Prevention
9. General Mental Health Support

---

# PROFILE SECTION

## 15. USER PROFILE (Lines 2501-2700)

```html
<section class="section-container hidden" id="profile">
  <div class="section-header">
    <h2>👤 User Profile</h2>
    <p>View and manage your personal information</p>
  </div>
  
  <div class="profile-container">
    <div class="profile-card">
      <!-- View Mode -->
      <div class="profile-header">
        <div class="profile-avatar">👤</div>
        <h3 id="profileName">Loading...</h3>
      </div>
      
      <div class="profile-info" id="profileViewMode">
        <div class="info-group">
          <label>Full Name:</label>
          <p id="displayName">-</p>
        </div>
        <div class="info-group">
          <label>Email:</label>
          <p id="displayEmail">-</p>
        </div>
        <div class="info-group">
          <label>Age:</label>
          <p id="displayAge">-</p>
        </div>
        <div class="info-group">
          <label>Sex:</label>
          <p id="displaySex">-</p>
        </div>
        
        <button class="btn btn-primary" onclick="toggleEditProfile()" 
                style="width: 100%; margin-top: 1rem;">
          ✏️ Edit Profile
        </button>
      </div>
      
      <!-- Edit Mode (Hidden by default) -->
      <form id="profileEditMode" class="profile-form hidden" onsubmit="updateProfile(event)">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="editName" required placeholder="Enter your full name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="editEmail" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Age</label>
          <input type="number" id="editAge" min="13" max="120" placeholder="Your age">
        </div>
        <div class="form-group">
          <label>Sex</label>
          <select id="editSex">
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style="display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">
            💾 Save Changes
          </button>
          <button type="button" class="btn btn-secondary" style="flex: 1;" 
                  onclick="toggleEditProfile()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</section>
```

### **Profile Features:**

#### **View Mode:**
- Shows user's saved information
- Read-only display
- "Edit Profile" button to switch to edit mode

#### **Edit Mode:**
- Form with input fields
- Save or Cancel buttons
- Updates localStorage and sends to backend

### **Toggle Between View/Edit:**
```javascript
function toggleEditProfile() {
  const viewMode = document.getElementById('profileViewMode');
  const editMode = document.getElementById('profileEditMode');
  
  viewMode.classList.toggle('hidden');
  editMode.classList.toggle('hidden');
}
```

---

# LOGIN & SIGNUP MODALS

## 16. LOGIN MODAL (Lines 2701-2800)

```html
<div class="modal" id="loginModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>🌟 Welcome Back to Aura!</h2>
      <button class="close-btn" onclick="closeModal('login')">×</button>
    </div>
    
    <form onsubmit="handleLogin(event)">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="loginEmail" required placeholder="your@email.com">
      </div>
      
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="loginPassword" required placeholder="••••••••">
      </div>
      
      <button type="submit" class="btn btn-primary" style="width: 100%;">
        ✨ Sign In & Spark Your Journey
      </button>
      
      <div style="margin: 1.5rem 0; display: flex; align-items: center; gap: 1rem;">
        <div style="flex: 1; height: 2px; background: var(--bg-light);"></div>
        <span style="color: var(--text-light);">Or</span>
        <div style="flex: 1; height: 2px; background: var(--bg-light);"></div>
      </div>
      
      <button type="button" class="btn btn-secondary" style="width: 100%;" 
              onclick="loginWithGoogle()">
        🔗 Login with Google
      </button>
      
      <p style="text-align: center; margin-top: 1rem; color: var(--text-medium);">
        Don't have an account? 
        <button type="button" onclick="switchToRegister()" style="background: none; border: none; 
                color: var(--primary); font-weight: 800; cursor: pointer;">
          Sign Up
        </button>
      </p>
    </form>
  </div>
</div>
```

### **Login Process:**
```javascript
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success && result.userId) {
      currentUserId = result.userId;
      localStorage.setItem('authToken', result.token);
      
      closeModal('login');
      isLoggedIn = true;
      
      // Show dashboard nav instead of main nav
      document.getElementById('mainNav').classList.add('hidden');
      document.getElementById('dashboardNav').classList.remove('hidden');
      
      // Start geofencing
      startGeofencing();
      
      showSection('dashboard');
      showToast('Welcome back!', 'success');
    } else {
      showToast(result.message || 'Login failed', 'danger');
    }
  } catch (err) {
    showToast('Login error – check backend', 'danger');
  }
}
```

---

# JAVASCRIPT CORE FUNCTIONS

## 17. KEY JAVASCRIPT FUNCTIONS (Lines 2900-3876)

### **A. Navigation & Section Control**

```javascript
// Show/hide different sections
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section-container');
  sections.forEach(sec => sec.classList.add('hidden'));
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    currentSection = sectionId;
  }
}

// Example: showSection('dashboard') hides all, shows dashboard
```

### **B. Modal Management**

```javascript
function showModal(modalId) {
  const modal = document.getElementById(`${modalId}Modal`);
  modal.classList.add('active');  // Shows modal
}

function closeModal(modalId) {
  const modal = document.getElementById(`${modalId}Modal`);
  modal.classList.remove('active');  // Hides modal
}

// Example usage:
// showModal('login') → displays login modal
// closeModal('login') → hides login modal
```

### **C. Authentication**

```javascript
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      isLoggedIn = true;
      currentUserId = result.userId;
      localStorage.setItem('authToken', result.token);
      
      // Update nav
      document.getElementById('mainNav').classList.add('hidden');
      document.getElementById('dashboardNav').classList.remove('hidden');
      
      showSection('dashboard');
      showToast('Login successful!', 'success');
    }
  } catch (err) {
    showToast('Login failed', 'danger');
  }
}

function logout() {
  isLoggedIn = false;
  currentUserId = null;
  localStorage.removeItem('authToken');
  
  document.getElementById('dashboardNav').classList.add('hidden');
  document.getElementById('mainNav').classList.remove('hidden');
  
  showSection('home');
  showToast('You have been logged out', 'info');
}
```

### **D. Toast Notifications**

```javascript
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;  // info, success, danger, warning
  toast.textContent = message;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Show animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.remove();
  }, 3000);
}

// Usage:
// showToast('Login successful!', 'success')
// showToast('Error occurred', 'danger')
// showToast('Please wait...', 'info')
// showToast('Warning message', 'warning')
```

### **E. Meditation Timer Functions**

```javascript
let meditationTime = 0;
let meditationInterval = null;

function selectMeditationPreset(button) {
  const minutes = parseInt(button.getAttribute('data-minutes'));
  meditationTime = minutes * 60;  // Convert to seconds
  
  // Remove active class from all buttons
  document.querySelectorAll('[data-minutes]').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  button.classList.add('active');
  
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(meditationTime / 60);
  const secs = meditationTime % 60;
  
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  document.getElementById('timerDisplay').textContent = display;
}

function startMeditation() {
  if (meditationTime <= 0) {
    showToast('Please select a duration first!', 'warning');
    return;
  }
  
  // Hide start button, show stop button
  document.getElementById('startMeditation').style.display = 'none';
  document.getElementById('stopMeditation').style.display = 'block';
  
  // Play background audio at 25% volume
  const audio = document.getElementById('meditationAudio');
  audio.volume = 0.25;
  audio.play();
  
  // Start countdown
  meditationInterval = setInterval(() => {
    meditationTime--;
    updateTimerDisplay();
    
    if (meditationTime <= 0) {
      stopMeditation();
      showToast('🎉 Meditation complete!', 'success');
    }
  }, 1000);  // Update every second
  
  showToast('🧘 Meditation started...', 'success');
}

function stopMeditation() {
  // Stop timer
  if (meditationInterval) {
    clearInterval(meditationInterval);
  }
  
  // Stop audio
  const audio = document.getElementById('meditationAudio');
  audio.pause();
  audio.currentTime = 0;
  
  // Update buttons
  document.getElementById('startMeditation').style.display = 'block';
  document.getElementById('stopMeditation').style.display = 'none';
  
  // Save meditation session
  const minutesMeditated = Math.floor(meditationTime / 60);
  const totalMinutes = parseInt(localStorage.getItem('meditationMinutes') || '0') + minutesMeditated;
  localStorage.setItem('meditationMinutes', totalMinutes);
  
  showToast('✅ Meditation saved!', 'success');
}
```

### **F. Language System**

```javascript
const translations = {
  en: {
    "dashboard": "Dashboard",
    "meditation": "Meditation",
    "meditation-title": "🧘 Guided Meditation & Exercises",
    // ... more keys
  },
  es: {
    "dashboard": "Panel",
    "meditation": "Meditación",
    "meditation-title": "🧘 Meditación Guiada y Ejercicios",
    // ... more translations
  },
  fr: { /* French translations */ },
  hi: { /* Hindi translations */ }
};

let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);  // Save choice
  updateLanguageUI(lang);
  
  const langNames = { en: 'English', es: 'Español', fr: 'Français', hi: 'हिंदी' };
  showToast(`✅ Language changed to ${langNames[lang]}!`, 'success');
}

function updateLanguageUI(lang) {
  const t = translations[lang] || translations['en'];
  
  // Update all translatable elements
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const key = link.textContent.toLowerCase().trim();
    if (t[key]) {
      link.textContent = t[key];
    }
  });
  
  // Update meditation section
  const meditationTitle = document.querySelector('#meditation h2');
  if (meditationTitle) {
    meditationTitle.textContent = t['meditation-title'] || meditationTitle.textContent;
  }
}
```

### **G. Geofencing (Therapist Location)**

```javascript
const geofenceRadius = 5;  // 5km
let userLocation = null;

function startGeofencing() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      checkGeofences,
      geoError,
      { enableHighAccuracy: true, timeout: 10000 }
    );
    showToast('🎯 Geofencing activated!', 'success');
  }
}

function checkGeofences(position) {
  userLocation = {
    lat: position.coords.latitude,
    lon: position.coords.longitude
  };
  
  therapistDatabase.forEach(therapist => {
    const distance = calculateDistance(
      userLocation.lat, userLocation.lon,
      therapist.lat, therapist.lon
    );
    
    // If therapist is within 5km
    if (distance <= geofenceRadius) {
      notifyTherapistNearby(therapist.name);
    }
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;  // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(v) {
  return v * Math.PI / 180;
}
```

---

# DATA STORAGE

## 18. LocalStorage Usage

The app saves data locally in the browser:

```javascript
// Save meditation minutes
localStorage.setItem('meditationMinutes', 120);

// Load meditation minutes
const minutes = localStorage.getItem('meditationMinutes');

// Remove data
localStorage.removeItem('meditationMinutes');

// Clear all data
localStorage.clear();
```

### **Data Stored:**
| Data | Key | Example |
|---|---|---|
| Authentication token | `authToken` | `"eyJhbGc..."` |
| Current user ID | `currentUserId` | `"60d5ec7c..."` |
| Selected language | `selectedLanguage` | `"en"` |
| Meditation minutes | `meditationMinutes` | `"245"` |
| Mood history | `moodHistory` | `[{...}]` |
| Chat history | `chatHistory` | `[{...}]` |
| Daily streak | `dayStreak` | `"7"` |

---

## SUMMARY

This mental health app has:

✅ **8 Main Sections:**
- Dashboard (stats)
- Vibe Check (mood survey)
- Chat (AI companion)
- Mood Analysis (facial emotion detection)
- Meditation (timer + exercises)
- Therapists (location-based finding)
- Resources (educational content)
- Profile (user info management)

✅ **Key Features:**
- User authentication (login/signup)
- Real-time emotion detection via webcam
- Meditation timer with background music
- 4 language support (English, Spanish, French, Hindi)
- Geofencing to find nearby therapists
- Crisis hotlines always visible
- Data persistence using localStorage
- Responsive design for all devices

✅ **Technologies Used:**
- HTML5 (structure)
- CSS3 (styling & animations)
- JavaScript ES6+ (interactivity)
- TensorFlow.js (AI)
- Face-API (emotion detection)
- Fetch API (backend communication)

---

**For any specific section clarification, let me know!** 🚀
