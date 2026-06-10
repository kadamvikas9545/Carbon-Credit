const mongoose = require('mongoose');
 
/**
 * Farm Schema
 * Stores farm details, soil data, SOC readings, and carbon credits
 */
const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    area: {
      type: Number,
      required: [true, 'Farm area (hectares) is required'],
      min: [0.1, 'Area must be at least 0.1 hectares'],
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black (Regur)', 'Red & Yellow', 'Laterite', 'Arid / Desert', 'Sandy Loam', 'Other'],
      default: 'Alluvial',
    },
 
    // Soil Organic Carbon data
    socReadings: [
      {
        value: { type: Number, required: true },    // SOC percentage
        depth: { type: Number, default: 15 },        // Sample depth in cm
        spectralData: [{ type: Number }],            // Raw spectral array from sensor
        predictedAt: { type: Date, default: Date.now },
        source: { type: String, enum: ['manual', 'ai', 'lab'], default: 'ai' },
      },
    ],
    currentSOC: { type: Number, default: 0 },        // Latest SOC reading
 
    // Carbon credit calculations
    totalCredits: { type: Number, default: 0 },      // Total credits ever generated
    availableCredits: { type: Number, default: 0 },  // Credits available to sell
    soldCredits: { type: Number, default: 0 },       // Credits already sold
 
    // Marketplace listing
    listing: {
      isListed: { type: Boolean, default: false },
      listedCredits: { type: Number, default: 0 },
      pricePerCredit: { type: Number, default: 0 },  // In INR
      listedAt: { type: Date },
    },
 
    // Verification status
    isVerified: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date },
    verificationNote: { type: String },
  },
  { timestamps: true }
);

// Add compound index for faster admin queries
farmSchema.index({ isVerified: 1, createdAt: -1 });
 
// ── Carbon Credit Calculation Engine ──────────────────────────────────────────
/**
 * CORRECT: IPCC Tier 1 Methodology
 * Converts SOC % → Carbon Stock → CO₂e → Credits
 *
 * Formula:
 *   Carbon Stock (t C/ha) = (SOC% / 100) × Depth(cm) × Bulk Density(g/cm³) × 10
 *   CO₂ equivalent (t CO₂e/ha) = Carbon Stock × 3.67
 *   Total CO₂e = CO₂e per ha × Area(ha)
 *   Credits = Total CO₂e × (1 - 0.20) × 0.90
 *
 * @param {number} soc - Soil Organic Carbon percentage
 * @param {number} areaHa - Farm area in hectares
 * @param {number} depth - Sampling depth in cm (default 30)
 * @returns {object} { carbonStock, co2Equivalent, totalCo2Equivalent, credits }
 */
farmSchema.statics.calculateCredits = function (soc, areaHa, depth = 30) {
  const bulkDensity = 1.35;  // g/cm³ (Alluvial soil - standard for India)
  
  // Step 1: Calculate SOC stock (t C/ha) using IPCC formula
  const carbonStock = (soc / 100) * depth * bulkDensity * 10;
  
  // Step 2: Calculate CO₂ equivalent per hectare
  const co2EquivalentPerHa = carbonStock * 3.67;
  
  // Step 3: Total CO₂e for farm
  const totalCo2Equivalent = co2EquivalentPerHa * areaHa;
  
  // Step 4: Apply IPCC adjustment factors
  // 0.20 = 20% baseline adjustment (typical agri-degradation)
  // 0.90 = 90% permanence factor (accounts for reversal risk)
  const credits = Math.round(totalCo2Equivalent * (1 - 0.20) * 0.90);
 
  return {
    carbonStock: parseFloat(carbonStock.toFixed(2)),
    co2Equivalent: parseFloat(co2EquivalentPerHa.toFixed(2)),
    totalCo2Equivalent: parseFloat(totalCo2Equivalent.toFixed(2)),
    credits: Math.max(0, credits),
  };
};
 
// Recalculate credits whenever SOC is updated
farmSchema.methods.updateCredits = function () {
  const { credits } = this.constructor.calculateCredits(this.currentSOC, this.area);
  this.totalCredits = credits;
  this.availableCredits = credits - this.soldCredits;
};
 
module.exports = mongoose.model('Farm', farmSchema);
 