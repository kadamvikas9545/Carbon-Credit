// Frontend configuration — set `API_BASE` to your deployed backend API base URL.
// Render: after deploying backend, set FRONTEND_URL env var in backend and update this file.
// Example: const API_BASE = 'https://carbon-credit-q7fp.onrender.com/api';

const API_BASE = (function() {
  // Default during development
  if (window && window.location && window.location.hostname === 'localhost') {
    return 'https://carbon-credit-q7fp.onrender.com/api';
  }
  // Production: replace the value below with your backend URL (deployed on Render)
  return 'https://carbon-credit-q7fp.onrender.com/api';
})();


// For non-module scripts that expect a global, also attach:
window.API_BASE = API_BASE;
