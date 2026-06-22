const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/user.service');

router.get('/:userId', async (req, res) => {
  try {
    const result = await userService.getUser(req.params.userId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.get('/:userId/inventory', authMiddleware, async (req, res) => {
  try {
    const result = await userService.getInventory(req.params.userId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/:userId/inventory/purchase', authMiddleware, async (req, res) => {
  try {
    const { itemId, itemType, quantity } = req.body;
    const result = await userService.purchaseItem(req.params.userId, itemId, itemType, quantity || 1);
    res.status(result.status).json(result.data || { error: result.error, message: result.message, required: result.required, current: result.current, shortfall: result.shortfall });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.put('/:userId/character', authMiddleware, async (req, res) => {
  try {
    const result = await userService.setActiveCharacter(req.params.userId, req.body.characterId);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.put('/:userId/skin', authMiddleware, async (req, res) => {
  try {
    const result = await userService.setActiveSkin(req.params.userId, req.body.skinId);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.get('/:userId/stats', async (req, res) => {
  try {
    const result = await userService.getStats(req.params.userId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/:userId/daily-login', authMiddleware, async (req, res) => {
  try {
    const result = await userService.claimDailyLogin(req.params.userId);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.get('/:userId/missions', authMiddleware, async (req, res) => {
  try {
    const result = await userService.getDailyMissions(req.params.userId);
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/:userId/missions/:missionId/claim', authMiddleware, async (req, res) => {
  try {
    const result = await userService.claimMissionReward(req.params.userId, req.params.missionId);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

router.put('/:userId/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.userId) return res.status(403).json({ error: 'FORBIDDEN' });
    const { username, password } = req.body;
    const result = await userService.updateProfile(req.params.userId, username, password);
    res.status(result.status).json(result.data || { error: result.error, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
