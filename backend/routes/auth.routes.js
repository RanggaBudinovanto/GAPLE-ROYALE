const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const loginService = require('../services/login.service');

router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await loginService.register(username, email, password);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginService.login(username, password);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true });
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await loginService.getMe(req.userId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
