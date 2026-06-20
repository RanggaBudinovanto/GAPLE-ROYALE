import { getItem, setItem, findUserById } from './utils/storage.js';

const state = {
  user: null,
  coin: 0,
  inventory: [],
  currentGame: null,
  _listeners: {},

  set(key, value) {
    this[key] = value;
    (this._listeners[key] || []).forEach(fn => fn(value));
  },

  on(key, fn) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(fn);
    return () => {
      this._listeners[key] = this._listeners[key].filter(f => f !== fn);
    };
  },

  emit(key) {
    (this._listeners[key] || []).forEach(fn => fn(this[key]));
  },

  init() {
    const token = getItem('token');
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const userData = findUserById(payload.userId);
        if (userData) {
          this.set('user', userData);
          this.set('coin', userData.coin || 0);
          this.set('inventory', userData.inventory || []);
          return true;
        }
      }
      this.logout();
    }
    return false;
  },

  updateUser(updates) {
    if (!this.user) return;
    Object.assign(this.user, updates);
    if (updates.coin !== undefined) this.set('coin', updates.coin);
    if (updates.inventory !== undefined) this.set('inventory', updates.inventory);
    this.emit('user');
    this.persistUser();
  },

  persistUser() {
    if (!this.user) return;
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === this.user.id);
    if (idx >= 0) users[idx] = this.user;
    else users.push(this.user);
    setItem('users', users);
  },

  addCoin(amount) {
    this.user.coin += amount;
    this.user.stats.totalCoinEarned += amount;
    this.set('coin', this.user.coin);
    this.persistUser();
  },

  spendCoin(amount) {
    if (this.user.coin < amount) return false;
    this.user.coin -= amount;
    this.set('coin', this.user.coin);
    this.persistUser();
    return true;
  },

  logout() {
    this.user = null;
    this.coin = 0;
    this.inventory = [];
    this.currentGame = null;
    setItem('token', null);
    localStorage.removeItem('gaple_token');
    localStorage.removeItem('backend_token');
    sessionStorage.removeItem('gaple_token');
    sessionStorage.removeItem('backend_token');
  },

  async syncWithBackend() {
    const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
    if (!backendToken || !this.user) return;

    try {
      const { apiCall } = await import('./config.js');
      const meRes = await apiCall('GET', '/auth/me');
      if (meRes.error) return;

      const backendUser = meRes.data.user;

      const invRes = await apiCall('GET', `/users/${backendUser.id}/inventory`);
      const backendInventory = (!invRes.error && invRes.data && invRes.data.inventory)
        ? invRes.data.inventory.map(item => item.itemId)
        : this.user.inventory;

      this.user.coin = backendUser.coin;
      this.user.activeCharacter = backendUser.activeCharacter;
      this.user.activeSkin = backendUser.activeSkin;
      this.user.inventory = backendInventory;
      this.user.rankPoints = backendUser.rankPoints || 0;

      this.user.powerups = {};
      if (!invRes.error && invRes.data && invRes.data.inventory) {
        invRes.data.inventory.forEach(item => {
          if (item.itemType === 'powerup') {
            this.user.powerups[item.itemId] = item.quantity;
          }
        });
      }

      this.set('coin', this.user.coin);
      this.set('inventory', [...this.user.inventory]);
      this.persistUser();
      this.emit('user');
    } catch (err) {
      console.warn('Background sync failed:', err);
    }
  }
};

function verifyToken(token) {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}


export default state;
