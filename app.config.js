const { config: loadEnv } = require('dotenv');

// Attempt to load app.json if present; fall back to empty object for pure dynamic config
let appJson = {};
try {
  // require dynamically if present
  /* global-require is allowed here for dynamic optional config */
  appJson = require('./app.json');
} catch {
  appJson = {};
}

// Load environment variables from .env
loadEnv();

// Build final expo config using values from app.json when available, otherwise defaults
const expo = (appJson && appJson.expo) || {};
const extra = {
  ...(expo.extra || {}),
  API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.1.22:8000',
};

// Ensure a linking scheme is present for production builds (important for Linking)
const scheme = process.env.SCHEME || expo.scheme || 'fay';

module.exports = {
  ...(appJson || {}),
  expo: {
    ...expo,
    scheme,
    extra,
  },
};
