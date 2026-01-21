const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'No authentication token, access denied' 
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ 
        message: 'Token has been revoked' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with password field to check password changes
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is not valid, user not found' 
      });
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ 
        message: 'Password recently changed, please log in again' 
      });
    }

    // Add user to request (without password)
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
      twoFactorEnabled: user.twoFactorEnabled
    };

    // Store token for potential blacklisting
    req.token = token;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired, please log in again',
        expired: true
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: error.message 
      });
    }
    
    res.status(401).json({ 
      message: 'Token is not valid',
      error: error.message 
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          universityId: user.universityId
        };
      }
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

// Check if user is faculty or admin
const isFacultyOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Faculty or admin role required.' 
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin role required.' 
    });
  }
};

// Logout - blacklist token
const logout = (req, res) => {
  if (req.token) {
    tokenBlacklist.add(req.token);
    
    // Clean old tokens periodically (simple implementation)
    // In production, use Redis with TTL
    if (tokenBlacklist.size > 10000) {
      tokenBlacklist.clear();
    }
  }
  
  res.json({ message: 'Logged out successfully' });
};

// Generate access token (short-lived)
const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // 15 minutes
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' } // 7 days
  );
};

module.exports = auth;
module.exports.optionalAuth = optionalAuth;
module.exports.isFacultyOrAdmin = isFacultyOrAdmin;
module.exports.isAdmin = isAdmin;
module.exports.logout = logout;
module.exports.generateAccessToken = generateAccessToken;
module.exports.generateRefreshToken = generateRefreshToken;
module.exports.tokenBlacklist = tokenBlacklist;
