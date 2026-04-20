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
// Ensure EAS projectId is present when linking this repo to EAS (can be overridden by env)
const easProjectId =
  process.env.EAS_PROJECT_ID || (expo.extra && expo.extra.eas && expo.extra.eas.projectId) || null;

// Build the extra object, preserving any existing extras but ensuring API base URL and eas.projectId
const extra = {
  ...(expo.extra || {}),
  API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.1.22:8000',
  eas: {
    ...(expo.extra && expo.extra.eas ? expo.extra.eas : {}),
    projectId: easProjectId,
  },
};

// Ensure a linking scheme is present for production builds (important for Linking)
const scheme = process.env.SCHEME || expo.scheme || 'fay';

// Ensure required identifiers for native builds are present. Prefer env vars, then app.json values, then safe defaults.
const androidPackage = process.env.ANDROID_PACKAGE || (expo.android && expo.android.package) || `com.coding.fay`;
const iosBundleId = process.env.IOS_BUNDLE_ID || (expo.ios && expo.ios.bundleIdentifier) || `com.coding.fay`;
const androidVersionCode = (expo.android && expo.android.versionCode) || parseInt(process.env.ANDROID_VERSION_CODE || '1', 10);
const iosBuildNumber = (expo.ios && expo.ios.buildNumber) || process.env.IOS_BUILD_NUMBER || '1';

module.exports = {
  ...(appJson || {}),
  expo: {
    ...expo,
    scheme,
    android: {
      ...(expo.android || {}),
      package: androidPackage,
      versionCode: androidVersionCode,
    },
    ios: {
      ...(expo.ios || {}),
      bundleIdentifier: iosBundleId,
      buildNumber: iosBuildNumber,
    },
    extra,
  },
};
