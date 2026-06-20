const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const chatService = require('../services/chat.service');
const gameService = require('../services/game.service');

router.get('/chat/:sessionId/history', authMiddleware, async (req, res) => {
  try {
    const result = await chatService.getHistory(req.params.sessionId);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/local-end', authMiddleware, async (req, res) => {
  try {
    const { sessionId, winnerId, coinEarned } = req.body;
    const result = await gameService.endLocalGame(req.userId, sessionId, winnerId, parseInt(coinEarned || 0));
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
