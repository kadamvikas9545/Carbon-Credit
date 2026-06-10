const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth');
const axios = require('axios');
const { firebaseAPI, isFirebaseInitialized } = require('../config/firebase');

const PLSR_SERVICE_URL = process.env.PLSR_SERVICE_URL || 'http://127.0.0.1:5001';
 
/**
 * POST /api/predict
 * Simulated AI model: Spectral data → Soil Organic Carbon (SOC) prediction
 *
 * In production, replace the simulation below with a call to your
 * trained ML model (e.g., Python FastAPI service, TensorFlow.js, ONNX Runtime).
 *
 * Input:  { spectral_data: [number], depth: number, farmId?: string }
 * Output: { soc, carbonStock, co2Equivalent, credits, confidence, wavelengths }
 */
router.post('/predict', protect, async (req, res) => {
  try {
    // Accept both spectral_data and spectralBands for compatibility
    const spectral_data = req.body.spectral_data || req.body.spectralBands;
    const depth = 30;  // Fixed to 30 cm as per requirement
    const farmId = req.body.farmId;
 
    if (!spectral_data || !Array.isArray(spectral_data) || spectral_data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'spectral_data or spectralBands must be a non-empty array of numbers.',
      });
    }
 
    // ── PLSR AI MODEL ──────────────────────────────────────────────────────
    // Call Python PLSR service for SOC prediction from spectral data
    // PLSR (Partial Least Squares Regression) handles multicollinearity in spectral data
    
    let plsrResponse;
    try {
      plsrResponse = await axios.post(`${PLSR_SERVICE_URL}/predict`, {
        spectralData: spectral_data,
        depth: depth,
      }, {
        timeout: 5000
      });
    } catch (error) {
      console.error('PLSR Service error:', error.message);
      
      // Fallback to simulated model if Python service unavailable
      console.warn('⚠️ PLSR service unavailable, using fallback simulation');
      
      const n = spectral_data.length;
      let weightedSum = 0;
      let weightTotal = 0;
      spectral_data.forEach((v, i) => {
        const relPos = i / n;
        const weight = relPos > 0.33 && relPos < 0.67 ? 1.5 : 0.8;
        weightedSum += parseFloat(v) * weight;
        weightTotal += weight;
      });
      
      const spectralIndex = weightedSum / weightTotal;
      const depthCorrection = 1 - (depth - 5) / 200;
      const noise = (Math.random() - 0.5) * 0.3;
      const fallbackSOC = parseFloat(
        Math.max(0.5, Math.min(8, spectralIndex * 6 + 0.5 + noise * depthCorrection)).toFixed(2)
      );
      
      plsrResponse = {
        data: {
          soc_percentage: fallbackSOC,
          confidence: 0.65,
          carbon_stock_tonnes_per_ha: 0,
          co2_equivalent_tonnes_per_ha: 0,
        }
      };
    }
    
    const {
      soc_percentage: soc,
      carbon_stock_tonnes_per_ha: plsrCarbonStock,
      co2_equivalent_tonnes_per_ha: plsrCo2,
      confidence: plsrConfidence,
      model_info
    } = plsrResponse.data;
 
    // ── Carbon Credit Engine ────────────────────────────────────────────────────
    // Determine area: use farm's area if farmId provided, else default 1 ha
    let areaHa = 1;
    let farm = null;
    if (farmId) {
      try {
        farm = await Farm.findById(farmId);
        if (farm) {
          areaHa = farm.area;
          console.log(`✅ Found farm: ${farm.name}, area: ${areaHa}ha`);
        } else {
          console.warn(`⚠️ Farm ${farmId} not found, using default area`);
        }
      } catch (farmErr) {
        console.warn(`⚠️ Error finding farm: ${farmErr.message}`);
      }
    }

    let carbonStock = 0, co2Equivalent = 0, credits = 0;
    try {
      const result = Farm.calculateCredits(soc, areaHa, depth);
      carbonStock = result.carbonStock;
      co2Equivalent = result.co2Equivalent;
      credits = result.credits;
    } catch (calcErr) {
      console.error('❌ Credits calculation error:', calcErr);
      // Fallback calculation (IPCC compliant)
      const bulkDensity = 1.35;
      carbonStock = parseFloat(((soc / 100) * depth * bulkDensity * 10).toFixed(2));
      co2Equivalent = parseFloat((carbonStock * 3.67).toFixed(2));
      const totalCo2 = carbonStock * areaHa * 3.67;
      credits = Math.round(totalCo2 * 0.80 * 0.90);
    }

    // ── Optionally persist to farm ──────────────────────────────────────────────
    if (farm) {
      try {
        farm.socReadings.push({ value: soc, depth, spectralData: spectral_data, source: 'plsr' });
        farm.currentSOC = soc;
        farm.totalCredits = credits;
        farm.availableCredits = credits - (farm.soldCredits || 0);
        await farm.save();
        console.log(`✅ Farm updated with new SOC reading`);
      } catch (saveErr) {
        console.error('⚠️ Error saving farm data:', saveErr.message);
        // Continue - farm update failed but prediction still valid
      }
    }

    // Generate simulated wavelength labels (400–2500nm)
    const wavelengths = Array.from({ length: spectral_data.length }, (_, i) =>
      Math.round(400 + (i / (spectral_data.length - 1)) * 2100)
    );

    res.json({
      success: true,
      data: {
        soc,
        carbonStock,
        co2Equivalent,
        credits,
        confidence: plsrConfidence,
        depth,
        areaHa,
        wavelengths,
        spectralData: spectral_data,
        formula: {
          step1: `SOC (${soc}%) × Depth (${depth}cm) × BulkDensity (1.35g/cm³) × 10 = ${carbonStock} t C/ha`,
          step2: `${carbonStock} t C/ha × 3.67 (CO₂/C ratio) = ${co2Equivalent} t CO₂e/ha`,
          step3: `${co2Equivalent} t CO₂e/ha × ${areaHa} ha = ${(co2Equivalent * areaHa).toFixed(2)} t CO₂e (total)`,
          step4: `${(co2Equivalent * areaHa).toFixed(2)} t CO₂e × 0.80 (baseline) × 0.90 (permanence) = ${credits} credits (IPCC Tier 1)`,
        },
        appliedToFarm: farm ? farm.name : null,
        modelInfo: model_info || {
          type: 'PLSR (Fallback Simulation)',
          status: 'Service Unavailable'
        }
      },
    });
  } catch (err) {
    console.error('Predict error:', err);
    res.status(500).json({ success: false, message: 'AI prediction failed.' });
  }
});

/**
 * GET /api/demo/farms
 * List all available farms (no auth required for demo)
 * Shows farm IDs to use with demo/predict endpoint
 */
router.get('/demo/farms', async (req, res) => {
  try {
    const farms = await Farm.find().select('_id name location area currentSOC availableCredits');
    
    res.json({
      success: true,
      total: farms.length,
      farms: farms.map(f => ({
        id: f._id,
        name: f.name,
        location: f.location,
        areaHa: f.area,
        currentSOC: f.currentSOC,
        credits: f.availableCredits
      })),
      info: 'Use the "id" field as farmId parameter in /api/demo/predict'
    });
  } catch (err) {
    console.error('Error fetching farms:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch farms.' });
  }
});

/**
 * GET /api/demo/spectral-reading
 * Generate random realistic spectral data for demo/testing
 * No authentication required
 * 
 * Query params:
 *   - soilType: 'low_soc' | 'medium_soc' | 'high_soc' (default: random)
 *   - farmId: optional farm ID (default: demo_farm_{random})
 * 
 * Response: Realistic 11-band AS7341 spectral reading
 */
router.get('/demo/spectral-reading', (req, res) => {
  try {
    const soilTypes = ['low_soc', 'medium_soc', 'high_soc'];
    let soilType = req.query.soilType || soilTypes[Math.floor(Math.random() * soilTypes.length)];
    const farmId = req.query.farmId || `demo_farm_${Math.floor(Math.random() * 1000)}`;
    
    // Soil type descriptions
    const descriptions = {
      'low_soc': 'Low organic matter (sandy, depleted)',
      'medium_soc': 'Medium organic matter (typical farm soil)',
      'high_soc': 'High organic matter (premium soil)'
    };
    
    // Generate realistic spectral data based on soil type
    const reflectance = {};
    let vis_ref, nir_ref;
    
    if (soilType === 'low_soc') {
      vis_ref = 0.20 + Math.random() * 0.10;  // 0.20-0.30
      nir_ref = 0.25 + Math.random() * 0.10;  // 0.25-0.35
    } else if (soilType === 'high_soc') {
      vis_ref = 0.05 + Math.random() * 0.07;  // 0.05-0.12
      nir_ref = 0.40 + Math.random() * 0.10;  // 0.40-0.50
    } else {  // medium_soc
      vis_ref = 0.10 + Math.random() * 0.08;  // 0.10-0.18
      nir_ref = 0.35 + Math.random() * 0.10;  // 0.35-0.45
    }
    
    // Generate 11 spectral bands
    const bands = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'NIR1', 'NIR2', 'NIR3'];
    const spectralBands = [];
    
    // Visible range (410-680nm)
    for (let i = 0; i < 8; i++) {
      let value = vis_ref * (0.7 + (i / 7) * 0.3);  // Increase with wavelength
      value += (Math.random() - 0.5) * 0.01;  // Add small noise
      spectralBands.push(Math.max(0.01, Math.min(0.5, value)));
    }
    
    // NIR range (700, 850, 940nm)
    spectralBands.push(nir_ref * 0.95);  // 700nm
    spectralBands.push(nir_ref);         // 850nm (peak)
    spectralBands.push(nir_ref * 0.90);  // 940nm
    
    const response = {
      success: true,
      demo: true,
      spectralBands: spectralBands,
      farmId: farmId,
      soilType: soilType,
      description: descriptions[soilType],
      timestamp: new Date().toISOString(),
      wavelengths_nm: [410, 440, 470, 510, 550, 590, 630, 680, 700, 850, 940],
      info: {
        source: 'Demo Random Generator',
        message: 'This is simulated spectral data for testing. Use real sensor data for production.',
        nextStep: 'POST this spectralBands array to /api/predict to get SOC and carbon credits'
      }
    };
    
    res.json(response);
  } catch (err) {
    console.error('Demo generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate demo data.' });
  }
});

/**
 * POST /api/demo/predict
 * Demo prediction without authentication
 * Accepts spectral bands and returns predicted SOC + carbon credits
 * 
 * Body: { spectralBands: [11 numbers], farmId?: string }
 */
router.post('/demo/predict', async (req, res) => {
  try {
    const { spectralBands, farmId } = req.body;
    
    if (!spectralBands || !Array.isArray(spectralBands) || spectralBands.length !== 11) {
      return res.status(400).json({
        success: false,
        message: 'Expected spectralBands array with 11 values'
      });
    }
    
    // Call PLSR service
    let socPercent = 2.0;
    let confidence = 0.42;
    
    try {
      const plsrResponse = await axios.post(`${PLSR_SERVICE_URL}/predict`, {
        spectralBands: spectralBands,
        farmId: farmId || 'demo_farm'
      }, {
        timeout: 5000
      });
      
      socPercent = plsrResponse.data.soc_percent_rounded || plsrResponse.data.soc_percent || 2.0;
      confidence = plsrResponse.data.confidence || 0.42;
    } catch (error) {
      console.warn('PLSR service unavailable, using fallback.');
      // Use fallback if service down
      const avgReflectance = spectralBands.reduce((a, b) => a + b, 0) / spectralBands.length;
      socPercent = Math.max(0.3, Math.min(4.5, (1 - avgReflectance) * 5 + Math.random() * 0.5));
      socPercent = parseFloat(socPercent.toFixed(2));
    }
    
    // Calculate credits
    const depth = 30;  // cm (standard)
    const areaHa = 1;  // Default 1 hectare for demo
    const { carbonStock, co2Equivalent, credits } = Farm.calculateCredits(socPercent, areaHa, depth);
    
    res.json({
      success: true,
      demo: true,
      soc_percent: socPercent,
      confidence: confidence,
      carbonStock: carbonStock,
      co2Equivalent: co2Equivalent,
      credits: credits,
      area_ha: areaHa,
      depth_cm: depth,
      farmId: farmId || 'demo_farm',
      formula: {
        credits_calculation: `IPCC Tier 1: SOC ${socPercent}% × Bulk Density 1.35 × Depth ${depth}cm → Credits ${credits}`
      }
    });
  } catch (err) {
    console.error('Demo predict error:', err);
    res.status(500).json({ success: false, message: 'Demo prediction failed.' });
  }
});

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * FIREBASE REST API SECTION - Access Spectral Data from Realtime Database
 * ═════════════════════════════════════════════════════════════════════════════
 */

/**
 * GET /api/firebase/spectral-readings/:farmId
 * Fetch all spectral readings for a farm from Firebase Realtime DB
 * Response: Array of {soc, spectralData, timestamp, confidence}
 */
router.get('/firebase/spectral-readings/:farmId', protect, async (req, res) => {
  try {
    if (!isFirebaseInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'Firebase URL not configured. Add FIREBASE_DATABASE_URL to .env'
      });
    }

    const { farmId } = req.params;
    
    // GET from Firebase: farms/{farmId}
    const farmData = await firebaseAPI.get('farms', farmId);
    
    if (!farmData) {
      return res.status(404).json({
        success: false,
        message: `Farm ${farmId} not found in Firebase`
      });
    }

    const readings = farmData.socReadings || [];
    
    res.json({
      success: true,
      farmId: farmId,
      farmName: farmData.name,
      totalReadings: readings.length,
      readings: readings.map(r => ({
        soc: r.soc,
        spectralData: r.spectralData,
        timestamp: r.timestamp,
        confidence: r.confidence,
        credits: r.credits
      }))
    });
  } catch (error) {
    console.error('Firebase read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching spectral data from Firebase: ' + error.message
    });
  }
});

/**
 * GET /api/firebase/latest-spectral/:farmId
 * Fetch LATEST spectral reading for a farm (most recent reading)
 * Used by AI mode to process newest data
 * Response: {spectralData, timestamp, soc, confidence}
 */
router.get('/firebase/latest-spectral/:farmId', protect, async (req, res) => {
  try {
    if (!isFirebaseInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'Firebase URL not configured'
      });
    }

    const { farmId } = req.params;
    const farmData = await firebaseAPI.get('farms', farmId);
    
    if (!farmData) {
      return res.status(404).json({
        success: false,
        message: `Farm ${farmId} not found`
      });
    }

    const readings = farmData.socReadings || [];
    
    if (readings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No spectral readings found for this farm'
      });
    }

    // Get most recent reading (array should be sorted by timestamp descending)
    const latestReading = readings[0];
    
    res.json({
      success: true,
      farmId: farmId,
      farmName: farmData.name,
      latestReading: {
        spectralData: latestReading.spectralData,
        timestamp: latestReading.timestamp,
        soc: latestReading.soc,
        confidence: latestReading.confidence,
        credits: latestReading.credits
      },
      hint: 'Use spectralData array to POST to /api/predict for fresh AI processing'
    });
  } catch (error) {
    console.error('Firebase read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest spectral data: ' + error.message
    });
  }
});

/**
 * POST /api/firebase/store-reading
 * Store spectral reading + prediction result to Firebase Realtime DB
 * Called after PLSR model processes spectral data
 * 
 * Body: {
 *   farmId: string,
 *   spectralData: [number],
 *   soc: number,
 *   confidence: number,
 *   credits: number,
 *   depth: number
 * }
 */
router.post('/firebase/store-reading', protect, async (req, res) => {
  try {
    if (!isFirebaseInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'Firebase URL not configured'
      });
    }

    const { farmId, spectralData, soc, confidence, credits, depth } = req.body;

    if (!farmId || !spectralData || soc === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: farmId, spectralData, soc'
      });
    }

    const newReading = {
      spectralData: spectralData,
      soc: soc,
      confidence: confidence || 0,
      credits: credits || 0,
      depth: depth || 30,
      timestamp: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    // Get existing farm data
    let farmData = await firebaseAPI.get('farms', farmId);
    
    if (!farmData) {
      // Create new farm record if doesn't exist
      farmData = {
        farmId: farmId,
        socReadings: [newReading],
        currentSOC: soc,
        availableCredits: credits,
        createdAt: new Date().toISOString()
      };
    } else {
      // Add new reading to existing array
      farmData.socReadings = farmData.socReadings || [];
      farmData.socReadings.unshift(newReading);  // Add to beginning
      farmData.lastReadingAt = new Date().toISOString();
      farmData.currentSOC = soc;
      farmData.availableCredits = credits;
    }

    // Store updated data back to Firebase
    await firebaseAPI.set('farms', farmId, farmData);

    res.json({
      success: true,
      message: 'Spectral reading stored to Firebase',
      stored: {
        farmId: farmId,
        soc: soc,
        confidence: confidence,
        credits: credits,
        timestamp: newReading.timestamp
      }
    });
  } catch (error) {
    console.error('Firebase write error:', error);
    res.status(500).json({
      success: false,
      message: 'Error storing spectral data to Firebase: ' + error.message
    });
  }
});

/**
 * POST /api/firebase/predict-from-latest
 * Full flow: Fetch latest spectral → Process with PLSR → Store result
 * Single endpoint for complete AI processing from Firebase data
 * 
 * Body: { farmId: string }
 */
router.post('/firebase/predict-from-latest', async (req, res) => {
  try {
    if (!isFirebaseInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'Firebase URL not configured'
      });
    }

    const { farmId } = req.body;

    if (!farmId) {
      return res.status(400).json({
        success: false,
        message: 'farmId is required'
      });
    }

    // Step 1: Fetch farm from MongoDB first (has real seed data with correct areas)
    let mongoFarm = null;
    try {
      mongoFarm = await Farm.findById(farmId);
    } catch (err) {
      console.warn(`Farm ${farmId} not found in MongoDB`);
    }

    // Step 2: Fetch latest spectral data from Firebase
    let farmData = await firebaseAPI.get('farms', farmId).catch(() => null);
    
    // Merge MongoDB farm data (real area) with Firebase spectral data
    const realArea = mongoFarm?.area || (farmData?.area || 2.5);  // Use MongoDB area if available
    const realName = mongoFarm?.name || (farmData?.name || 'Demo Farm ' + farmId);
    
    if (!farmData) {
      console.log(`Creating demo farm data for ${farmId}`);
      farmData = {
        id: farmId,
        name: realName,
        area: realArea,
        location: mongoFarm?.location || 'Location',
        socReadings: []
      };
    }

    let readings = farmData.socReadings || [];
    
    // If no readings exist, generate demo spectral data
    if (readings.length === 0) {
      console.log('No readings found, generating demo spectral data');
      const demoSpectralData = Array.from({ length: 128 }, () => (Math.random() * 0.08 + 0.02).toFixed(4));
      readings = [{
        spectralData: demoSpectralData,
        depth: 30,
        timestamp: new Date().toISOString()
      }];
    }

    const latestReading = readings[readings.length - 1];
    const spectralData = latestReading.spectralData;

    // Step 3: Call PLSR AI model
    let plsrResponse;
    try {
      plsrResponse = await axios.post(`${PLSR_SERVICE_URL}/predict`, {
        spectralData: spectralData,
        depth: 30  // Fixed to 30 cm
      }, {
        timeout: 5000
      });
    } catch (error) {
      console.warn('PLSR service unavailable, using fallback');
      
      const n = spectralData.length;
      let weightedSum = 0;
      let weightTotal = 0;
      spectralData.forEach((v, i) => {
        const relPos = i / n;
        const weight = relPos > 0.33 && relPos < 0.67 ? 1.5 : 0.8;
        weightedSum += parseFloat(v) * weight;
        weightTotal += weight;
      });
      
      const spectralIndex = weightedSum / weightTotal;
      const depthCorrection = 1 - (30 - 5) / 200;
      const noise = (Math.random() - 0.5) * 0.3;
      const fallbackSOC = Math.max(0.5, Math.min(8, spectralIndex * 6 + 0.5 + noise * depthCorrection));
      
      plsrResponse = {
        data: {
          soc_percentage: parseFloat(fallbackSOC.toFixed(2)),
          confidence: 0.65
        }
      };
    }

    const { soc_percentage: soc, confidence: plsrConfidence } = plsrResponse.data;

    // Step 4: Calculate credits using REAL area from MongoDB
    const areaHa = realArea;  // Use real MongoDB area
    const depth = 30;  // Fixed to 30 cm
    const { carbonStock, co2Equivalent, credits } = Farm.calculateCredits(soc, areaHa, depth);

    // Step 5: Store result back to Firebase
    const updatedReadings = [...readings, {
      spectralData: spectralData,
      soc: soc,
      confidence: plsrConfidence,
      credits: credits,
      depth: depth,
      timestamp: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      source: 'PLSR_AI'
    }];

    await firebaseAPI.set('farms', farmId, {
      ...farmData,
      socReadings: updatedReadings,
      lastPredictionAt: new Date().toISOString(),
      currentSOC: soc,
      availableCredits: credits
    });

    res.json({
      success: true,
      message: 'Spectral data processed and stored',
      prediction: {
        farmId: farmId,
        farmName: realName,
        soc: soc,
        confidence: plsrConfidence,
        carbonStock: carbonStock,
        co2Equivalent: co2Equivalent,
        credits: credits,
        areaHa: areaHa,
        depth: depth
      }
    });
  } catch (error) {
    console.error('Firebase predict error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing Firebase spectral data: ' + error.message
    });
  }
});

module.exports = router;
 