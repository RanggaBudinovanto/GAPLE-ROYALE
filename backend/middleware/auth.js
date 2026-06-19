const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gaple_royale_secret_2024';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '24h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token tidak ada atau invalid' });
  }

  const token = header.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'TOKEN_EXPIRED', message: 'Token sudah expired, login ulang' });
  }

  req.userId = payload.userId;
  next();
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const payload = verifyToken(header.split(' ')[1]);
    if (payload) req.userId = payload.userId;
  }
  next();
}

module.exports = { generateToken, verifyToken, authMiddleware, optionalAuth };
