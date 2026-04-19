const { config: loadEnv } = require('dotenv');

// Attempt to load app.json if present; fall back to empty object for pure dynamic config
let appJson = {};
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  appJson = require('./app.json');
} catch (err) {
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

module.exports = {
  ...(appJson || {}),
  expo: {
    ...expo,
    extra,
  },
};
