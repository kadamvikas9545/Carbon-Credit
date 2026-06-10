/**
 * AgroGreenBits - Main Server Entry Point
 * Node.js + Express REST API
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
 
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');
const buyerRoutes = require('./routes/buyer');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const profileRoutes = require('./routes/profile');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5500',      // VS Code Live Server
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Request logger in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}
 
// ── Database Connection ────────────────────────────────────────────────────────
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.warn('⚠️ MongoDB connection failed:', err.message);
      console.warn('⚠️ Running API in mock mode without database');
    });
} else {
  console.warn('⚠️ MONGO_URI not set in .env - Running API in mock mode');
}
 
// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', aiRoutes);
 
// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});
 
// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});
 
app.listen(PORT, () => {
  console.log(`🌿 AgroGreenBits API running on http://localhost:${PORT}`);
});
 