const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Don't include password by default
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  department: String,
  year: String,
  avatar: String,
  bio: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Security enhancements
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Account security
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Two-Factor Authentication
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  // Refresh token for JWT
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    deviceInfo: String
  }],
  
  // Security logs
  lastLogin: Date,
  lastLoginIp: String,
  securityEvents: [{
    type: { type: String },
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
  }],
  
  uploadedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  createdPlaylists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  savedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Hash password with bcrypt (cost factor 12)
  this.password = await bcrypt.hash(this.password, 12);
  
  // Update passwordChangedAt if password was modified (not on new user)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second for token timing
  }
  
  next();
});

// Password comparison
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Password reset token generation
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Handle login attempts and account lockout
userSchema.methods.incLoginAttempts = async function() {
  // If lock expired, restart login attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Add security event
userSchema.methods.addSecurityEvent = async function(type, ip, userAgent) {
  this.securityEvents.push({ type, ip, userAgent });
  
  // Keep only last 50 events
  if (this.securityEvents.length > 50) {
    this.securityEvents = this.securityEvents.slice(-50);
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);