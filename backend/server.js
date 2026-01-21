const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const { 
  apiLimiter, 
  securityHeaders, 
  sanitizeInput, 
  detectSuspiciousActivity,
  validateTokenFormat 
} = require('./middleware/securityMiddleware');

const app = express();

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/videos'),
  path.join(__dirname, 'uploads/thumbnails'),
  path.join(__dirname, 'uploads/transcripts')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Security Middleware (Applied FIRST)
app.use(securityHeaders);
app.use(apiLimiter);
app.use(sanitizeInput);
app.use(detectSuspiciousActivity);
app.use(validateTokenFormat);

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/comments');
const qaRoutes = require('./routes/qa');
const chatbotRoutes = require('./routes/chatbot');

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎓 KLH PeerHub Backend API',
    status: 'running',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
    frontend: 'http://localhost:3000',
    endpoints: {
      auth: '/api/auth (register, login)',
      videos: '/api/videos',
      comments: '/api/comments',
      qa: '/api/qa',
      chatbot: '/api/chatbot',
      health: '/api/health'
    },
    note: '👉 Visit http://localhost:3000 to access the frontend'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KLH Peer Learning Backend is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    security: {
      rateLimiting: 'Enabled',
      helmet: 'Enabled',
      cors: 'Configured',
      inputSanitization: 'Enabled',
      jwtAuth: 'Enabled'
    }
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Not connected to MongoDB'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection with better error handling
console.log('🔗 Attempting to connect to MongoDB...');

// Use the new connectDB function
connectDB().then(() => {
  console.log('✅ Database connection established successfully');
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error.message);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎓 KLH Peer Learning Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test API: http://localhost:${PORT}/api/test`);
  console.log(`🌐 MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected 🟢' : 'Disconnected 🔴'}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed.');
  process.exit(0);
});