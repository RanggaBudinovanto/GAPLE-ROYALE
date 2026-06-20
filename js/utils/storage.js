const STORAGE_PREFIX = 'gaple_';
const SESSION_KEYS = new Set(['token', 'backend_token', 'gaple_token']);

export function getItem(key) {
  try {
    const storage = SESSION_KEYS.has(key) ? sessionStorage : localStorage;
    const raw = storage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    const storage = SESSION_KEYS.has(key) ? sessionStorage : localStorage;
    storage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage full or unavailable', e);
  }
}

export function removeItem(key) {
  const storage = SESSION_KEYS.has(key) ? sessionStorage : localStorage;
  storage.removeItem(STORAGE_PREFIX + key);
}

export function getAllUsers() {
  return getItem('users') || [];
}

export function saveUser(user) {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  setItem('users', users);
}

export function findUserByUsername(username) {
  return getAllUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export function findUserById(id) {
  return getAllUsers().find(u => u.id === id) || null;
}

export function getGameHistory() {
  return getItem('game_history') || [];
}

export function addGameHistory(entry) {
  const history = getGameHistory();
  history.unshift(entry);
  if (history.length > 50) history.length = 50;
  setItem('game_history', history);
}
