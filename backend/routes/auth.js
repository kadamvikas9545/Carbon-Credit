const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Farm = require('../models/Farm');
const { generateToken, protect, authorizeRoles } = require('../middleware/auth');
 
/**
 * POST /api/auth/register
 * Register a new farmer or buyer account
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, companyName, phone } = req.body;
 
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'name, email, password, and role are required.' });
    }
    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be "farmer" or "buyer".' });
    }
 
    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
 
    const user = await User.create({ name, email, password, role, companyName, phone });
    const token = generateToken(user._id);
 
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});
 
/**
 * POST /api/auth/login
 * Authenticate a user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
 
    // Explicitly select password (excluded by default in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
 
    const token = generateToken(user._id);
 
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch profile.' });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile (requires authentication)
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, companyName } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Validate inputs
    if (name && name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
    }

    if (phone && phone.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Phone number is invalid.' });
    }

    // Update fields
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (companyName && user.role === 'buyer') {
      user.companyName = companyName.trim();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not update profile.' });
  }
});

/**
 * POST /api/auth/verify-farm
 * Admin endpoint: Verify a carbon farm
 * (In production, would require admin role)
 */
router.post('/verify-farm', protect, async (req, res) => {
  try {
    const { farmId, verificationNote } = req.body;
    
    if (!farmId) {
      return res.status(400).json({ success: false, message: 'farmId is required.' });
    }

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    farm.isVerified = true;
    farm.verifiedAt = new Date();
    farm.verificationNote = verificationNote || 'Verified by admin';
    await farm.save();

    // Populate user details
    await farm.populate('userId', 'name email');

    res.json({
      success: true,
      message: `Farm "${farm.name}" has been verified.`,
      data: farm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not verify farm.' });
  }
});

/**
 * POST /api/auth/change-password
 * Change user password (requires authentication)
 */
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not change password.' });
  }
});
 
module.exports = router;
 