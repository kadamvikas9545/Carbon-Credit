/**
 * Enhanced Frontend Features
 * 1. User Profile Management
 * 2. Advanced AI Prediction Visualization
 */

// ============================================================================
// 1. USER PROFILE MANAGEMENT
// ============================================================================

async function loadUserProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await fetch('http://localhost:5000/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success) {
      window.currentUserProfile = data.user;
      updateProfileUI(data.user);
    }
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

function updateProfileUI(user) {
  // Update avatar color based on name
  const avatarElement = document.querySelector('.avatar');
  if (avatarElement) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    avatarElement.textContent = initials;
    avatarElement.style.background = generateAvatarColor(user.id);
  }
  
  // Update user name
  const nameElements = document.querySelectorAll('[data-user-name]');
  nameElements.forEach(el => el.textContent = user.name);
}

function generateAvatarColor(userId) {
  const colors = ['#0d5c3a', '#1a7a4e', '#2a9d6f', '#3dbf8a', '#c4870a'];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
}

function openProfileModal() {
  const user = window.currentUserProfile;
  if (!user) return;
  
  const lang = getCurrentLanguage();
  
  const modal = `
    <div class="modal-back" id="profileModal">
      <div class="modal" style="max-width: 500px">
        <div class="modal-title" data-i18n="profileSettings">Profile Settings</div>
        
        <div style="margin-bottom: 1.5rem">
          <div style="text-align: center; margin-bottom: 1rem">
            <div style="
              width: 80px; 
              height: 80px; 
              background: ${generateAvatarColor(user.id)}; 
              border-radius: 50%; 
              margin: 0 auto 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 32px;
              font-weight: bold;
            ">
              ${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div style="font-size: 14px; color: var(--text2); margin-top: 8px">
              ${user.role === 'farmer' ? '🚜 Farmer' : '🏢 Buyer'}
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label data-i18n="fullName">Full name</label>
          <input type="text" id="profileName" value="${user.name}" />
        </div>
        
        <div class="form-group">
          <label data-i18n="email">Email address</label>
          <input type="email" value="${user.email}" disabled style="background: var(--g7); cursor: not-allowed;" />
        </div>
        
        <div class="form-group">
          <label data-i18n="phone">Phone Number</label>
          <input type="tel" id="profilePhone" placeholder="e.g. +91 9876543210" value="${user.phone || ''}" />
        </div>
        
        ${user.role === 'buyer' ? `
          <div class="form-group">
            <label data-i18n="companyName">Company Name</label>
            <input type="text" id="profileCompany" placeholder="e.g. Green Energy Corp" value="${user.companyName || ''}" />
          </div>
        ` : ''}
        
        <div class="form-group">
          <label data-i18n="bio">Bio / Description</label>
          <textarea id="profileBio" placeholder="Tell us about yourself or your organization" style="
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid var(--border);
            border-radius: var(--radius-sm);
            font-family: inherit;
            font-size: 14px;
            resize: vertical;
            min-height: 80px;
          ">${user.bio || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label data-i18n="location">Location</label>
          <input type="text" id="profileLocation" placeholder="e.g. Maharashtra, India" value="${user.location || ''}" />
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeModal('profileModal')" data-i18n="cancel">Cancel</button>
          <button class="btn-green" onclick="saveUserProfile()" data-i18n="saveChanges">Save Changes</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modal);
  updateUILanguage(lang);
}

async function saveUserProfile() {
  try {
    const token = localStorage.getItem('token');
    const user = window.currentUserProfile;
    
    const updateData = {
      name: document.getElementById('profileName').value,
      phone: document.getElementById('profilePhone').value,
      bio: document.getElementById('profileBio').value,
      location: document.getElementById('profileLocation').value,
    };
    
    if (user.role === 'buyer') {
      updateData.companyName = document.getElementById('profileCompany').value;
    }
    
    const response = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    if (data.success) {
      showNotification('Profile updated successfully!', 'success');
      window.currentUserProfile = data.user;
      updateProfileUI(data.user);
      closeModal('profileModal');
    } else {
      showNotification(data.message, 'error');
    }
  } catch (err) {
    showNotification('Error saving profile: ' + err.message, 'error');
  }
}

// ============================================================================
// 3. ADVANCED AI PREDICTION VISUALIZATION
// ============================================================================

function createAIPredictionCharts(predictions) {
  // predictions should be an array of { soc, confidence, depth, date }
  
  if (!predictions || predictions.length === 0) {
    console.warn('No prediction data available');
    return;
  }
  
  // Chart 1: SOC vs Confidence Scatter Plot
  const ctx1 = document.getElementById('socConfidenceChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'SOC % vs Confidence Score',
          data: predictions.map(p => ({ x: p.confidence, y: p.soc })),
          borderColor: 'var(--g2)',
          backgroundColor: 'rgba(26, 122, 78, 0.1)',
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: {
            title: { display: true, text: 'Confidence Score (%)' },
            min: 0, max: 100
          },
          y: {
            title: { display: true, text: 'SOC (%)' },
            min: 0, max: 10
          }
        }
      }
    });
  }
  
  // Chart 2: Carbon Credits by Depth
  const ctx2 = document.getElementById('carbonByDepthChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: predictions.map(p => p.depth + 'cm'),
        datasets: [{
          label: 'Carbon Credits Generated',
          data: predictions.map(p => {
            const bulkDensity = 1.35;
            const carbonStock = (p.soc / 100) * p.depth * bulkDensity * 10;
            const co2PerHa = carbonStock * 3.67;
            const totalCo2 = co2PerHa * (p.areaHa || 2.5);
            const credits = Math.round(totalCo2 * 0.80 * 0.90);
            return credits.toFixed(0);
          }),
          backgroundColor: ['var(--g3)', 'var(--g4)', 'var(--g2)', 'var(--g5)'].slice(0, predictions.length),
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Credits Generated' }
          }
        }
      }
    });
  }
  
  // Chart 3: Prediction History Timeline
  const ctx3 = document.getElementById('predictionTimelineChart');
  if (ctx3) {
    new Chart(ctx3, {
      type: 'line',
      data: {
        labels: predictions.map(p => new Date(p.date).toLocaleDateString()),
        datasets: [
          {
            label: 'SOC %',
            data: predictions.map(p => p.soc),
            borderColor: 'var(--g2)',
            backgroundColor: 'rgba(26, 122, 78, 0.05)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: 'var(--g1)',
            yAxisID: 'y'
          },
          {
            label: 'Confidence Score',
            data: predictions.map(p => p.confidence),
            borderColor: 'var(--amber)',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: 'var(--amber)',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'SOC %' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Confidence %' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }
}

// Create prediction details card with better insights
function createPredictionInsightCard(prediction) {
  // IPCC Tier 1 Methodology - Corrected Carbon Credit Calculation
  const depth = prediction.depth || 30;  // Default 30cm
  const area = prediction.areaHa || 2.5;  // Default 2.5ha
  const bulkDensity = 1.35;  // g/cm³ (Average for most soils)
  
  // Step 1: Calculate Carbon Stock (t C/ha)
  const soc = parseFloat(prediction.soc) || 0;
  const carbonStock = (soc / 100) * depth * bulkDensity * 10;
  
  // Step 2: Calculate CO₂ equivalent per hectare
  const co2PerHa = carbonStock * 3.67;
  
  // Step 3: Total CO₂e for the farm
  const totalCo2 = co2PerHa * area;
  
  // Step 4: Apply IPCC adjustment factors
  const baselineAdjustment = 0.20;  // 20% baseline adjustment
  const permanenceFactor = 0.90;     // 90% permanence factor
  const credits = Math.round(totalCo2 * (1 - baselineAdjustment) * permanenceFactor);
  
  const qualityLevel = prediction.confidence >= 70 ? 'High' : 
                      prediction.confidence >= 50 ? 'Medium' : 'Low';
  const qualityColor = prediction.confidence >= 70 ? 'var(--g3)' : 
                       prediction.confidence >= 50 ? 'var(--amber)' : 'var(--danger)';
  
  return `
    <div class="card" style="border-left: 4px solid ${qualityColor}; margin-bottom: 1rem">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <div style="padding: 0.8rem; background: var(--g7); border-radius: var(--radius-sm)">
          <div style="font-size: 12px; color: var(--text2); margin-bottom: 4px">Prediction Quality</div>
          <div style="font-size: 18px; font-weight: 600; color: ${qualityColor}">${qualityLevel}</div>
          <div style="font-size: 12px; color: var(--text3); margin-top: 4px">${prediction.confidence}% Confidence</div>
        </div>
        
        <div style="padding: 0.8rem; background: var(--info-lt); border-radius: var(--radius-sm)">
          <div style="font-size: 12px; color: var(--text2); margin-bottom: 4px">Credits Generated</div>
          <div style="font-size: 20px; font-weight: 700; color: var(--g1)">${credits}</div>
          <div style="font-size: 12px; color: var(--text3); margin-top: 4px">@ ₹800/credit</div>
        </div>
        
        <div style="padding: 0.8rem; background: var(--amber-lt); border-radius: var(--radius-sm)">
          <div style="font-size: 12px; color: var(--text2); margin-bottom: 4px">Carbon Stock</div>
          <div style="font-size: 18px; font-weight: 600">${carbonStock.toFixed(2)} tC/ha</div>
        </div>
        
        <div style="padding: 0.8rem; background: var(--danger-lt); border-radius: var(--radius-sm)">
          <div style="font-size: 12px; color: var(--text2); margin-bottom: 4px">CO₂ Equivalent</div>
          <div style="font-size: 18px; font-weight: 600">${co2PerHa.toFixed(2)} tCO₂/ha</div>
        </div>
      </div>
      
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border)">
        <div style="font-size: 12px; color: var(--text2); margin-bottom: 6px">IPCC Tier 1 Calculation:</div>
        <div style="font-family: monospace; font-size: 11px; background: var(--g7); padding: 8px; border-radius: 4px; line-height: 1.6; color: var(--text)">
          • SOC ${soc}% → Stock: ${carbonStock.toFixed(2)} tC/ha<br>
          • CO₂e per ha: ${co2PerHa.toFixed(2)} × Area ${area}ha = ${totalCo2.toFixed(2)} tCO₂e<br>
          • Credits = ${totalCo2.toFixed(2)} × 0.80 × 0.90 = <strong>${credits} Credits</strong><br>
          (<em>Depth: ${depth}cm, Bulk Density: ${bulkDensity}g/cm³</em>)
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 2. PROFILE BUTTON IN NAVBAR
// ============================================================================

function addProfileToNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  // Check if profile button already exists
  if (document.querySelector('.profile-btn')) return;
  
  const profileBtn = `
    <button class="profile-btn" onclick="openProfileModal()" style="
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      margin-left: 10px;
      transition: all 0.2s;
    " onmouseover="this.style.background='rgba(255,255,255,0.25)'" 
       onmouseout="this.style.background='rgba(255,255,255,0.15)'">
      👤 Profile
    </button>
  `;
  
  const navUser = navbar.querySelector('.nav-user');
  if (navUser) {
    navUser.insertAdjacentHTML('beforeend', profileBtn);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Call these when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if user is logged in
  if (localStorage.getItem('token')) {
    loadUserProfile();
    setTimeout(addProfileToNavbar, 500);
  }
});
