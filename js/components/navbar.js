import state from '../state.js';
import { formatNumber } from '../utils/format.js';
import { renderCharacter } from './character.js';

const NAV_ITEMS = [
  { hash: '#/lobby', label: 'Lobby', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>' },
  { hash: '#/shop', label: 'Shop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>' },
  { hash: '#/inventory', label: 'Inventory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
  { hash: '#/leaderboard', label: 'Peringkat', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>' },
  { hash: '#/profile', label: 'Profil', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' }
];

const MOBILE_ITEMS = [
  NAV_ITEMS[0],
  { hash: '#/matchmaking', label: 'Main', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  NAV_ITEMS[1],
  NAV_ITEMS[3],
  NAV_ITEMS[4]
];

export function renderNavbar(container) {
  const user = state.user;
  if (!user) return;

  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-logo" onclick="location.hash='#/lobby'">GAPLE ROYALE</div>
    <div class="sidebar-profile">
      <div class="sidebar-avatar" id="sidebar-avatar"></div>
      <div class="sidebar-user-info">
        <div class="sidebar-username">${user.username}</div>
        <div class="sidebar-coins" id="sidebar-coins">
          <div class="coin-icon coin-icon--sm"></div>
          <span>${formatNumber(user.coin)}</span>
        </div>
      </div>
    </div>
    <div class="sidebar-nav">
      ${NAV_ITEMS.map(item => `
        <div class="sidebar-item ${location.hash.startsWith(item.hash) ? 'sidebar-item--active' : ''}" data-hash="${item.hash}">
          ${item.icon}
          <span>${item.label}</span>
        </div>
      `).join('')}
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-version">v1.0.0</div>
      <button class="btn btn-ghost btn-sm w-full" id="btn-logout">Keluar</button>
    </div>
  `;

  const avatarEl = sidebar.querySelector('#sidebar-avatar');
  avatarEl.innerHTML = renderCharacter(user.activeCharacter, 'tiny');

  sidebar.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      location.hash = item.dataset.hash;
    });
  });

  sidebar.querySelector('#btn-logout').addEventListener('click', () => {
    state.logout();
    location.hash = '#/login';
  });

  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav';
  bottomNav.innerHTML = MOBILE_ITEMS.map(item => `
    <div class="bottom-nav-item ${location.hash.startsWith(item.hash) ? 'bottom-nav-item--active' : ''}" data-hash="${item.hash}">
      ${item.icon}
      <span>${item.label}</span>
    </div>
  `).join('');

  bottomNav.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      location.hash = item.dataset.hash;
    });
  });

  container.appendChild(sidebar);
  container.appendChild(bottomNav);

  const unsubCoin = state.on('coin', (val) => {
    const coinsEl = document.getElementById('sidebar-coins');
    if (coinsEl) {
      coinsEl.querySelector('span').textContent = formatNumber(val);
    }
  });

  return () => unsubCoin();
}
