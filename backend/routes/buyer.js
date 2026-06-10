const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const Transaction = require('../models/Transaction');
const { protect, authorizeRoles } = require('../middleware/auth');
 
router.use(protect, authorizeRoles('buyer', 'admin'));
 
/**
 * GET /api/buyer/marketplace
 * Browse all listed carbon credits with optional filters
 * Query params: location, minPrice, maxPrice, minCredits, verifiedOnly
 */
router.get('/marketplace', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, minCredits, verifiedOnly } = req.query;
 
    const query = { 'listing.isListed': true, 'listing.listedCredits': { $gt: 0 } };
 
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (minPrice) query['listing.pricePerCredit'] = { ...query['listing.pricePerCredit'], $gte: parseFloat(minPrice) };
    if (maxPrice) query['listing.pricePerCredit'] = { ...query['listing.pricePerCredit'], $lte: parseFloat(maxPrice) };
    if (minCredits) query['listing.listedCredits'] = { $gte: parseInt(minCredits) };
    if (verifiedOnly === 'true') query.isVerified = true;
 
    const listings = await Farm.find(query)
      .populate('userId', 'name email')
      .sort({ 'listing.listedAt': -1 });
 
    // Shape response for frontend
    const marketData = listings.map((f) => ({
      farmId: f._id,
      farmName: f.name,
      farmer: f.userId?.name || 'Unknown',
      farmerEmail: f.userId?.email,
      location: f.location,
      area: f.area,
      soilType: f.soilType,
      soc: f.currentSOC,
      credits: f.listing.listedCredits,
      pricePerCredit: f.listing.pricePerCredit,
      isVerified: f.isVerified,
      listedAt: f.listing.listedAt,
    }));
 
    res.json({ success: true, count: marketData.length, data: marketData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch marketplace listings.' });
  }
});
 
/**
 * POST /api/buyer/buy-credits
 * Purchase carbon credits from a listed farm
 * Body: { farmId, credits }
 */
router.post('/buy-credits', async (req, res) => {
  try {
    const { farmId, credits } = req.body;
 
    if (!farmId || !credits) {
      return res.status(400).json({ success: false, message: 'farmId and credits are required.' });
    }
 
    const farm = await Farm.findById(farmId).populate('userId', 'name');
    if (!farm || !farm.listing.isListed) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }
 
    const creditsToBuy = parseInt(credits);
    if (creditsToBuy > farm.listing.listedCredits) {
      return res.status(400).json({
        success: false,
        message: `Only ${farm.listing.listedCredits} credits available.`,
      });
    }
 
    const totalAmount = creditsToBuy * farm.listing.pricePerCredit;
 
    // Create transaction record
    const transaction = await Transaction.create({
      buyerId: req.user._id,
      farmerId: farm.userId._id,
      farmId: farm._id,
      credits: creditsToBuy,
      pricePerCredit: farm.listing.pricePerCredit,
      totalAmount,
      socAtSale: farm.currentSOC,
      status: 'completed',
    });
 
    // Update farm: reduce listed & available credits
    farm.listing.listedCredits -= creditsToBuy;
    farm.availableCredits -= creditsToBuy;
    farm.soldCredits += creditsToBuy;
    if (farm.listing.listedCredits === 0) farm.listing.isListed = false;
    await farm.save();
 
    res.json({
      success: true,
      message: `Successfully purchased ${creditsToBuy} credits for ₹${totalAmount.toLocaleString('en-IN')}`,
      data: {
        transaction,
        receipt: {
          paymentRef: transaction.paymentRef,
          credits: creditsToBuy,
          pricePerCredit: farm.listing.pricePerCredit,
          totalAmount,
          farmer: farm.userId.name,
          farmName: farm.name,
          co2OffsetTonnes: creditsToBuy,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Purchase failed. Please try again.' });
  }
});
 
/**
 * GET /api/buyer/portfolio
 * Get the buyer's portfolio summary and purchase history
 */
router.get('/portfolio', async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyerId: req.user._id, status: 'completed' })
      .populate('farmerId', 'name')
      .populate('farmId', 'name location')
      .sort({ createdAt: -1 });
 
    const totalCredits = transactions.reduce((s, t) => s + t.credits, 0);
    const totalSpent = transactions.reduce((s, t) => s + t.totalAmount, 0);
 
    res.json({
      success: true,
      data: {
        summary: {
          totalCredits,
          totalSpent,
          co2OffsetTonnes: totalCredits,
          transactions: transactions.length,
        },
        transactions,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load portfolio.' });
  }
});
 
module.exports = router;
 