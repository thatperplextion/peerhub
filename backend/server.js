const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
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
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Not connected to MongoDB'
  });
});

// Database connection with better error handling
console.log('🔗 Attempting to connect to MongoDB...');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
})
.catch((error) => {
  console.error('❌ FAILED: MongoDB connection error:');
  console.error('   Error message:', error.message);
  console.log('💡 Check your MONGODB_URI in .env file');
});

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('🗄️  MongoDB event: Connected');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB event: Error -', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB event: Disconnected');
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