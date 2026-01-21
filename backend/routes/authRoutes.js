const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const auth = require('../middleware/authMiddleware');
const { 
  loginLimiter, 
  registerLimiter, 
  strictLimiter,
  sanitizeInput,
  detectSuspiciousActivity 
} = require('../middleware/securityMiddleware');
const router = express.Router();

// Enhanced validation middleware with stronger rules
const registerValidation = [
  body('universityId').trim().notEmpty().withMessage('University ID is required')
    .isLength({ min: 5, max: 20 }).withMessage('University ID must be 5-20 characters'),
  body('email').isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .custom(value => {
      if (!value.endsWith('@klh.edu.in')) {
        throw new Error('Only KLH University emails are allowed');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('role').isIn(['student', 'faculty']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Register new user
router.post('/register', registerLimiter, sanitizeInput, detectSuspiciousActivity, registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { universityId, email, password, name, role, department, year } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { universityId }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or university ID already exists' 
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      universityId,
      email: email.toLowerCase(),
      password, // Will be hashed by model pre-save hook
      name,
      role,
      department,
      year,
      isVerified: true // Auto-verify for KLH users
    });

    await user.save();

    // Generate tokens
    const accessToken = auth.generateAccessToken(user._id, user.email, user.role);
    const refreshToken = auth.generateRefreshToken(user._id, user.email, user.role);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo: req.headers['user-agent']
    });
    await user.save();

    // Log security event
    await user.addSecurityEvent('registration', req.ip, req.headers['user-agent']);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        universityId: user.universityId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        year: user.year
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', loginLimiter, sanitizeInput, detectSuspiciousActivity, loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.correctPassword(password, user.password);
    
    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      // Log failed login attempt
      await user.addSecurityEvent('failed_login', req.ip, req.headers['user-agent']);
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login info
    user.lastLogin = new Date();
    user.lastLoginIp = req.ip;
    
    // Generate tokens
    const accessToken = auth.generateAccessToken(user._id, user.email, user.role);
    const refreshToken = auth.generateRefreshToken(user._id, user.email, user.role);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo: req.headers['user-agent']
    });
    
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    // Log successful login
    await user.addSecurityEvent('login', req.ip, req.headers['user-agent']);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        universityId: user.universityId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        year: user.year,
        avatar: user.avatar,
        bio: user.bio,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('uploadedVideos')
      .populate('createdPlaylists')
      .populate('savedVideos');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, department, year, avatar } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (department) user.department = department;
    if (year) user.year = year;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        universityId: user.universityId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        year: user.year,
        avatar: user.avatar,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, strictLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'New password must be at least 8 characters' 
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Password must contain uppercase, lowercase, number and special character' 
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.correctPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    
    // Invalidate all refresh tokens
    user.refreshTokens = [];
    
    await user.save();

    // Log security event
    await user.addSecurityEvent('password_change', req.ip, req.headers['user-agent']);

    res.json({
      success: true,
      message: 'Password changed successfully. Please log in again with your new password.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = auth.generateAccessToken(user._id, user.email, user.role);

    res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user && req.body.refreshToken) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(
        rt => rt.token !== req.body.refreshToken
      );
      await user.save();
    }

    // Blacklist access token
    auth.logout(req, res);
    
    // Log security event
    await user.addSecurityEvent('logout', req.ip, req.headers['user-agent']);

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

// Request password reset
router.post('/forgot-password', strictLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Don't reveal if user exists
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If an account exists, a password reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // In production, send email with reset link
    // For now, just return success (you would send email here)
    console.log('Password reset token:', resetToken);
    
    // Log security event
    await user.addSecurityEvent('password_reset_request', req.ip, req.headers['user-agent']);

    res.json({ 
      success: true, 
      message: 'If an account exists, a password reset link has been sent',
      // Remove this in production!
      resetToken: resetToken // For development only
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing password reset request' });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Validate new password
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters' 
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must contain uppercase, lowercase, number and special character' 
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all sessions
    
    await user.save();

    // Log security event
    await user.addSecurityEvent('password_reset', req.ip, req.headers['user-agent']);

    res.json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Get security events (admin or own account)
router.get('/security-events', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('securityEvents');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      events: user.securityEvents.slice(-20) // Last 20 events
    });

  } catch (error) {
    console.error('Get security events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
