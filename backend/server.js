/**
 * AgroGreenBits - Main Server Entry Point
 * Node.js + Express REST API
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
 
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');
const buyerRoutes = require('./routes/buyer');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const profileRoutes = require('./routes/profile');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// ── Middleware ─────────────────────────────────────────────────────────────────
// Configure CORS. In production allow only the deployed frontend origin
// (FRONTEND_URL). In development allow localhost origins for testing.
const isProd = process.env.NODE_ENV === 'production';
const frontendOrigin = process.env.FRONTEND_URL || '';

const devLocalOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5500', // VS Code Live Server
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);
      if (isProd) {
        if (frontendOrigin && origin === frontendOrigin) return callback(null, true);
        return callback(new Error('CORS policy: origin not allowed'), false);
      }
      // development: permit localhost dev origins and any configured FRONTEND_URL
      if (frontendOrigin && origin === frontendOrigin) return callback(null, true);
      if (devLocalOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('CORS policy: origin not allowed'), false);
    },
    // Enable credentials only if a FRONTEND_URL is set (cookie-based auth).
    credentials: !!frontendOrigin,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Request logger in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}
 
// ── Database Connection and server start ───────────────────────────────────────
async function startServer() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('⚠️ MongoDB connection failed:', err.message || err);
    if (isProd) {
      console.error('Exiting: MongoDB is required in production.');
      process.exit(1);
    }
    console.warn('Continuing in mock mode (development) without DB');
  }

  const server = app.listen(PORT, () => {
    console.log(`🌿 AgroGreenBits API running on http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    server.close(() => {
      const mongoose = require('mongoose');
      mongoose.connection.close(false, () => {
        console.log('Mongo connection closed. Exiting.');
        process.exit(0);
      });
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
}

startServer();
 
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
 
// (server is started inside startServer after DB connection)
 