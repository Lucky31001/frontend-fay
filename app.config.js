const { config: loadEnv } = require('dotenv');
const appJson = require('./app.json');

loadEnv();

module.exports = () => {
  const expo = appJson.expo || {};
  const extra = {
    ...(expo.extra || {}),
    API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.1.22:8000',
  };

  return {
    expo: {
      ...expo,
      extra,
    },
  };
};
