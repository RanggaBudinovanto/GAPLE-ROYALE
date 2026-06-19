const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'RATE_LIMITED', message: 'Terlalu banyak request, coba lagi nanti' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'RATE_LIMITED', message: 'Terlalu banyak percobaan login, coba lagi nanti' }
});

module.exports = { apiLimiter, authLimiter };
