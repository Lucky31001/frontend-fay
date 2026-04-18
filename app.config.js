require('dotenv').config();

module.exports = {
  expo: {
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
};