const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const Transaction = require('../models/Transaction');
const { protect, authorizeRoles } = require('../middleware/auth');
 
// All farmer routes require authentication + farmer role
router.use(protect, authorizeRoles('farmer'));
 
/**
 * GET /api/farmer/dashboard
 * Returns summary stats, recent SOC readings, and transactions for the logged-in farmer
 */
router.get('/dashboard', async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id });
 
    const totalArea = farms.reduce((s, f) => s + f.area, 0);
    const totalCredits = farms.reduce((s, f) => s + f.totalCredits, 0);
    const availableCredits = farms.reduce((s, f) => s + f.availableCredits, 0);
    const avgSOC =
      farms.length > 0
        ? (farms.reduce((s, f) => s + f.currentSOC, 0) / farms.length).toFixed(2)
        : 0;
 
    const transactions = await Transaction.find({ farmerId: req.user._id })
      .populate('buyerId', 'name companyName')
      .sort({ createdAt: -1 })
      .limit(10);
 
    const totalEarnings = await Transaction.aggregate([
      { $match: { farmerId: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
 
    res.json({
      success: true,
      data: {
        summary: {
          totalFarms: farms.length,
          totalArea,
          avgSOC: parseFloat(avgSOC),
          totalCredits,
          availableCredits,
          totalEarnings: totalEarnings[0]?.total || 0,
        },
        farms,
        recentTransactions: transactions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not load dashboard data.' });
  }
});
 
/**
 * POST /api/farmer/farm
 * Add a new farm for the logged-in farmer
 */
router.post('/farm', async (req, res) => {
  try {
    const { name, location, area, soilType, initialSOC } = req.body;
 
    if (!name || !location || !area) {
      return res.status(400).json({ success: false, message: 'name, location, and area are required.' });
    }
 
    const soc = parseFloat(initialSOC) || 1.5;
    const { carbonStock, co2Equivalent, credits } = Farm.calculateCredits(soc, area);
 
    const farm = await Farm.create({
      userId: req.user._id,
      name,
      location,
      area,
      soilType: soilType || 'Alluvial',
      currentSOC: soc,
      totalCredits: credits,
      availableCredits: credits,
      socReadings: [{ value: soc, source: 'manual' }],
    });
 
    res.status(201).json({
      success: true,
      message: `Farm "${name}" added. ${credits} carbon credits calculated.`,
      data: { farm, calculation: { soc, carbonStock, co2Equivalent, credits } },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not add farm.' });
  }
});
 
/**
 * GET /api/farmer/farms
 * Get all farms for the logged-in farmer
 */
router.get('/farms', async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: farms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch farms.' });
  }
});
 
/**
 * POST /api/farmer/sell-credits
 * List carbon credits from a farm for sale on the marketplace
 * Body: { farmId, listedCredits, pricePerCredit }
 */
router.post('/sell-credits', async (req, res) => {
  try {
    const { farmId, listedCredits, pricePerCredit } = req.body;
 
    if (!farmId || !listedCredits || !pricePerCredit) {
      return res.status(400).json({ success: false, message: 'farmId, listedCredits, and pricePerCredit are required.' });
    }
 
    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found or not owned by you.' });
    }
 
    if (listedCredits > farm.availableCredits) {
      return res.status(400).json({
        success: false,
        message: `Cannot list more than available credits (${farm.availableCredits}).`,
      });
    }
 
    farm.listing = {
      isListed: true,
      listedCredits: parseInt(listedCredits),
      pricePerCredit: parseFloat(pricePerCredit),
      listedAt: new Date(),
    };
    await farm.save();
 
    res.json({
      success: true,
      message: `${listedCredits} credits listed for ₹${pricePerCredit}/credit`,
      data: farm.listing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not list credits.' });
  }
});
 
/**
 * GET /api/farmer/transactions
 * Get the farmer's sales history
 */
router.get('/transactions', async (req, res) => {
  try {
    const txs = await Transaction.find({ farmerId: req.user._id })
      .populate('buyerId', 'name companyName')
      .populate('farmId', 'name location')
      .sort({ createdAt: -1 });
 
    res.json({ success: true, data: txs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch transactions.' });
  }
});

/**
 * GET /api/farmer/farm/:farmId
 * Get details of a specific farm
 */
router.get('/farm/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;
    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    res.json({
      success: true,
      data: {
        farm,
        calculation: Farm.calculateCredits(farm.currentSOC, farm.area),
        socHistory: farm.socReadings.slice(-10),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch farm details.' });
  }
});

/**
 * PUT /api/farmer/farm/:farmId
 * Update farm details
 */
router.put('/farm/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;
    const { name, location, area, soilType } = req.body;
    
    if (!name || !location || !area || !soilType) {
      return res.status(400).json({ success: false, message: 'name, location, area, and soilType are required.' });
    }

    if (area <= 0 || area > 1000) {
      return res.status(400).json({ success: false, message: 'Area must be between 0 and 1000 hectares.' });
    }

    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    farm.name = name;
    farm.location = location;
    farm.area = parseFloat(area);
    farm.soilType = soilType;
    await farm.save();

    res.json({
      success: true,
      message: 'Farm updated successfully.',
      data: farm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not update farm.' });
  }
});

/**
 * DELETE /api/farmer/farm/:farmId
 * Delete a farm
 */
router.delete('/farm/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;
    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    if (farm.soldCredits > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete farm with sold credits.',
      });
    }

    await Farm.findByIdAndDelete(farmId);

    res.json({
      success: true,
      message: `Farm "${farm.name}" has been deleted.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not delete farm.' });
  }
});

/**
 * POST /api/farmer/apply-credits
 * Apply PLSR-calculated credits to a farm
 * Body: { farmId, soc, credits, areaHa, depth, source }
 */
router.post('/apply-credits', async (req, res) => {
  try {
    const { farmId, soc, credits, areaHa, depth, source } = req.body;

    if (!farmId || soc === undefined || !credits) {
      return res.status(400).json({
        success: false,
        message: 'farmId, soc, and credits are required.',
      });
    }

    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or not owned by you.',
      });
    }

    // Update farm data
    const previousSOC = farm.currentSOC;
    farm.currentSOC = parseFloat(soc);
    farm.totalCredits = parseInt(credits);
    farm.availableCredits = parseInt(credits);

    // Add to SOC readings history
    farm.socReadings.push({
      value: parseFloat(soc),
      source: source || 'ai',
      depth: depth || 30,
      predictedAt: new Date(),
    });

    await farm.save();

    res.json({
      success: true,
      message: `${credits} carbon credits applied to "${farm.name}". SOC updated from ${previousSOC.toFixed(2)}% to ${soc.toFixed(2)}%.`,
      data: {
        farm,
        calculation: Farm.calculateCredits(soc, areaHa || farm.area, depth || 30),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not apply credits.' });
  }
});
 
module.exports = router;
 