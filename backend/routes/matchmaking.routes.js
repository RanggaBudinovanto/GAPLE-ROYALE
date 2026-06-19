const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const matchmakingService = require('../services/matchmaking.service');

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { mode, opponentType, botLevel } = req.body;
    const result = await matchmakingService.createSession(req.userId, mode, opponentType, botLevel);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.get('/status/:roomId', async (req, res) => {
  try {
    const result = await matchmakingService.getStatus(req.params.roomId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.delete('/cancel/:roomId', authMiddleware, async (req, res) => {
  try {
    const result = await matchmakingService.cancelSearch(req.params.roomId, req.userId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
