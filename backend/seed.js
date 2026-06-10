/**
 * AgroGreenBits — Database Seed Script
 * Run: node seed.js
 * Creates demo farmer and buyer accounts with sample farms and transactions
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Farm = require('./models/Farm');
const Transaction = require('./models/Transaction');
 
const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
 
  // Clear existing data
  await Promise.all([User.deleteMany(), Farm.deleteMany(), Transaction.deleteMany()]);
  console.log('🗑️  Cleared existing data');
 
  // ── Create users ────────────────────────────────────────────────────────────
  const farmer = await User.create({
    name: 'Ramesh Patil',
    email: 'farmer@demo.com',
    password: 'pass123',
    role: 'farmer',
    phone: '+91 98765 43210',
  });
 
  const buyer = await User.create({
    name: 'Priya Sharma',
    email: 'buyer@demo.com',
    password: 'pass123',
    role: 'buyer',
    companyName: 'GreenFuture Corp',
    phone: '+91 87654 32109',
  });

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'pass123',
    role: 'admin',
    phone: '+91 99999 99999',
  });
 
  console.log('👤 Users created: farmer@demo.com, buyer@demo.com, admin@demo.com (password: pass123)');
 
  // ── Create farms with VERIFIED and UNVERIFIED status ────────────────────────────
  // 
  // VERIFICATION PROCESS:
  // 1. Farmer uses AI/sensor to measure SOC and generate credits
  // 2. Farm created with isVerified = false (⏳ Pending Verification)
  // 3. Admin reviews farm data in Admin Dashboard
  // 4. Admin verifies farm → isVerified = true (✅ Verified)
  // 5. Only VERIFIED farms can be traded on marketplace
  //
  
  const { credits: c1, carbonStock: cs1, co2Equivalent: co1 } = Farm.calculateCredits(2.8, 8.5);
  const farm1 = await Farm.create({
    userId: farmer._id,
    name: 'North Field',
    location: 'Nashik, Maharashtra',
    area: 8.5,
    soilType: 'Black (Regur)',
    currentSOC: 2.8,
    totalCredits: c1,
    availableCredits: c1 - 40,
    soldCredits: 40,
    socReadings: [
      { value: 2.0, depth: 15, source: 'manual', predictedAt: new Date('2024-01-10') },
      { value: 2.5, depth: 15, source: 'ai',     predictedAt: new Date('2024-06-01') },
      { value: 2.8, depth: 15, source: 'ai',     predictedAt: new Date('2024-12-01') },
    ],
    listing: { isListed: true, listedCredits: 80, pricePerCredit: 750, listedAt: new Date() },
    isVerified: true,
    verifiedAt: new Date('2024-02-01'),
    verificationNote: 'Verified - Sensor data validated, SOC calculation correct'
  });
 
  const { credits: c2 } = Farm.calculateCredits(1.9, 5.2);
  const farm2 = await Farm.create({
    userId: farmer._id,
    name: 'Valley Plot',
    location: 'Pune, Maharashtra',
    area: 5.2,
    soilType: 'Alluvial',
    currentSOC: 1.9,
    totalCredits: c2,
    availableCredits: c2,
    soldCredits: 0,
    socReadings: [{ value: 1.9, depth: 15, source: 'ai', predictedAt: new Date('2024-03-15') }],
    listing: { isListed: false, listedCredits: 0, pricePerCredit: 0 },
    isVerified: true,
    verifiedAt: new Date('2024-04-01'),
    verificationNote: 'Verified - Location and soil type confirmed'
  });
 
  // ⏳ UNVERIFIED FARM - Pending Admin Review
  const { credits: c3 } = Farm.calculateCredits(3.4, 12);
  const farm3 = await Farm.create({
    userId: farmer._id,
    name: 'East Farm',
    location: 'Aurangabad, Maharashtra',
    area: 12,
    soilType: 'Red & Yellow',
    currentSOC: 3.4,
    totalCredits: c3,
    availableCredits: c3 - 60,
    soldCredits: 60,
    socReadings: [{ value: 3.4, depth: 20, source: 'ai', predictedAt: new Date('2024-06-20') }],
    listing: { isListed: true, listedCredits: 150, pricePerCredit: 900, listedAt: new Date() },
    isVerified: false,  // ⏳ PENDING VERIFICATION
  });

  // ✅ VERIFIED FARM - Recently Added
  const { credits: c4 } = Farm.calculateCredits(4.2, 15);
  const farm4 = await Farm.create({
    userId: farmer._id,
    name: 'Sunrise Plantation',
    location: 'Jaipur, Rajasthan',
    area: 15,
    soilType: 'Arid / Desert',
    currentSOC: 4.2,
    totalCredits: c4,
    availableCredits: c4,
    soldCredits: 0,
    socReadings: [
      { value: 3.8, depth: 15, source: 'ai', predictedAt: new Date('2024-08-01') },
      { value: 4.2, depth: 15, source: 'ai', predictedAt: new Date('2025-01-15') }
    ],
    listing: { isListed: true, listedCredits: 200, pricePerCredit: 850, listedAt: new Date() },
    isVerified: true,
    verifiedAt: new Date('2025-02-10'),
    verificationNote: 'Verified - High quality data, spectral reading validated'
  });

  // ⏳ UNVERIFIED FARM - Awaiting Review
  const { credits: c5 } = Farm.calculateCredits(2.1, 7.5);
  const farm5 = await Farm.create({
    userId: farmer._id,
    name: 'Riverside Gardens',
    location: 'Warangal, Telangana',
    area: 7.5,
    soilType: 'Red & Yellow',
    currentSOC: 2.1,
    totalCredits: c5,
    availableCredits: c5,
    soldCredits: 0,
    socReadings: [{ value: 2.1, depth: 15, source: 'ai', predictedAt: new Date('2025-03-01') }],
    listing: { isListed: false, listedCredits: 0, pricePerCredit: 0 },
    isVerified: false,  // ⏳ PENDING VERIFICATION
  });

  // ✅ VERIFIED FARM - High SOC Value
  const { credits: c6 } = Farm.calculateCredits(3.9, 10);
  const farm6 = await Farm.create({
    userId: farmer._id,
    name: 'Green Hills Estate',
    location: 'Shimla, Himachal Pradesh',
    area: 10,
    soilType: 'Sandy Loam',
    currentSOC: 3.9,
    totalCredits: c6,
    availableCredits: c6 - 50,
    soldCredits: 50,
    socReadings: [
      { value: 3.2, depth: 15, source: 'manual', predictedAt: new Date('2024-07-01') },
      { value: 3.9, depth: 15, source: 'ai', predictedAt: new Date('2025-02-20') }
    ],
    listing: { isListed: true, listedCredits: 100, pricePerCredit: 920, listedAt: new Date() },
    isVerified: true,
    verifiedAt: new Date('2025-02-25'),
    verificationNote: 'Verified - Excellent soil data, proper depth sampling'
  });

  // ⏳ UNVERIFIED FARM - Just Added by Farmer
  const { credits: c7 } = Farm.calculateCredits(1.7, 6);
  const farm7 = await Farm.create({
    userId: farmer._id,
    name: 'Delta Lands',
    location: 'Alleppey, Kerala',
    area: 6,
    soilType: 'Alluvial',
    currentSOC: 1.7,
    totalCredits: c7,
    availableCredits: c7,
    soldCredits: 0,
    socReadings: [{ value: 1.7, depth: 15, source: 'ai', predictedAt: new Date('2025-03-20') }],
    listing: { isListed: false, listedCredits: 0, pricePerCredit: 0 },
    isVerified: false,  // ⏳ PENDING VERIFICATION
  });
 
  console.log(`🌾 Farms created:`);
  console.log(`   ✅ VERIFIED (5): ${farm1.name}, ${farm2.name}, ${farm4.name}, ${farm6.name}`);
  console.log(`   ⏳ PENDING (3): ${farm3.name}, ${farm5.name}, ${farm7.name}`);
  console.log(`   Total Credits: ${c1 + c2 + c3 + c4 + c5 + c6 + c7}`)
  const tx1 = await Transaction.create({
    buyerId: buyer._id,
    farmerId: farmer._id,
    farmId: farm1._id,
    credits: 30,
    pricePerCredit: 750,
    totalAmount: 30 * 750,
    status: 'completed',
    socAtSale: 2.8,
    co2OffsetTonnes: 30,
    createdAt: new Date('2025-03-15'),
  });
 
  const tx2 = await Transaction.create({
    buyerId: buyer._id,
    farmerId: farmer._id,
    farmId: farm3._id,
    credits: 50,
    pricePerCredit: 850,
    totalAmount: 50 * 850,
    status: 'completed',
    socAtSale: 3.4,
    co2OffsetTonnes: 50,
    createdAt: new Date('2025-05-01'),
  });
 
  console.log(`💰 Transactions created: ₹${tx1.totalAmount.toLocaleString('en-IN')}, ₹${tx2.totalAmount.toLocaleString('en-IN')}`);
  console.log('\n✅ Seed complete! You can now start the server and log in.\n');
 
  await mongoose.disconnect();
};
 
seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
 