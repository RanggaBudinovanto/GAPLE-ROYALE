import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { getAchievementsList } from '../api.js';
import { apiCall } from '../config.js';
import { getGameHistory } from '../utils/storage.js';
import { formatNumber, formatDate, winRate } from '../utils/format.js';
import { staggerFadeIn, countUp } from '../utils/animation.js';

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  const allAchievements = getAchievementsList();
  let history = getGameHistory().filter(g => g.userId === user.id).slice(0, 10);

  container.innerHTML = '<div class="page-with-sidebar"><div id="nav-mount"></div><div class="page-content" id="profile-content"></div></div>';
  const navCleanup = renderNavbar(container.querySelector('#nav-mount'));
  const content = container.querySelector('#profile-content');

  // Try to fetch stats from backend
  apiCall('GET', `/users/${user.id}/stats`).then(res => {
    if (!res.error && res.data && res.data.stats) {
      const s = res.data.stats;
      user.stats.wins = s.wins ?? user.stats.wins;
      user.stats.losses = s.losses ?? user.stats.losses;
      user.stats.totalGames = s.totalGames ?? user.stats.totalGames;
      user.stats.totalCoinEarned = s.totalCoinEarned ?? user.stats.totalCoinEarned;
      user.stats.longestStreak = s.longestStreak ?? user.stats.longestStreak;
      if (s.recentGames) history = s.recentGames.slice(0, 10);
      state.persistUser();
      renderProfileContent();
    }
  }).catch(() => {});

  renderProfileContent();

  function renderProfileContent() {

  content.innerHTML = `
    <!-- Profile Header -->
    <div class="card card--premium" style="display:flex;align-items:center;gap:var(--sp-6);margin-bottom:var(--sp-7);flex-wrap:wrap;">
      <div class="character-container character-idle" style="flex-shrink:0;">
        ${renderCharacter(user.activeCharacter, 'large')}
      </div>
      <div style="flex:1;min-width:200px;">
        <h1 class="text-display" style="margin-bottom:var(--sp-2);">${user.username}</h1>
        <div class="flex gap-2 items-center" style="margin-bottom:var(--sp-3);flex-wrap:wrap;">
          <span class="badge badge--gold">${getCharacterName(user.activeCharacter)}</span>
          <span class="badge badge--muted">${user.activeSkin}</span>
        </div>
        <div class="coin-display" style="font-size:24px;margin-bottom:var(--sp-3);">
          <div class="coin-icon coin-icon--lg"></div>
          <span id="profile-coin">0</span>
        </div>
        <div class="text-sm text-secondary">Bergabung: ${formatDate(user.createdAt)}</div>
      </div>
    </div>

    <!-- Stats Grid -->
    <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">STATISTIK LENGKAP</h3>
    <div class="grid grid-3" style="margin-bottom:var(--sp-7);" id="profile-stats">
      <div class="stat-card">
        <div class="stat-card-label">Total Game</div>
        <div class="stat-card-value">${user.stats.totalGames}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Menang</div>
        <div class="stat-card-value" style="color:var(--status-win);">${user.stats.wins}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Kalah</div>
        <div class="stat-card-value" style="color:var(--status-lose);">${user.stats.losses}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Win Rate</div>
        <div class="stat-card-value">${winRate(user.stats.wins, user.stats.totalGames)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total Coin Earned</div>
        <div class="stat-card-value">${formatNumber(user.stats.totalCoinEarned)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Win Streak Terpanjang</div>
        <div class="stat-card-value">${user.stats.longestStreak}</div>
      </div>
    </div>

    <!-- Achievements -->
    <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">ACHIEVEMENT</h3>
    <div class="grid grid-4" style="margin-bottom:var(--sp-7);" id="ach-grid">
      ${allAchievements.map(ach => {
        const unlocked = user.achievements.find(a => a.id === ach.id);
        return `
          <div class="card ${unlocked ? 'card--premium' : ''}" style="text-align:center;padding:var(--sp-4);${unlocked ? '' : 'opacity:0.4;'}">
            <div style="font-size:32px;margin-bottom:var(--sp-2);">${unlocked ? '🏆' : '🔒'}</div>
            <div style="font-family:var(--font-heading);font-size:13px;font-weight:600;margin-bottom:var(--sp-1);">${ach.name}</div>
            <div class="text-xs text-secondary" style="margin-bottom:var(--sp-2);">${ach.desc}</div>
            <div class="coin-display" style="font-size:12px;justify-content:center;">
              <div class="coin-icon coin-icon--sm"></div>${ach.reward}
            </div>
            ${unlocked ? `<div class="text-xs text-muted" style="margin-top:var(--sp-1);">${formatDate(unlocked.unlockedAt)}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <!-- Game History -->
    <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">RIWAYAT GAME</h3>
    ${history.length > 0 ? `
      <div class="flex flex-col gap-2">
        ${history.map(g => `
          <div class="card card--flat" style="padding:var(--sp-3);display:flex;align-items:center;justify-content:space-between;">
            <div class="flex items-center gap-3">
              <span class="badge ${g.result === 'win' ? 'badge--green' : 'badge--red'}">${g.result === 'win' ? 'Menang' : 'Kalah'}</span>
              <span class="text-sm">${g.mode === 'duel' ? 'Duel' : '4 Pemain'}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="coin-display" style="font-size:13px;"><div class="coin-icon coin-icon--sm"></div>+${g.coinEarned}</span>
              <span class="text-xs text-muted">${formatDate(g.playedAt)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '<div class="empty-state"><p>Belum ada riwayat game.</p></div>'}
  `;

  const coinEl = content.querySelector('#profile-coin');
  countUp(coinEl, user.coin);
  staggerFadeIn('#profile-stats .stat-card');
  staggerFadeIn('#ach-grid .card', { delay: 0.2 });

  } // end renderProfileContent

  return () => { if (navCleanup) navCleanup(); };
}
