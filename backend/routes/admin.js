const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, authorizeRoles } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, authorizeRoles('admin'));

/**
 * GET /api/admin/dashboard
 * Returns admin dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const totalFarms = await Farm.countDocuments();
    const verifiedFarms = await Farm.countDocuments({ isVerified: true });
    const pendingFarms = await Farm.countDocuments({ isVerified: false });
    const totalCredits = await Farm.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCredits' } } },
    ]);
    const totalUsers = await User.countDocuments({ role: { $in: ['farmer', 'buyer'] } });
    const totalTransactions = await Transaction.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: {
        totalFarms,
        verifiedFarms,
        pendingFarms,
        totalCredits: totalCredits[0]?.total || 0,
        totalUsers,
        totalTransactions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch admin dashboard.' });
  }
});

/**
 * GET /api/admin/farms
 * Get all farms (both verified and unverified) for admin verification/management
 */
router.get('/farms', async (req, res) => {
  try {
    const farms = await Farm.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Format response for admin dashboard
    const formattedFarms = farms.map((f) => ({
      farmId: f._id,
      farmName: f.name,
      farmer: f.userId?.name || 'Unknown',
      farmerEmail: f.userId?.email,
      location: f.location,
      area: f.area,
      soilType: f.soilType,
      soc: f.currentSOC,
      credits: f.totalCredits,
      isVerified: f.isVerified,
      verifiedAt: f.verifiedAt,
      verificationNote: f.verificationNote,
      listedCredits: f.listing?.listedCredits || 0,
      createdAt: f.createdAt,
    }));

    res.json({ success: true, count: formattedFarms.length, data: formattedFarms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch farms.' });
  }
});

/**
 * POST /api/admin/verify-farm
 * Admin endpoint to verify a carbon farm
 */
router.post('/verify-farm', async (req, res) => {
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
 * GET /api/admin/farms/:farmId
 * Get details of a specific farm
 */
router.get('/farms/:farmId', async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.farmId).populate('userId', 'name email phone');

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    res.json({ success: true, data: farm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch farm details.' });
  }
});

/**
 * GET /api/admin/users
 * Get all users (farmers and buyers)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['farmer', 'buyer'] } }).select('-password');

    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch users.' });
  }
});

/**
 * GET /api/admin/transactions
 * Get all transactions
 */
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('buyerId', 'name email')
      .populate('farmerId', 'name email')
      .populate('farmId', 'name location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch transactions.' });
  }
});

module.exports = router;
