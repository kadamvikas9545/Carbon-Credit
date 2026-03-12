// server.js - Fully Working Aura3.0 Backend (Updated December 2025)
// Updated with your provided Gemini API Key: AIzaSyCNZNdMPjFLpOoOqWOJvGppgvta_vdwlGc
// Uses the latest stable & efficient model: gemini-1.5-flash (still the best free-tier option in late 2025)
// Added safetySettings for better reliability
// Improved error handling & logging

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aura3")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// === MODELS ===
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  sex: { type: String, enum: ['Male', 'Female', 'Other'] },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mood: { type: String, required: true },
  note: String,
  createdAt: { type: Date, default: Date.now }
});
const Mood = mongoose.model('Mood', MoodSchema);

const TherapistSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  rating: Number,
  experience: Number,
  bio: String,
  distance: String
});
const Therapist = mongoose.model('Therapist', TherapistSchema);

const ResourceSchema = new mongoose.Schema({
  category: String,
  title: String,
  description: String,
  buttonText: String,
  url: String,
  type: String,
  source: String
});
const Resource = mongoose.model('Resource', ResourceSchema);

const ChatResourceSchema = new mongoose.Schema({
  category: String,
  title: String,
  description: String,
  buttonText: String,
  url: String,
  type: String,
  details: String,
  source: String
});
const ChatResource = mongoose.model('ChatResource', ChatResourceSchema);

// === REVIEWS MODEL ===
const ReviewSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: { type: Number, required: true },
  comment: String,
  anonymous: { type: Boolean, default: false },
  userEmail: String,
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', ReviewSchema);

// === AUTH MIDDLEWARE ===
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// === GOOGLE GEMINI AI HELPER FUNCTION ===
// Updated with your API key and stable gemini-1.5-flash model (best free-tier performance in Dec 2025)
async function getGeminiResponse(userMessage) {
  const GEMINI_API_KEY = "AIzaSyALta_orMjCyBeUQvlFzAC_e-r48zdvnV4"; // Your provided key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Aura, a compassionate and empathetic mental health AI companion.
Guidelines:
- Be warm, supportive, and non-judgmental
- Validate feelings and show empathy
- Offer coping strategies when appropriate
- Encourage professional help for serious concerns
- Keep responses concise (2-4 sentences)
- Use encouraging emojis occasionally 🌸💚
- Never diagnose or replace professional therapy
- You must ONLY discuss topics related to emotions, stress, anxiety, depression, mood, coping strategies, self-care, relationships (emotional aspects), mindfulness, and personal feelings.
- If the user asks about anything unrelated (e.g., math, homework, programming, politics, general knowledge, physical health, recipes, weather, news, or trivia), you MUST respond:
  "I'm here to support you with mental health and emotional topics only 🌸. How are you feeling today, or is there something on your mind you'd like to share?"
- Never answer off-topic questions, even if you know the answer.
- Never provide information outside mental health and emotional support.
Pros:
User message: ${userMessage}

Respond as Aura with compassion and support:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Response:", errorData);
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data = await response.json();

    // Try multiple common response shapes from the Generative Language API
    let replyText = null;
    try {
      replyText = data?.candidates?.[0]?.content?.[0]?.text ||
                  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                  data?.candidates?.[0]?.output?.text ||
                  data?.output?.[0]?.content?.[0]?.text ||
                  data?.candidates?.[0]?.message?.content?.parts?.[0] ||
                  data?.result?.output || null;
    } catch (e) {
      replyText = null;
    }

    if (!replyText && typeof data === 'string') replyText = data;

    if (!replyText) {
      console.error('Unexpected Gemini response format:', JSON.stringify(data).slice(0, 1000));
      throw new Error('Unexpected response format');
    }

    replyText = String(replyText).trim();

    // If the model simply echoed the prompt or the user's message, return a fallback
    const normalizedUser = String(userMessage).trim();
    if (!replyText || replyText === normalizedUser) {
      console.warn('Gemini echoed the user message; using fallback');
      return getFallbackResponse(userMessage);
    }

    // Remove accidental repeated lines (model sometimes repeats the same sentence)
    const lines = replyText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length > 1 && lines.every(l => l === lines[0])) {
      replyText = lines[0];
    }

    // If reply still contains large portion of the original prompt, fallback
    if (replyText.includes('User message:') || replyText.toLowerCase().includes('you are aura')) {
      console.warn('Gemini returned prompt text; using fallback');
      return getFallbackResponse(userMessage);
    }

    // Short safety: if reply is trivially short or identical repeating phrase, fallback
    if (replyText.length < 3) return getFallbackResponse(userMessage);

    return replyText;
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return getFallbackResponse(userMessage);
  }
}

// Fallback responses (improved)
function getFallbackResponse(userMessage) {
  const lowerCase = userMessage.toLowerCase();
  if (lowerCase.includes('suicide') || lowerCase.includes('kill myself') || lowerCase.includes('end it')) {
    return "I'm really worried about you. Please reach out to a crisis helpline immediately. In India: 9152987821 (Suicide) or 08046110007 (Mental Health). You're not alone. 🌸";
  }
  if (lowerCase.includes('feel') || lowerCase.includes('how are you')) {
    return "I'm here for you. How can I support you today? 🌸";
  } else if (lowerCase.includes('anxiety') || lowerCase.includes('stress') || lowerCase.includes('panic')) {
    return "I hear that you're feeling stressed or anxious. Try taking a few slow deep breaths with me: inhale for 4, hold for 4, exhale for 6. You’ve got this. 💚";
  } else if (lowerCase.includes('sad') || lowerCase.includes('depressed') || lowerCase.includes('hopeless')) {
    return "I'm so sorry you're feeling this way. Your feelings are completely valid. Would you like to share more, or shall we try a small grounding exercise together? 🌸";
  } else if (lowerCase.includes('thank')) {
    return "You're very welcome! I'm always here whenever you need me. 💚";
  } else {
    return "I'm listening carefully. Can you tell me a bit more about what's on your mind? 🌸";
  }
}

// === ROUTES === (unchanged, fully functional)

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ user: { id: user.id } },
      process.env.JWT_SECRET || 'supersecret123', { expiresIn: '7d' });
    res.json({ success: true, token, userId: user.id, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '7d' });
    res.json({ success: true, token, userId: user.id, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Google Login (OAuth Alternative)
app.post('/api/google-login', async (req, res) => {
  const { email, name = 'Google User', provider = 'google' } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Find existing user by email
    let user = await User.findOne({ email });

    // If user doesn't exist, create new user with Google OAuth
    if (!user) {
      // Generate a random password for Google auth users
      const randomPassword = Math.random().toString(36).slice(-10);
      user = new User({
        name,
        email,
        password: randomPassword
      });
      await user.save();
      console.log(`✅ New user created via Google OAuth: ${email}`);
    } else {
      console.log(`✅ Existing user logged in via Google OAuth: ${email}`);
    }

    // Generate JWT token
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      userId: user.id,
      provider,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ success: false, message: 'Google login failed' });
  }
});

// Get User Profile
app.get('/api/auth/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
app.post('/api/profile/update', authMiddleware, async (req, res) => {
  const { name, age, sex, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (age) user.age = parseInt(age);
    if (sex) user.sex = sex;

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        sex: user.sex
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Chat with Gemini API
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ msg: 'Message is required' });
  }

  try {
    const reply = await getGeminiResponse(message);
    res.json({ reply, from: 'Aura' });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ msg: 'Error generating response', reply: getFallbackResponse(message) });
  }
});

// Save Mood
app.post('/api/moods', authMiddleware, async (req, res) => {
  try {
    const mood = new Mood({
      user: req.user.id,
      mood: req.body.mood,
      note: req.body.note || ''
    });
    await mood.save();
    res.json({ success: true, mood });
  } catch (err) {
    res.status(500).json({ msg: 'Error saving mood' });
  }
});

// Get Moods
app.get('/api/moods', authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
});

// Get Mood Stats
app.get('/api/moods/stats', authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id });
    const stats = {
      total: moods.length,
      thisWeek: moods.filter(m => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return m.createdAt >= weekAgo;
      }).length,
      moodDistribution: {}
    };

    moods.forEach(m => {
      stats.moodDistribution[m.mood] = (stats.moodDistribution[m.mood] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
});

// Get Therapists
app.get('/api/therapists', async (req, res) => {
  try {
    let therapists = await Therapist.find();
    if (therapists.length === 0) {
      const defaults = [
        { name: "Dr. Priya Sharma", specialization: "Anxiety & Depression", rating: 4.9, experience: 15, bio: "CBT Expert specializing in anxiety and trauma recovery", distance: "Nearby" },
        { name: "Dr. Rajesh Patel", specialization: "Psychiatry", rating: 4.8, experience: 12, bio: "Board-certified psychiatrist focusing on mood disorders", distance: "Nearby" },
        { name: "Dr. Anjali Deshmukh", specialization: "Family Therapy", rating: 4.7, experience: 10, bio: "Licensed family therapist specializing in couples counseling", distance: "Nearby" }
      ];
      therapists = await Therapist.insertMany(defaults);
    }
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Resources
app.get('/api/resources', async (req, res) => {
  try {
    let resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching resources' });
  }
});

// Get Chat Resources
app.get('/api/chatresources', async (req, res) => {
  try {
    let chatResources = await ChatResource.find();
    res.json(chatResources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching chat resources' });
  }
});

// === DATA STORAGE ENDPOINTS ===

// Reviews endpoints - allow client to post and fetch reviews
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, email, rating, comment, anonymous, userEmail } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: 'Rating is required' });

    const review = new Review({ name, email, rating, comment, anonymous, userEmail });
    await review.save();

    res.json({ success: true, review });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ success: false, message: 'Error saving review' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }

});

// Save various types of user data to MongoDB
app.post('/api/save-data', authMiddleware, async (req, res) => {
  const { collection, data } = req.body;
  const userId = req.user.id;

  if (!collection || !data) {
    return res.status(400).json({ success: false, message: 'Collection and data are required' });
  }
  
  try {
    const DataSchema = new mongoose.Schema({
      userId: String,
      data: mongoose.Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now }
    });
    
    const DataModel = mongoose.model(collection, DataSchema, collection);
    const record = new DataModel({
      userId,
      data,
      timestamp: new Date()
    });
    
    await record.save();
    res.json({ success: true, message: `Data saved to ${collection}`, record });
  } catch (err) {
    console.error(`Error saving to ${collection}:`, err);
    res.status(500).json({ success: false, message: `Failed to save to ${collection}` });
  }
});

// Get user's data from a specific collection
app.get('/api/data/:collection', authMiddleware, async (req, res) => {
  const { collection } = req.params;
  const userId = req.user.id;

  try {
    const DataSchema = new mongoose.Schema({
      userId: String,
      data: mongoose.Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now }
    });
    
    const DataModel = mongoose.model(collection, DataSchema, collection);
    const records = await DataModel.find({ userId }).sort({ timestamp: -1 });
    
    res.json({ success: true, data: records });
  } catch (err) {
    console.error(`Error fetching from ${collection}:`, err);
    res.status(500).json({ success: false, message: `Failed to fetch from ${collection}` });
  }
});

// Get user profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

// Update user profile
app.post('/api/profile/update', authMiddleware, async (req, res) => {
  const { name, email, age, sex } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, age, sex },
      { new: true }
    ).select('-password');

    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

// Verify auth token
app.get('/api/auth/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error verifying user' });
  }
});

// === SOCKET.IO REAL-TIME CHAT ===
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    const { message } = data;

    try {
      const reply = await getGeminiResponse(message);
      socket.emit('receiveMessage', { message: reply, from: 'Aura' });
    } catch (err) {
      console.error('Socket chat error:', err);
      const fallback = getFallbackResponse(message);
      socket.emit('receiveMessage', { message: fallback, from: 'Aura' });
    }
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Aura3.0 Backend is running',
    geminiModel: 'gemini-1.5-flash',
    date: new Date().toISOString()
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Aura3.0 Backend running on http://localhost:${PORT}`);
  console.log(`💬 Gemini Chat powered by gemini-1.5-flash (fast & reliable)`);
  console.log(`🔑 Using provided API Key: AIzaSyCNZNdMPjFLpOoOqWOJvGppgvta_vdwlGc`);
  console.log(`📡 Key Endpoints: /api/chat, /api/auth/login, /api/resources, /api/health`);
});