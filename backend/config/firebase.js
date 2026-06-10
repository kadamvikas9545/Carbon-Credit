/**
 * Firebase REST API Configuration
 * Simplified: Only requires URL, no service account JSON needed
 */
const axios = require('axios');

const FIREBASE_DB_URL = process.env.FIREBASE_DATABASE_URL || '';

// Check if Firebase is configured
const isFirebaseInitialized = () => {
  return FIREBASE_DB_URL && FIREBASE_DB_URL.length > 0;
};

// Helper: Get Firestore REST API URL
const getFirestoreUrl = (collection, doc) => {
  return `https://firestore.googleapis.com/v1/projects/${extractProjectId(FIREBASE_DB_URL)}/databases/(default)/documents/${collection}/${doc}`;
};

// Helper: Extract project ID from Firebase URL
const extractProjectId = (url) => {
  // URL format: https://your-project-id.firebaseio.com
  if (!url) return 'your-project-id';
  const match = url.match(/https:\/\/([^.]+)/);
  return match ? match[1] : 'your-project-id';
};

// Firebase REST API - Simple GET/POST helper
const firebaseAPI = {
  // GET data from Firestore
  async get(collection, doc) {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase URL not configured');
    }
    
    try {
      const url = `${FIREBASE_DB_URL}/${collection}/${doc}.json`;
      const response = await axios.get(url, { timeout: 5000 });
      return response.data;
    } catch (error) {
      throw new Error(`Firebase GET failed: ${error.message}`);
    }
  },

  // POST/UPDATE data to Firestore
  async set(collection, doc, data) {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase URL not configured');
    }
    
    try {
      const url = `${FIREBASE_DB_URL}/${collection}/${doc}.json`;
      const response = await axios.put(url, data, { timeout: 5000 });
      return response.data;
    } catch (error) {
      throw new Error(`Firebase SET failed: ${error.message}`);
    }
  },

  // PATCH (merge) data
  async update(collection, doc, data) {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase URL not configured');
    }
    
    try {
      const url = `${FIREBASE_DB_URL}/${collection}/${doc}.json`;
      const response = await axios.patch(url, data, { timeout: 5000 });
      return response.data;
    } catch (error) {
      throw new Error(`Firebase PATCH failed: ${error.message}`);
    }
  },

  // DELETE data
  async delete(collection, doc) {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase URL not configured');
    }
    
    try {
      const url = `${FIREBASE_DB_URL}/${collection}/${doc}.json`;
      const response = await axios.delete(url, { timeout: 5000 });
      return response.status === 200 ? { success: true } : { success: false };
    } catch (error) {
      throw new Error(`Firebase DELETE failed: ${error.message}`);
    }
  }
};

module.exports = {
  firebaseAPI,
  isFirebaseInitialized,
  extractProjectId
};
