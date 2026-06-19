const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const rankingService = require('../services/ranking.service');

router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'global', page = 1, limit = 20 } = req.query;
    const result = await rankingService.getLeaderboard(type, parseInt(page), Math.min(parseInt(limit), 50));
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await rankingService.getMyRank(req.userId);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
