/**
 * EXAMPLE: Extract Firebase Sensor Data → Process with PLSR Model
 * 
 * This shows the complete flow from sensor reading to PLSR prediction
 * Used in dashboard or AI mode
 */

// ════════════════════════════════════════════════════════════════════════════
// METHOD 1: ONE-CLICK AI PROCESSING (Recommended)
// ════════════════════════════════════════════════════════════════════════════

async function processSensorDataWithPLSR(farmId, jwtToken) {
  try {
    console.log(`🔄 Processing spectral data for farm: ${farmId}`);
    
    // Single endpoint does EVERYTHING:
    // 1. Fetch latest sensor reading from Firebase
    // 2. Send to PLSR model
    // 3. Calculate carbon credits
    // 4. Store result to Firebase
    // 5. Return prediction
    
    const response = await fetch(
      (window.API_BASE || API_BASE) + '/firebase/predict-from-latest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ farmId: farmId })
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const { prediction } = await response.json();
    
    console.log('✅ PLSR Prediction Results:');
    console.log(`   SOC: ${prediction.soc}%`);
    console.log(`   Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
    console.log(`   Carbon Stock: ${prediction.carbonStock} t/ha`);
    console.log(`   CO₂ Equivalent: ${prediction.co2Equivalent} t CO₂e/ha`);
    console.log(`   Credits Earned: ${prediction.credits}`);
    
    return prediction;
    
  } catch (error) {
    console.error('❌ PLSR processing failed:', error.message);
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// METHOD 2: STEP-BY-STEP EXTRACTION (For Advanced Control)
// ════════════════════════════════════════════════════════════════════════════

async function extractAndProcessSpectralData(farmId, jwtToken) {
  try {
    // ── STEP 1: Fetch latest sensor reading from Firebase ────────────────────
    console.log('📊 Step 1: Fetching latest spectral data from Firebase...');
    const latestResponse = await fetch(
      `${(window.API_BASE || API_BASE)}/firebase/latest-spectral/${farmId}`,
      {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      }
    );
    
    const { latestReading } = await latestResponse.json();
    const spectralData = latestReading.spectralData;
    const depth = latestReading.depth || 30;
    
    console.log('✅ Sensor data extracted:');
    console.log(`   Spectral Bands (11): [${spectralData.map(v => v.toFixed(2)).join(', ')}]`);
    console.log(`   Depth: ${depth}cm`);
    console.log(`   Timestamp: ${latestReading.timestamp}`);
    
    // ── STEP 2: Send to PLSR Model ──────────────────────────────────────────
    console.log('\n🤖 Step 2: Sending to PLSR AI Model (Port 5001)...');
    const plsrResponse = await fetch('http://127.0.0.1:5001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spectralData: spectralData,
        depth: depth
      })
    });
    
    const plsrResult = await plsrResponse.json();
    
    console.log('✅ PLSR Model Output:');
    console.log(`   SOC: ${plsrResult.soc_percentage}%`);
    console.log(`   Confidence: ${(plsrResult.confidence * 100).toFixed(1)}%`);
    console.log(`   Carbon Stock: ${plsrResult.carbon_stock_tonnes_per_ha} t C/ha`);
    console.log(`   CO₂ Equivalent: ${plsrResult.co2_equivalent_tonnes_per_ha} t CO₂e/ha`);
    
    // ── STEP 3: Store result to Firebase ────────────────────────────────────
    console.log('\n💾 Step 3: Storing prediction result to Firebase...');
    const storeResponse = await fetch(
      (window.API_BASE || API_BASE) + '/firebase/store-reading',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          farmId: farmId,
          spectralData: spectralData,
          soc: plsrResult.soc_percentage,
          confidence: plsrResult.confidence,
          credits: Math.round(plsrResult.co2_equivalent_tonnes_per_ha * 100),
          depth: depth
        })
      }
    );
    
    console.log('✅ Result stored to Firebase & MongoDB');
    
    // ── STEP 4: Calculate Carbon Credits ────────────────────────────────────
    console.log('\n💰 Step 4: Carbon Credits Calculation');
    const credits = Math.round(plsrResult.co2_equivalent_tonnes_per_ha * 100);
    console.log(`   CO₂e: ${plsrResult.co2_equivalent_tonnes_per_ha} t/ha`);
    console.log(`   Credits Earned: ${credits}`);
    
    return {
      success: true,
      spectralData: spectralData,
      soc: plsrResult.soc_percentage,
      confidence: plsrResult.confidence,
      carbonStock: plsrResult.carbon_stock_tonnes_per_ha,
      co2Equivalent: plsrResult.co2_equivalent_tonnes_per_ha,
      credits: credits
    };
    
  } catch (error) {
    console.error('❌ Error in extraction:', error);
    return { success: false, error: error.message };
  }
}

// ════════════════════════════════════════════════════════════════════════════
// METHOD 3: BATCH PROCESS MULTIPLE FARMS
// ════════════════════════════════════════════════════════════════════════════

async function processBatchFarms(farmIds, jwtToken) {
  try {
    console.log(`🔄 Processing ${farmIds.length} farms...`);
    
    const results = [];
    
    for (const farmId of farmIds) {
      console.log(`\n--- Processing ${farmId} ---`);
      const prediction = await processSensorDataWithPLSR(farmId, jwtToken);
      
      if (prediction) {
        results.push({
          farmId: farmId,
          ...prediction
        });
      }
      
      // Wait 1 second between requests (be nice to API)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 BATCH RESULTS:');
    console.log(JSON.stringify(results, null, 2));
    
    // Calculate totals
    const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
    const avgSOC = results.reduce((sum, r) => sum + r.soc, 0) / results.length;
    
    console.log(`\n💰 Total Credits: ${totalCredits}`);
    console.log(`📈 Average SOC: ${avgSOC.toFixed(2)}%`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Batch processing failed:', error);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD UPDATE EXAMPLE
// ════════════════════════════════════════════════════════════════════════════

async function updateDashboardWithPLSRResults(farmId, jwtToken) {
  try {
    // Get prediction
    const prediction = await processSensorDataWithPLSR(farmId, jwtToken);
    
    if (!prediction) return;
    
    // Update HTML Elements
    document.getElementById('soc-value').textContent = `${prediction.soc}%`;
    document.getElementById('confidence-value').textContent = 
      `${(prediction.confidence * 100).toFixed(0)}%`;
    document.getElementById('credits-value').textContent = 
      `${prediction.credits.toLocaleString()}`;
    document.getElementById('carbon-stock-value').textContent = 
      `${prediction.carbonStock} t C/ha`;
    document.getElementById('co2-value').textContent = 
      `${prediction.co2Equivalent} t CO₂e/ha`;
    
    // Update Charts/Visualizations
    updateSOCChart(prediction.soc);
    updateCreditsChart(prediction.credits);
    
    // Show success notification
    showNotification('✅ PLSR Analysis Complete!', 'success');
    
  } catch (error) {
    showNotification('❌ PLSR Analysis Failed: ' + error.message, 'error');
  }
}

// ════════════════════════════════════════════════════════════════════════════
// REAL-TIME MONITORING (Auto-update every 5 minutes)
// ════════════════════════════════════════════════════════════════════════════

function startAutoPlsrMonitoring(farmId, jwtToken, intervalMinutes = 5) {
  console.log(`⏰ Starting auto-PLSR monitoring (${intervalMinutes} min interval)`);
  
  // Initial run
  updateDashboardWithPLSRResults(farmId, jwtToken);
  
  // Repeat every N minutes
  const intervalMs = intervalMinutes * 60 * 1000;
  const intervalId = setInterval(() => {
    console.log(`🔄 Auto-updating PLSR analysis...`);
    updateDashboardWithPLSRResults(farmId, jwtToken);
  }, intervalMs);
  
  return intervalId;  // Can be cleared with clearInterval(intervalId)
}

// ════════════════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ════════════════════════════════════════════════════════════════════════════

/**
 * EXAMPLE 1: One-click Processing
 * 
 * // In your JavaScript (after user logs in)
 * const jwtToken = localStorage.getItem('jwt_token');
 * const prediction = await processSensorDataWithPLSR('farm_001', jwtToken);
 * 
 * Expected output:
 * ✅ PLSR Prediction Results:
 *    SOC: 2.45%
 *    Confidence: 89.0%
 *    Carbon Stock: 31.85 t/ha
 *    CO₂ Equivalent: 116.79 t CO₂e/ha
 *    Credits Earned: 11679
 */

/**
 * EXAMPLE 2: Step-by-Step Control
 * 
 * const result = await extractAndProcessSpectralData('farm_001', jwtToken);
 * 
 * Gives you control at each step:
 * 1. Extract from Firebase
 * 2. Send to PLSR
 * 3. Store result
 * 4. Calculate credits
 */

/**
 * EXAMPLE 3: Batch Processing All Farms
 * 
 * const allFarmIds = ['farm_001', 'farm_002', 'farm_003'];
 * const results = await processBatchFarms(allFarmIds, jwtToken);
 */

/**
 * EXAMPLE 4: Auto-refresh Dashboard
 * 
 * // On page load
 * const intervalId = startAutoPlsrMonitoring('farm_001', jwtToken, 5);
 * 
 * // To stop monitoring later
 * clearInterval(intervalId);
 */

// ════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ════════════════════════════════════════════════════════════════════════════

function showNotification(message, type = 'info') {
  // Implement your notification system
  console.log(`[${type.toUpperCase()}] ${message}`);
}

function updateSOCChart(socValue) {
  // Update your chart library (Chart.js, D3, etc.)
  console.log(`📈 Updating SOC chart: ${socValue}%`);
}

function updateCreditsChart(creditsValue) {
  // Update your chart library
  console.log(`💰 Updating credits chart: ${creditsValue}`);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    processSensorDataWithPLSR,
    extractAndProcessSpectralData,
    processBatchFarms,
    updateDashboardWithPLSRResults,
    startAutoPlsrMonitoring
  };
}
