const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KLH Peer Learning Backend is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
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