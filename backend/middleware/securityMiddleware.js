const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for login attempts (relaxed)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes (relaxed)
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful logins
});

// Rate limiting for registration (relaxed)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per hour per IP (relaxed)
  message: 'Too many accounts created from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many requests for this operation, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Sanitize user input to prevent NoSQL injection
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove any MongoDB operators from input
        req.body[key] = req.body[key].replace(/\$/g, '');
      }
    });
  }
  next();
};

// Check for suspicious patterns
const detectSuspiciousActivity = (req, res, next) => {
  const suspiciousPatterns = [
    /(\$where|\$ne|\$gt|\$lt|\$gte|\$lte)/i,
    /(javascript:|data:text\/html)/i,
    /(<script|<iframe|<object)/i
  ];
  
  const checkValue = (value) => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };
  
  if (req.body && checkValue(req.body)) {
    return res.status(400).json({ 
      message: 'Suspicious input detected' 
    });
  }
  
  next();
};

// Validate token format
const validateTokenFormat = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (authHeader) {
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        message: 'Invalid authorization header format. Use: Bearer <token>' 
      });
    }
    
    // Basic JWT format check
    const token = parts[1];
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    
    if (!jwtRegex.test(token)) {
      return res.status(401).json({ 
        message: 'Invalid token format' 
      });
    }
  }
  
  next();
};

module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  strictLimiter,
  securityHeaders,
  sanitizeInput,
  detectSuspiciousActivity,
  validateTokenFormat
};
