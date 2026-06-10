const mongoose = require('mongoose');
 
/**
 * Transaction Schema
 * Records every carbon credit purchase between a buyer and farmer
 */
const transactionSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
 
    credits: {
      type: Number,
      required: true,
      min: [1, 'Must purchase at least 1 credit'],
    },
    pricePerCredit: {
      type: Number,
      required: true,
      min: [1, 'Price must be positive'],
    },
    totalAmount: { type: Number, required: true }, // credits × pricePerCredit
 
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
 
    // Payment simulation details
    paymentRef: { type: String, default: () => 'PAY-' + Date.now() },
    paymentMethod: { type: String, default: 'simulated' },
 
    // Carbon offset info stored at time of transaction
    co2OffsetTonnes: { type: Number }, // = credits × 1
    socAtSale: { type: Number },       // SOC % of the farm at time of sale
  },
  { timestamps: true }
);
 
// Compute totalAmount before saving
transactionSchema.pre('save', function (next) {
  this.totalAmount = this.credits * this.pricePerCredit;
  this.co2OffsetTonnes = this.credits; // 1 credit = 1 tonne CO₂e
  next();
});
 
module.exports = mongoose.model('Transaction', transactionSchema);
 