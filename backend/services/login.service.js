const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { generateToken } = require('../middleware/auth');

async function register(username, email, password) {
  if (!username || username.length < 3 || username.length > 20) {
    return { status: 400, error: 'VALIDATION_ERROR', message: 'Username harus 3-20 karakter' };
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { status: 400, error: 'VALIDATION_ERROR', message: 'Username hanya boleh alfanumerik' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, error: 'VALIDATION_ERROR', message: 'Format email tidak valid' };
  }
  if (!password || password.length < 6) {
    return { status: 400, error: 'VALIDATION_ERROR', message: 'Password minimal 6 karakter' };
  }

  const [existing] = await db.query(
    'SELECT id FROM users WHERE username = ? OR email = ?', [username, email]
  );
  if (existing.length > 0) {
    const [byName] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (byName.length > 0) return { status: 400, error: 'USERNAME_TAKEN', message: 'Username sudah digunakan' };
    return { status: 400, error: 'EMAIL_TAKEN', message: 'Email sudah terdaftar' };
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (id, username, email, password_hash, coin, active_character, active_skin)
     VALUES (?, ?, ?, ?, 1000, 'bocah_pemula', 'classic')`,
    [id, username, email, passwordHash]
  );

  await db.query(
    `INSERT INTO user_inventory (user_id, item_id, item_type, quantity) VALUES (?, 'bocah_pemula', 'character', 1), (?, 'classic', 'skin', 1)`,
    [id, id]
  );

  const token = generateToken(id);
  return {
    status: 201,
    data: {
      token,
      user: { id, username, email, coin: 1000, activeCharacter: 'bocah_pemula', activeSkin: 'classic', createdAt: new Date().toISOString() }
    }
  };
}

async function login(username, password) {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length === 0) {
    return { status: 401, error: 'INVALID_CREDENTIALS', message: 'Username atau password salah' };
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { status: 401, error: 'INVALID_CREDENTIALS', message: 'Username atau password salah' };
  }

  const token = generateToken(user.id);
  return {
    status: 200,
    data: {
      token,
      user: {
        id: user.id, username: user.username, coin: user.coin,
        activeCharacter: user.active_character, activeSkin: user.active_skin,
        loginStreak: user.login_streak, lastLogin: user.last_login
      }
    }
  };
}

async function getMe(userId) {
  const [rows] = await db.readQuery('SELECT * FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) return { status: 404, error: 'USER_NOT_FOUND' };

  const u = rows[0];
  return {
    status: 200,
    data: {
      user: {
        id: u.id, username: u.username, email: u.email, coin: u.coin,
        activeCharacter: u.active_character, activeSkin: u.active_skin,
        loginStreak: u.login_streak, lastLogin: u.last_login, createdAt: u.created_at
      }
    }
  };
}

module.exports = { register, login, getMe };
