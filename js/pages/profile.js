import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { getAchievementsList } from '../api.js';
import { apiCall } from '../config.js';
import { getGameHistory } from '../utils/storage.js';
import { formatNumber, formatDate, winRate } from '../utils/format.js';
import { staggerFadeIn, countUp } from '../utils/animation.js';
import { renderIcon } from '../components/emotes.js';

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
        <div style="font-family:var(--font-mono);font-size:8px;color:var(--text-muted);letter-spacing:0.25em;text-transform:uppercase;margin-bottom:var(--sp-1);">PROFIL PEMAIN</div>
        <h1 class="text-display text-gold" style="margin-bottom:var(--sp-2);font-size:28px;">${user.username}</h1>
        <div class="flex gap-2 items-center" style="margin-bottom:var(--sp-3);flex-wrap:wrap;">
          <span class="badge badge--gold">${getCharacterName(user.activeCharacter)}</span>
          <span class="badge badge--muted">${user.activeSkin}</span>
        </div>
        <div class="coin-display" style="font-size:24px;margin-bottom:var(--sp-3);">
          <div class="coin-icon coin-icon--lg"></div>
          <span id="profile-coin">0</span>
        </div>
        <div class="text-sm text-secondary">Bergabung: ${formatDate(user.createdAt)}</div>
        <button class="btn btn-secondary btn-sm" style="margin-top:var(--sp-3);" id="btn-edit-profile">Ubah Profil</button>
      </div>
    </div>

    <!-- Edit Profile Panel (hidden by default) -->
    <div id="edit-profile-panel" class="card" style="display:none;margin-bottom:var(--sp-7);padding:var(--sp-5);">
      <h3 style="font-family:var(--font-heading);font-size:18px;color:var(--text-gold);margin-bottom:var(--sp-4);">Ubah Profil</h3>
      <div class="input-group">
        <label class="input-label">Username Baru</label>
        <input class="input" type="text" id="edit-username" value="${user.username}" minlength="3" maxlength="20" placeholder="Username baru">
        <div class="input-error-msg" id="edit-username-error"></div>
      </div>
      <div class="input-group">
        <label class="input-label">Password Baru (kosongkan jika tidak ingin ubah)</label>
        <input class="input" type="password" id="edit-password" placeholder="Password baru (min 6 karakter)" minlength="6">
        <div class="input-error-msg" id="edit-password-error"></div>
      </div>
      <div class="input-group">
        <label class="input-label">Konfirmasi Password Baru</label>
        <input class="input" type="password" id="edit-password-confirm" placeholder="Ulangi password baru">
        <div class="input-error-msg" id="edit-confirm-error"></div>
      </div>
      <div class="flex gap-3" style="margin-top:var(--sp-4);">
        <button class="btn btn-primary" id="btn-save-profile">SIMPAN</button>
        <button class="btn btn-ghost" id="btn-cancel-edit">Batal</button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4);">
      <div style="height:1px;width:20px;background:linear-gradient(90deg,transparent,var(--border-gold));"></div>
      <h3 class="text-label text-secondary" style="margin:0;">STATISTIK LENGKAP</h3>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,var(--border-gold),transparent);"></div>
    </div>
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
    <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4);">
      <div style="height:1px;width:20px;background:linear-gradient(90deg,transparent,var(--border-gold));"></div>
      <h3 class="text-label text-secondary" style="margin:0;">ACHIEVEMENT</h3>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,var(--border-gold),transparent);"></div>
    </div>
    <div class="grid grid-4" style="margin-bottom:var(--sp-7);" id="ach-grid">
      ${allAchievements.map(ach => {
        const unlocked = user.achievements.find(a => a.id === ach.id);
        return `
          <div class="card ${unlocked ? 'card--premium' : ''}" style="text-align:center;padding:var(--sp-4);${unlocked ? '' : 'opacity:0.4;'}">
            <div style="margin-bottom:var(--sp-2);">${unlocked ? renderIcon('icon_trophy', 32) : renderIcon('icon_lock', 32)}</div>
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
    <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4);">
      <div style="height:1px;width:20px;background:linear-gradient(90deg,transparent,var(--border-gold));"></div>
      <h3 class="text-label text-secondary" style="margin:0;">RIWAYAT GAME</h3>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,var(--border-gold),transparent);"></div>
    </div>
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

  // Edit profile handlers
  const editBtn = content.querySelector('#btn-edit-profile');
  const editPanel = content.querySelector('#edit-profile-panel');
  const cancelBtn = content.querySelector('#btn-cancel-edit');
  const saveBtn = content.querySelector('#btn-save-profile');

  if (editBtn && editPanel) {
    editBtn.addEventListener('click', () => {
      editPanel.style.display = editPanel.style.display === 'none' ? 'block' : 'none';
    });
  }
  if (cancelBtn && editPanel) {
    cancelBtn.addEventListener('click', () => { editPanel.style.display = 'none'; });
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const newUsername = content.querySelector('#edit-username').value.trim();
      const newPassword = content.querySelector('#edit-password').value;
      const confirmPass = content.querySelector('#edit-password-confirm').value;

      content.querySelectorAll('.input-error-msg').forEach(e => e.textContent = '');
      content.querySelectorAll('.input').forEach(i => i.classList.remove('input--error'));

      let hasError = false;
      if (newUsername.length < 3) {
        content.querySelector('#edit-username-error').textContent = 'Username minimal 3 karakter';
        content.querySelector('#edit-username').classList.add('input--error');
        hasError = true;
      }
      if (newPassword && newPassword.length < 6) {
        content.querySelector('#edit-password-error').textContent = 'Password minimal 6 karakter';
        content.querySelector('#edit-password').classList.add('input--error');
        hasError = true;
      }
      if (newPassword && newPassword !== confirmPass) {
        content.querySelector('#edit-confirm-error').textContent = 'Password tidak sama';
        content.querySelector('#edit-password-confirm').classList.add('input--error');
        hasError = true;
      }
      if (hasError) return;

      saveBtn.disabled = true;
      saveBtn.textContent = 'Menyimpan...';

      const body = { username: newUsername };
      if (newPassword) body.password = newPassword;

      const res = await apiCall('PUT', `/users/${user.id}/profile`, body);
      if (res.error) {
        const msg = res.message || 'Gagal menyimpan';
        if (msg.toLowerCase().includes('username')) {
          content.querySelector('#edit-username-error').textContent = msg;
        } else {
          content.querySelector('#edit-password-error').textContent = msg;
        }
        saveBtn.disabled = false;
        saveBtn.textContent = 'SIMPAN';
        return;
      }

      user.username = newUsername;
      if (res.data?.user) Object.assign(user, res.data.user);
      state.persistUser();

      // Also update localStorage offline user
      const { saveUser } = await import('../utils/storage.js');
      if (saveUser) saveUser(user);
      if (newPassword) {
        user.passwordHash = btoa(newPassword);
        state.persistUser();
      }

      editPanel.style.display = 'none';
      renderProfileContent();

      import('../components/toast.js').then(m => m.showToast('Profil berhasil diubah!', 'success'));
    });
  }

  } // end renderProfileContent

  return () => { if (navCleanup) navCleanup(); };
}
