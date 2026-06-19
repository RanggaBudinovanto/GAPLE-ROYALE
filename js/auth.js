import { getItem, setItem, getAllUsers, findUserByUsername } from './utils/storage.js';
import { generateUUID } from './utils/format.js';

export function createJWT(userId) {
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
  return `gaple.${payload}.simulasi`;
}

export function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function register(username, email, password) {
  if (!username || username.length < 3 || username.length > 20) {
    return { error: 'VALIDATION_ERROR', message: 'Username harus 3-20 karakter' };
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { error: 'VALIDATION_ERROR', message: 'Username hanya boleh huruf dan angka' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'VALIDATION_ERROR', message: 'Format email tidak valid' };
  }
  if (!password || password.length < 6) {
    return { error: 'VALIDATION_ERROR', message: 'Password minimal 6 karakter' };
  }

  const users = getAllUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { error: 'USERNAME_TAKEN', message: 'Username sudah digunakan' };
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'EMAIL_TAKEN', message: 'Email sudah terdaftar' };
  }

  const user = {
    id: generateUUID(),
    username,
    email,
    passwordHash: btoa(password),
    createdAt: new Date().toISOString(),
    coin: 1000,
    activeCharacter: 'bocah_pemula',
    activeSkin: 'classic',
    inventory: ['bocah_pemula', 'classic'],
    stats: {
      wins: 0,
      losses: 0,
      totalGames: 0,
      totalCoinEarned: 1000,
      longestStreak: 0,
      currentStreak: 0,
      powerupsUsed: 0,
      chatMessagesSent: 0
    },
    achievements: [],
    lastLogin: null,
    loginStreak: 0,
    dailyMissions: {},
    powerups: {}
  };

  users.push(user);
  setItem('users', users);

  const token = createJWT(user.id);
  setItem('token', token);

  return { token, user };
}

export function login(username, password) {
  const user = findUserByUsername(username);
  if (!user) {
    return { error: 'INVALID_CREDENTIALS', message: 'Username atau password salah' };
  }
  if (atob(user.passwordHash) !== password) {
    return { error: 'INVALID_CREDENTIALS', message: 'Username atau password salah' };
  }

  const token = createJWT(user.id);
  setItem('token', token);

  return { token, user };
}

export function logout() {
  setItem('token', null);
}

export function getCurrentToken() {
  return getItem('token');
}

export function isLoggedIn() {
  const token = getCurrentToken();
  return token ? verifyJWT(token) !== null : false;
}
