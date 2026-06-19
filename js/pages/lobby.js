import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { showModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { countUp, coinRain, staggerFadeIn } from '../utils/animation.js';
import { formatNumber, getToday, formatDate } from '../utils/format.js';
import { claimDailyLogin, getDailyMissions, claimMissionReward, getAchievementsList, getCatalog } from '../api.js';

const DAILY_REWARDS = [100, 150, 200, 300, 300, 400, 500];

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  container.innerHTML = '<div class="page-with-sidebar"><div id="nav-mount"></div><div class="page-content" id="lobby-content"></div></div>';
  const navCleanup = renderNavbar(container.querySelector('#nav-mount'));
  const content = container.querySelector('#lobby-content');

  const missions = getDailyMissions();
  const achievements = getAchievementsList();
  const userAchievements = user.achievements || [];
  const recentAchievements = userAchievements.slice(-3).reverse();
  const charInfo = getCatalog().characters.find(c => c.id === user.activeCharacter);

  content.innerHTML = `
    <div style="margin-bottom:var(--sp-7);">
      <h1 class="text-heading" style="color:var(--text-secondary);font-weight:400;">Selamat Datang,</h1>
      <h2 class="text-display text-gold" style="margin-top:var(--sp-1);">${user.username}</h2>
    </div>

    <!-- Coin & CTA -->
    <div class="flex items-center gap-5" style="margin-bottom:var(--sp-7);flex-wrap:wrap;">
      <div class="coin-display" style="font-size:28px;">
        <div class="coin-icon coin-icon--lg"></div>
        <span id="coin-count">0</span>
      </div>
      <button class="btn btn-primary btn-lg" onclick="location.hash='#/matchmaking'">MAIN SEKARANG</button>
    </div>

    <!-- Stats + Mission Row -->
    <div class="grid grid-2" style="margin-bottom:var(--sp-7);gap:var(--sp-5);">
      <!-- Quick Stats -->
      <div>
        <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">STATISTIK</h3>
        <div class="grid grid-2" style="gap:var(--sp-3);" id="stats-grid">
          <div class="stat-card anim-item">
            <div class="stat-card-label">Total Game</div>
            <div class="stat-card-value">${user.stats.totalGames}</div>
          </div>
          <div class="stat-card anim-item">
            <div class="stat-card-label">Menang</div>
            <div class="stat-card-value" style="color:var(--status-win);">${user.stats.wins}</div>
          </div>
          <div class="stat-card anim-item">
            <div class="stat-card-label">Kalah</div>
            <div class="stat-card-value" style="color:var(--status-lose);">${user.stats.losses}</div>
          </div>
          <div class="stat-card anim-item">
            <div class="stat-card-label">Win Rate</div>
            <div class="stat-card-value">${user.stats.totalGames > 0 ? Math.round(user.stats.wins / user.stats.totalGames * 100) : 0}%</div>
          </div>
        </div>
      </div>

      <!-- Daily Missions -->
      <div>
        <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">MISI HARIAN</h3>
        <div class="flex flex-col gap-3" id="missions-list">
          ${missions.map(m => `
            <div class="card card--flat" style="padding:var(--sp-4);">
              <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2);">
                <span style="font-weight:600;">${m.name}</span>
                <span class="coin-display" style="font-size:13px;"><div class="coin-icon coin-icon--sm"></div>${m.reward}</span>
              </div>
              <div class="progress" style="margin-bottom:var(--sp-2);">
                <div class="progress-bar progress-bar--green" style="width:${Math.min(m.progress / m.target * 100, 100)}%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-secondary">${m.progress}/${m.target}</span>
                ${m.completed && !m.claimed
                  ? `<button class="btn btn-primary btn-sm claim-mission-btn" data-mission="${m.id}">Klaim</button>`
                  : m.claimed
                    ? '<span class="badge badge--green">Diklaim</span>'
                    : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Character + Achievements Row -->
    <div class="grid grid-2" style="gap:var(--sp-5);">
      <!-- Active Character -->
      <div class="card" style="display:flex;align-items:center;gap:var(--sp-5);">
        <div class="character-container character-idle">
          ${renderCharacter(user.activeCharacter, 'medium')}
        </div>
        <div>
          <div class="text-label text-secondary" style="margin-bottom:var(--sp-2);">KARAKTER AKTIF</div>
          <div style="font-family:var(--font-heading);font-size:20px;font-weight:600;margin-bottom:var(--sp-2);">${getCharacterName(user.activeCharacter)}</div>
          <div class="text-sm text-secondary" style="margin-bottom:var(--sp-3);">${charInfo ? charInfo.skill : ''}</div>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/inventory'">Ganti Karakter</button>
        </div>
      </div>

      <!-- Recent Achievements -->
      <div>
        <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">ACHIEVEMENT TERBARU</h3>
        ${recentAchievements.length > 0
          ? `<div class="flex flex-col gap-3">
              ${recentAchievements.map(ua => {
                const ach = achievements.find(a => a.id === ua.id);
                return ach ? `
                  <div class="card card--flat" style="padding:var(--sp-3);display:flex;align-items:center;gap:var(--sp-3);">
                    <div style="width:36px;height:36px;background:rgba(212,160,23,0.15);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:18px;">🏆</div>
                    <div style="flex:1;">
                      <div style="font-weight:600;font-size:14px;">${ach.name}</div>
                      <div class="text-xs text-secondary">${formatDate(ua.unlockedAt)}</div>
                    </div>
                  </div>
                ` : '';
              }).join('')}
            </div>`
          : '<div class="empty-state" style="padding:var(--sp-5);"><p class="text-muted">Belum ada achievement</p></div>'
        }
      </div>
    </div>
  `;

  // Coin count-up animation
  const coinEl = content.querySelector('#coin-count');
  countUp(coinEl, user.coin);

  // Stagger stats animation
  staggerFadeIn('#stats-grid .anim-item');

  // Mission claim buttons
  content.querySelectorAll('.claim-mission-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = claimMissionReward(btn.dataset.mission);
      if (result.success) {
        showToast(`+${result.coinReward} coin dari misi!`, 'success');
        render(container);
      }
    });
  });

  // Daily login bonus check
  if (user.lastLogin !== getToday()) {
    setTimeout(() => showDailyLoginModal(), 600);
  }

  return () => { if (navCleanup) navCleanup(); };
}

function showDailyLoginModal() {
  const user = state.user;
  const nextDay = user.loginStreak < 7 ? user.loginStreak + 1 : 7;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const isConsecutive = user.lastLogin === yesterdayStr;
  const day = isConsecutive ? Math.min(user.loginStreak + 1, 7) : 1;
  const reward = DAILY_REWARDS[day - 1];

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="text-align:center;margin-bottom:var(--sp-5);position:relative;" id="login-bonus-area">
      <div style="font-size:48px;margin-bottom:var(--sp-3);">🎁</div>
      <h3 style="font-family:var(--font-heading);font-size:20px;color:var(--text-gold);margin-bottom:var(--sp-2);">Hari ke-${day}</h3>
      <p class="text-secondary">Login harian streak!</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:var(--sp-5);">
      ${DAILY_REWARDS.map((r, i) => `
        <div style="
          text-align:center;padding:8px 4px;border-radius:var(--radius-md);
          background:${i + 1 === day ? 'rgba(245,200,66,0.15)' : i + 1 < day ? 'rgba(46,204,113,0.1)' : 'var(--bg-surface)'};
          border:1px solid ${i + 1 === day ? 'var(--gold-bright)' : i + 1 < day ? 'var(--status-win)' : 'var(--border-default)'};
        ">
          <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">H${i + 1}</div>
          <div style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:${i + 1 === day ? 'var(--text-gold)' : 'var(--text-secondary)'};">${r}</div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;">
      <div class="coin-display" style="font-size:32px;justify-content:center;margin-bottom:var(--sp-4);">
        <div class="coin-icon coin-icon--lg"></div>
        <span>+${reward}</span>
      </div>
      <button class="btn btn-primary btn-lg btn-block" id="claim-daily-btn">KLAIM</button>
    </div>
  `;

  const { close } = showModal(content, { title: 'Daily Login Bonus', closable: false });

  content.querySelector('#claim-daily-btn').addEventListener('click', () => {
    const result = claimDailyLogin();
    if (result.success) {
      coinRain(content.querySelector('#login-bonus-area'));
      showToast(`+${result.coinReward} coin! Streak: ${result.loginStreak} hari`, 'success');
      setTimeout(close, 1000);
    }
  });
}
