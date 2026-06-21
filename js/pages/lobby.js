import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { showModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { countUp, coinRain, staggerFadeIn } from '../utils/animation.js';
import { formatNumber, getToday, formatDate } from '../utils/format.js';
import { claimDailyLogin, getDailyMissions, claimMissionReward, getAchievementsList, getCatalog } from '../api.js';
import { renderIcon } from '../components/emotes.js';

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

  const wr = winRate(user.stats.wins, user.stats.totalGames);

  content.innerHTML = `
    <!-- ═══ HERO BANNER ═══ -->
    <div class="card card--premium" style="display:flex;align-items:center;gap:var(--sp-6);margin-bottom:var(--sp-6);padding:var(--sp-6);flex-wrap:wrap;">
      <div class="character-container character-idle" style="flex-shrink:0;width:100px;height:150px;display:inline-flex;align-items:center;justify-content:center;">
        ${renderCharacter(user.activeCharacter, 'medium')}
      </div>
      <div style="flex:1;min-width:200px;">
        <div style="font-family:var(--font-mono);font-size:8px;color:var(--text-muted);letter-spacing:0.25em;text-transform:uppercase;margin-bottom:4px;">VELVET NOIR CASINO CLUB</div>
        <h1 class="text-display text-gold" style="font-size:28px;margin-bottom:var(--sp-1);">${user.username}</h1>
        <div style="font-family:var(--font-heading);font-size:13px;color:var(--text-secondary);margin-bottom:var(--sp-3);">${getCharacterName(user.activeCharacter)} · <span style="color:var(--text-muted);">${charInfo ? charInfo.skill : ''}</span></div>
        <div style="display:flex;align-items:center;gap:var(--sp-5);flex-wrap:wrap;">
          <div class="coin-display" style="font-size:24px;"><div class="coin-icon coin-icon--lg"></div><span id="coin-count">0</span></div>
          <button class="btn btn-primary btn-lg" onclick="location.hash='#/matchmaking'" style="letter-spacing:0.08em;">MAIN SEKARANG</button>
        </div>
      </div>
    </div>

    <!-- ═══ QUICK STATS ROW ═══ -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--sp-3);margin-bottom:var(--sp-6);" id="stats-grid">
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
        <div class="stat-card-value">${wr}%</div>
      </div>
    </div>

    <!-- ═══ MAIN GRID: Missions | Character | Achievements ═══ -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--sp-5);align-items:start;">

      <!-- Column 1: Daily Missions -->
      <div class="card" style="padding:var(--sp-5);">
        <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:var(--sp-4);">
          <div style="width:4px;height:16px;background:var(--gold-gradient);border-radius:2px;"></div>
          <h3 class="text-label text-secondary" style="margin:0;">MISI HARIAN</h3>
        </div>
        <div class="flex flex-col gap-3" id="missions-list">
          ${missions.map(m => `
            <div style="padding-bottom:var(--sp-3);border-bottom:1px solid var(--border-default);">
              <div class="flex justify-between items-center" style="margin-bottom:6px;">
                <span style="font-weight:600;font-size:13px;">${m.name}</span>
                <span class="coin-display" style="font-size:12px;"><div class="coin-icon coin-icon--sm"></div>${m.reward}</span>
              </div>
              <div class="progress" style="margin-bottom:6px;height:4px;">
                <div class="progress-bar progress-bar--green" style="width:${Math.min(m.progress / m.target * 100, 100)}%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-secondary">${m.progress}/${m.target}</span>
                ${m.completed && !m.claimed
                  ? `<button class="btn btn-primary btn-sm claim-mission-btn" data-mission="${m.id}" style="padding:4px 12px;font-size:10px;">Klaim</button>`
                  : m.claimed
                    ? '<span class="badge badge--green" style="font-size:9px;">Diklaim</span>'
                    : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Column 2: Active Character -->
      <div class="card card--premium" style="padding:var(--sp-5);text-align:center;">
        <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:var(--sp-4);justify-content:center;">
          <div style="width:4px;height:16px;background:var(--gold-gradient);border-radius:2px;"></div>
          <h3 class="text-label text-secondary" style="margin:0;">KARAKTER AKTIF</h3>
        </div>
        <div class="character-container character-idle" style="width:120px;height:180px;margin:0 auto var(--sp-4);display:inline-flex;align-items:center;justify-content:center;">
          ${renderCharacter(user.activeCharacter, 'large')}
        </div>
        <div style="font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--text-gold);margin-bottom:4px;">${getCharacterName(user.activeCharacter)}</div>
        <div class="text-xs text-secondary" style="margin-bottom:var(--sp-4);">${charInfo ? charInfo.skill : ''}</div>
        <div style="display:flex;gap:var(--sp-2);justify-content:center;">
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/inventory'">Inventory</button>
          <button class="btn btn-ghost btn-sm" onclick="location.hash='#/shop'">Shop</button>
        </div>
      </div>

      <!-- Column 3: Achievements -->
      <div class="card" style="padding:var(--sp-5);">
        <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:var(--sp-4);">
          <div style="width:4px;height:16px;background:var(--gold-gradient);border-radius:2px;"></div>
          <h3 class="text-label text-secondary" style="margin:0;">ACHIEVEMENT</h3>
        </div>
        ${recentAchievements.length > 0
          ? `<div class="flex flex-col gap-3">
              ${recentAchievements.map(ua => {
                const ach = achievements.find(a => a.id === ua.id);
                return ach ? `
                  <div style="display:flex;align-items:center;gap:var(--sp-3);padding-bottom:var(--sp-3);border-bottom:1px solid var(--border-default);">
                    <div style="width:36px;height:36px;background:rgba(212,160,23,0.1);border:1px solid var(--border-gold);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${renderIcon('icon_trophy', 18)}</div>
                    <div style="flex:1;min-width:0;">
                      <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ach.name}</div>
                      <div class="text-xs text-secondary">${formatDate(ua.unlockedAt)}</div>
                    </div>
                  </div>
                ` : '';
              }).join('')}
            </div>`
          : `<div style="text-align:center;padding:var(--sp-6) 0;color:var(--text-muted);">
              <div style="margin-bottom:var(--sp-2);">${renderIcon('icon_lock', 32)}</div>
              <p style="font-size:13px;">Belum ada achievement</p>
              <p style="font-size:11px;margin-top:4px;">Mainkan game untuk membuka!</p>
            </div>`
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
      <div style="margin-bottom:var(--sp-3);">${renderIcon('icon_gift', 48)}</div>
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
