const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'No authentication token, access denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is not valid, user not found' 
      });
    }

    // Add user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      universityId: user.universityId
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
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

module.exports = auth;
module.exports.optionalAuth = optionalAuth;
module.exports.isFacultyOrAdmin = isFacultyOrAdmin;
module.exports.isAdmin = isAdmin;
