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
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
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
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
