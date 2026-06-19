const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const chatService = require('../services/chat.service');

router.get('/chat/:sessionId/history', authMiddleware, async (req, res) => {
  try {
    const result = await chatService.getHistory(req.params.sessionId);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
