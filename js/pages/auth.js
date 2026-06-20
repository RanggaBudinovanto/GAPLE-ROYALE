import { register, login, createJWT } from '../auth.js';
import state from '../state.js';
import { showToast } from '../components/toast.js';
import { renderDomino } from '../components/domino-card.js';
import { playClick, playHover } from '../utils/sfx.js';
import { apiCall } from '../config.js';
import { setItem, getAllUsers } from '../utils/storage.js';


function renderGoldCoin() {
  return `
    <div class="casino-coin" style="width:36px;height:36px;">
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="url(#goldGrad)" stroke="#FFE875" stroke-width="1.5"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#996500" stroke-width="1" stroke-dasharray="3 2"/>
        <circle cx="20" cy="20" r="10" fill="url(#goldDeep)"/>
        <text x="20" y="24.5" fill="#FFE875" font-size="13" font-weight="900" text-anchor="middle" font-family="var(--font-display)">$</text>
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE875"/>
            <stop offset="50%" stop-color="#d4a017"/>
            <stop offset="100%" stop-color="#996500"/>
          </linearGradient>
          <linearGradient id="goldDeep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#996500"/>
            <stop offset="100%" stop-color="#d4a017"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  `;
}

function renderPokerChip() {
  return `
    <div class="casino-chip" style="width:38px;height:38px;">
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#c0392b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="20" cy="20" r="13" fill="none" stroke="#ffffff" stroke-dasharray="4 2" stroke-width="1.5"/>
        <circle cx="20" cy="20" r="9" fill="#141a10" stroke="#FFE875" stroke-width="1"/>
        <text x="20" y="23.5" fill="#FFE875" font-size="9" font-weight="700" text-anchor="middle" font-family="var(--font-display)">100</text>
      </svg>
    </div>
  `;
}

export function render(container) {
  // Generate dynamic floating items for premium background
  const itemsCount = 50;
  const itemsHtml = [];

  for (let i = 0; i < itemsCount; i++) {
    // Alternate item types: 0 = Domino, 1 = Gold Coin, 2 = Poker Chip
    const type = i % 3;
    
    // Position parameters (distributed across the page area)
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    
    // Layer assignment:
    // BG (Background): small, blurry, slow drift, small mouse responsiveness
    // MG (Midground): normal size, sharp, medium speed, highly interactable (hover/click)
    // FG (Foreground): large, very blurry, fast drift, high mouse responsiveness
    let layerClass = 'layer-bg';
    let scale = 0.45 + Math.random() * 0.25;
    let opacity = 0.05 + Math.random() * 0.04;
    let blur = 'blur(1.5px)';
    let duration = 28 + Math.random() * 15;
    let pf = 10; // parallax factor
    
    if (i % 6 === 0) { // Foreground (approx 16%)
      layerClass = 'layer-fg';
      scale = 1.35 + Math.random() * 0.35;
      opacity = 0.02 + Math.random() * 0.02;
      blur = 'blur(5px)';
      duration = 18 + Math.random() * 8;
      pf = 45;
    } else if (i % 2 === 0) { // Midground (approx 42%)
      layerClass = 'layer-mg';
      scale = 0.8 + Math.random() * 0.25;
      opacity = 0.12 + Math.random() * 0.08;
      blur = 'none';
      duration = 22 + Math.random() * 10;
      pf = 24;
    }

    const rotate = (Math.random() - 0.5) * 360;
    const tx = (Math.random() - 0.5) * 80;
    const ty = (Math.random() - 0.5) * 140;
    const rotStart = rotate;
    const rotEnd = rotate + (Math.random() - 0.5) * 90;
    const delay = Math.random() * -30;

    let contentHtml = '';
    if (type === 0) {
      const topVal = Math.floor(Math.random() * 7);
      const botVal = Math.floor(Math.random() * 7);
      const skin = Math.random() > 0.65 ? 'royal_gold' : 'classic';
      contentHtml = renderDomino(topVal, botVal, { skin });
    } else if (type === 1) {
      contentHtml = renderGoldCoin();
    } else {
      contentHtml = renderPokerChip();
    }

    itemsHtml.push(`
      <div class="floating-bg-item ${layerClass}" style="
        position:absolute;
        left:${left}%;
        top:${top}%;
        opacity:${opacity};
        filter:${blur};
        animation: floatBgItem ${duration}s ease-in-out ${delay}s infinite alternate;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --rot-start: ${rotStart}deg;
        --rot-end: ${rotEnd}deg;
        --pf: ${pf}px;
        z-index: 0;
      " data-rot="${rotStart}">
        <div class="floating-item-inner" style="
          transform: scale(${scale}) rotate(${rotStart}deg);
          --rot: ${rotStart}deg;
        ">
          ${contentHtml}
        </div>
      </div>
    `);
  }

  // Generate floating gold particles
  const particleCount = 45;
  const particlesHtml = [];
  for (let i = 0; i < particleCount; i++) {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = 1.5 + Math.random() * 3;
    const delay = Math.random() * -15;
    const duration = 10 + Math.random() * 12;
    const opacity = 0.08 + Math.random() * 0.15;
    const tx = (Math.random() - 0.5) * 40;

    particlesHtml.push(`
      <div style="
        position:absolute;
        left:${left}%;
        top:${top}%;
        width:${size}px;
        height:${size}px;
        background:var(--gold-bright);
        border-radius:50%;
        opacity:${opacity};
        filter:blur(0.5px);
        animation: floatBgParticle ${duration}s linear ${delay}s infinite;
        --ptx: ${tx}px;
        --p-op: ${opacity};
        pointer-events:none;
      "></div>
    `);
  }

  container.innerHTML = `
    <div class="auth-wrapper" style="
      min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:var(--bg-felt);
      background-image:
        radial-gradient(circle at calc(50% + var(--mouse-x, 0) * 15%) calc(50% + var(--mouse-y, 0) * 15%), rgba(20, 90, 42, 0.5) 0%, transparent 50%),
        radial-gradient(ellipse at 20% 20%, rgba(245,200,66,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(245,200,66,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at top left, rgba(0,0,0,0.6) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(0,0,0,0.6) 0%, transparent 50%);
      padding:var(--sp-5);position:relative;overflow:hidden;
    ">
      <style>
        @keyframes floatBgItem {
          0% { transform: translate(0, 0) rotate(var(--rot-start, 0deg)); }
          100% { transform: translate(var(--tx, 20px), var(--ty, -40px)) rotate(var(--rot-end, 15deg)); }
        }
        @keyframes floatBgParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--p-op, 0.2); }
          90% { opacity: var(--p-op, 0.2); }
          100% { transform: translateY(-150px) translateX(var(--ptx, 15px)); opacity: 0; }
        }
        @keyframes spotlightSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes authLogoGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(245,200,66,0.3), 0 0 60px rgba(245,200,66,0.1); filter: brightness(1); }
          50% { text-shadow: 0 0 50px rgba(245,200,66,0.5), 0 0 100px rgba(245,200,66,0.2); filter: brightness(1.1); }
        }
        @keyframes ornamentFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes cardSlideLeft {
          from { opacity: 0; transform: translateX(-40px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes cardSlideRight {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }

        .floating-bg-item {
          pointer-events: none;
          margin-left: calc(var(--mouse-x, 0) * var(--pf, 10px));
          margin-top: calc(var(--mouse-y, 0) * var(--pf, 10px));
          transition: margin 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .layer-mg { pointer-events: auto !important; }
        .floating-item-inner {
          transition: transform var(--dur-normal) var(--ease-spring), filter var(--dur-normal) ease, opacity var(--dur-normal) ease;
          transform-origin: center center;
          display: flex; align-items: center; justify-content: center;
        }
        .layer-mg:hover { z-index: 10 !important; opacity: 1 !important; }
        .layer-mg:hover .floating-item-inner {
          transform: scale(1.3) rotate(calc(var(--rot) + 15deg)) !important;
          filter: drop-shadow(0 0 16px var(--gold-bright)) brightness(1.2);
          cursor: pointer;
        }
        .casino-coin, .casino-chip {
          display: flex; align-items: center; justify-content: center;
          filter: drop-shadow(2px 3px 6px rgba(0,0,0,0.55));
          user-select: none;
        }
        .casino-coin svg, .casino-chip svg { display: block; }

        .auth-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; max-width: 460px;
        }
        .auth-card {
          width: 100%;
          background: linear-gradient(135deg, rgba(20, 26, 16, 0.92), rgba(9, 24, 14, 0.95));
          border: 1.5px solid var(--border-gold);
          border-radius: var(--radius-xl);
          padding: var(--sp-6) var(--sp-5);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(245,200,66,0.05);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          position: relative; overflow: hidden;
          animation: scaleIn 0.5s var(--ease-spring) forwards;
        }
        .auth-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold-bright), transparent);
          opacity: 0.6;
        }

        .auth-tabs {
          display: flex; width: 100%; margin-bottom: var(--sp-5);
          border-bottom: 2px solid var(--border-default);
          position: relative;
        }
        .auth-tab {
          flex: 1; padding: var(--sp-3) var(--sp-4);
          background: none; border: none; cursor: pointer;
          font-family: var(--font-display); font-size: 15px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted);
          transition: color 0.3s ease;
          position: relative;
        }
        .auth-tab::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px;
          background: var(--gold-bright);
          transform: scaleX(0); transition: transform 0.3s var(--ease-spring);
        }
        .auth-tab--active {
          color: var(--text-gold);
        }
        .auth-tab--active::after {
          transform: scaleX(1);
        }
        .auth-tab:hover:not(.auth-tab--active) {
          color: var(--text-secondary);
        }
      </style>

      <!-- Spotlight sweep effect -->
      <div style="position:absolute;top:-50%;left:-50%;width:200%;height:200%;pointer-events:none;z-index:0;">
        <div style="position:absolute;top:50%;left:50%;width:300px;height:600px;
          background:conic-gradient(from 0deg, transparent 85%, rgba(245,200,66,0.03) 90%, transparent 95%);
          transform-origin:center center;animation:spotlightSweep 20s linear infinite;"></div>
      </div>

      <!-- Decorative floating items -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;">
        ${itemsHtml.join('')}
      </div>

      <!-- Floating Gold Particles -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;">
        ${particlesHtml.join('')}
      </div>

      <!-- Vignette overlay -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;
        background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%);"></div>

      <div class="auth-content">
        <!-- Grand Logo -->
        <div style="text-align:center;margin-bottom:var(--sp-7);position:relative;">
          <div style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:0.3em;text-transform:uppercase;margin-bottom:var(--sp-2);animation:ornamentFade 3s ease-in-out infinite;">
            &#9830; &#9830; &#9830; VELVET NOIR CASINO CLUB &#9830; &#9830; &#9830;
          </div>
          <h1 style="font-family:var(--font-display);font-size:42px;font-weight:900;color:var(--text-gold);letter-spacing:0.1em;margin:0;animation:authLogoGlow 4s ease-in-out infinite;
            background:linear-gradient(90deg, #ffe875, #f5c842, #d4a017, #f5c842, #ffe875);background-size:200% auto;
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">GAPLE ROYALE</h1>
          <p style="font-size:14px;color:var(--text-secondary);margin-top:6px;font-style:italic;font-family:var(--font-body);letter-spacing:0.05em;">Premium Casino Domino Experience</p>
          <div style="margin-top:var(--sp-3);display:flex;align-items:center;justify-content:center;gap:var(--sp-3);">
            <div style="flex:1;max-width:80px;height:1px;background:linear-gradient(90deg, transparent, var(--border-gold));"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" fill="#d4a017" opacity="0.6"/>
            </svg>
            <div style="flex:1;max-width:80px;height:1px;background:linear-gradient(90deg, var(--border-gold), transparent);"></div>
          </div>
        </div>

        <!-- Single Card with Tabs -->
        <div class="auth-card">
          <div class="auth-tabs">
            <button class="auth-tab auth-tab--active" id="tab-login">Masuk</button>
            <button class="auth-tab" id="tab-register">Daftar</button>
          </div>

          <!-- Login Form -->
          <form id="form-login" autocomplete="off">
            <div class="input-group">
              <label class="input-label">Username</label>
              <input class="input" type="text" id="login-username" placeholder="Nama Pengguna" required minlength="3" autocomplete="username">
              <div class="input-error-msg" id="login-username-error"></div>
            </div>
            <div class="input-group">
              <label class="input-label">Password</label>
              <input class="input" type="password" id="login-password" placeholder="Kata Sandi" required minlength="6" autocomplete="current-password">
              <div class="input-error-msg" id="login-password-error"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-login" style="margin-top:var(--sp-5);letter-spacing:0.08em;font-weight:800;">MASUK KE MEJA</button>
            <p style="text-align:center;margin-top:var(--sp-4);font-size:var(--text-sm);color:var(--text-secondary);">
              Belum punya akun? <a href="#" id="link-to-register" style="color:var(--text-gold);font-weight:600;">Daftar</a>
            </p>
          </form>

          <!-- Register Form -->
          <form id="form-register" class="hidden" autocomplete="off">
            <div class="input-group">
              <label class="input-label">Username</label>
              <input class="input" type="text" id="reg-username" placeholder="Nama Pengguna" required minlength="3" maxlength="20" autocomplete="off">
              <div class="input-error-msg" id="reg-username-error"></div>
            </div>
            <div class="input-group">
              <label class="input-label">Email</label>
              <input class="input" type="email" id="reg-email" placeholder="Email" required autocomplete="off">
              <div class="input-error-msg" id="reg-email-error"></div>
            </div>
            <div class="input-group">
              <label class="input-label">Password</label>
              <input class="input" type="password" id="reg-password" placeholder="Kata Sandi (min 6 karakter)" required minlength="6" autocomplete="new-password">
              <div class="input-error-msg" id="reg-password-error"></div>
            </div>
            <div class="input-group">
              <label class="input-label">Konfirmasi Password</label>
              <input class="input" type="password" id="reg-confirm" placeholder="Ulangi Kata Sandi" required autocomplete="new-password">
              <div class="input-error-msg" id="reg-confirm-error"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-register" style="margin-top:var(--sp-5);letter-spacing:0.08em;font-weight:800;">BUAT AKUN BARU</button>
            <p style="text-align:center;margin-top:var(--sp-4);font-size:var(--text-sm);color:var(--text-secondary);">
              Sudah punya akun? <a href="#" id="link-to-login" style="color:var(--text-gold);font-weight:600;">Masuk</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;

  // Attach mouse parallax listeners to wrapper
  const wrapper = container.querySelector('.auth-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      // Mouse coordinates normalized to range [-1, 1] relative to center
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      wrapper.style.setProperty('--mouse-x', x);
      wrapper.style.setProperty('--mouse-y', y);
    });
  }

  // Attach hover and click sound/animation listeners to midground floating items
  const interactables = container.querySelectorAll('.layer-mg');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playHover();
    });
    el.addEventListener('click', () => {
      playClick();
      const inner = el.querySelector('.floating-item-inner');
      if (inner) {
        // Trigger 360-degree rotation spin animation
        const currentRot = parseFloat(el.dataset.rot || '0');
        const newRot = currentRot + 360;
        el.dataset.rot = newRot;
        
        inner.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease';
        inner.style.setProperty('--rot', `${newRot}deg`);
        
        // Remove temporary transition speed after spin completes
        setTimeout(() => {
          inner.style.transition = '';
        }, 800);
      }
    });
  });

  const tabLogin = container.querySelector('#tab-login');
  const tabRegister = container.querySelector('#tab-register');
  const formLogin = container.querySelector('#form-login');
  const formRegister = container.querySelector('#form-register');

  function switchTab(tab) {
    tabLogin.classList.toggle('auth-tab--active', tab === 'login');
    tabRegister.classList.toggle('auth-tab--active', tab === 'register');
    formLogin.classList.toggle('hidden', tab !== 'login');
    formRegister.classList.toggle('hidden', tab !== 'register');
    clearErrors();
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));
  container.querySelector('#link-to-register').addEventListener('click', (e) => { e.preventDefault(); switchTab('register'); });
  container.querySelector('#link-to-login').addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const username = container.querySelector('#login-username').value.trim();
    const password = container.querySelector('#login-password').value;

    if (username.length < 3) return showFieldError('login-username', 'Username minimal 3 karakter');
    if (password.length < 6) return showFieldError('login-password', 'Password minimal 6 karakter');

    // First try real backend login
    const res = await apiCall('POST', '/auth/login', { username, password });
    if (res.error) {
      if (res.error === 'NETWORK_ERROR') {
        showToast('Koneksi ke backend gagal. Mencoba mode offline/simulasi...', 'warning');
        const result = login(username, password);
        if (result.error) {
          showToast(result.message, 'error');
          return;
        }
        state.init();
        showToast('Masuk dalam mode offline (PvP dinonaktifkan)', 'success');
        location.hash = '#/lobby';
        return;
      } else {
        showToast(res.message || 'Gagal login ke backend', 'error');
        return;
      }
    }

    // Backend login succeeded!
    const backendToken = res.data.token;
    const backendUser = res.data.user;

    sessionStorage.setItem('backend_token', backendToken);

    // Fetch user inventory from backend
    const invRes = await apiCall('GET', `/users/${backendUser.id}/inventory`);
    const backendInventory = (!invRes.error && invRes.data && invRes.data.inventory)
      ? invRes.data.inventory.map(item => item.itemId)
      : [backendUser.activeCharacter || 'bocah_pemula', backendUser.activeSkin || 'classic'];

    // Sync to local storage
    const users = getAllUsers();
    let localUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.id === backendUser.id);
    if (!localUser) {
      localUser = {
        id: backendUser.id,
        username: backendUser.username,
        email: backendUser.email || `${username}@gmail.com`,
        passwordHash: btoa(password),
        createdAt: new Date().toISOString(),
        coin: backendUser.coin || 1000,
        activeCharacter: backendUser.activeCharacter || 'bocah_pemula',
        activeSkin: backendUser.activeSkin || 'classic',
        inventory: backendInventory,
        stats: {
          wins: 0, losses: 0, totalGames: 0, totalCoinEarned: backendUser.coin || 1000,
          longestStreak: 0, currentStreak: 0, powerupsUsed: 0, chatMessagesSent: 0
        },
        achievements: [], lastLogin: null, loginStreak: 0, dailyMissions: {}, powerups: {}
      };
      if (!invRes.error && invRes.data && invRes.data.inventory) {
        invRes.data.inventory.forEach(item => {
          if (item.itemType === 'powerup') {
            localUser.powerups[item.itemId] = item.quantity;
          }
        });
      }
      users.push(localUser);
    } else {
      localUser.id = backendUser.id;
      localUser.coin = backendUser.coin;
      localUser.activeCharacter = backendUser.activeCharacter;
      localUser.activeSkin = backendUser.activeSkin;
      localUser.inventory = backendInventory;
      localUser.passwordHash = btoa(password);
      localUser.powerups = {};
      if (!invRes.error && invRes.data && invRes.data.inventory) {
        invRes.data.inventory.forEach(item => {
          if (item.itemType === 'powerup') {
            localUser.powerups[item.itemId] = item.quantity;
          }
        });
      }
    }
    setItem('users', users);

    const localToken = createJWT(localUser.id);
    setItem('token', localToken);

    state.init();
    showToast('Selamat datang kembali!', 'success');
    location.hash = '#/lobby';
  });

  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const username = container.querySelector('#reg-username').value.trim();
    const email = container.querySelector('#reg-email').value.trim();
    const password = container.querySelector('#reg-password').value;
    const confirm = container.querySelector('#reg-confirm').value;

    let hasError = false;
    if (username.length < 3) { showFieldError('reg-username', 'Username minimal 3 karakter'); hasError = true; }
    else if (!/^[a-zA-Z0-9]+$/.test(username)) { showFieldError('reg-username', 'Hanya huruf dan angka'); hasError = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('reg-email', 'Format email tidak valid'); hasError = true; }
    if (password.length < 6) { showFieldError('reg-password', 'Password minimal 6 karakter'); hasError = true; }
    if (password !== confirm) { showFieldError('reg-confirm', 'Password tidak sama'); hasError = true; }
    if (hasError) return;

    // First try real backend registration
    const res = await apiCall('POST', '/auth/register', { username, email, password });
    if (res.error) {
      if (res.error === 'NETWORK_ERROR') {
        showToast('Koneksi ke backend gagal. Mencoba mode offline/simulasi...', 'warning');
        const result = register(username, email, password);
        if (result.error) {
          if (result.error === 'USERNAME_TAKEN') showFieldError('reg-username', result.message);
          else if (result.error === 'EMAIL_TAKEN') showFieldError('reg-email', result.message);
          else showToast(result.message, 'error');
          return;
        }
        state.init();
        showToast('Akun dibuat offline (PvP dinonaktifkan)', 'success');
        location.hash = '#/lobby';
        return;
      } else {
        if (res.error === 'USERNAME_TAKEN') showFieldError('reg-username', res.message);
        else if (res.error === 'EMAIL_TAKEN') showFieldError('reg-email', res.message);
        else showToast(res.message || 'Gagal register ke backend', 'error');
        return;
      }
    }

    // Backend registration succeeded!
    const backendToken = res.data.token;
    const backendUser = res.data.user;

    sessionStorage.setItem('backend_token', backendToken);

    // Sync to local storage
    const users = getAllUsers();
    const localUser = {
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      passwordHash: btoa(password),
      createdAt: new Date().toISOString(),
      coin: backendUser.coin || 1000,
      activeCharacter: backendUser.activeCharacter || 'bocah_pemula',
      activeSkin: backendUser.activeSkin || 'classic',
      inventory: [backendUser.activeCharacter || 'bocah_pemula', backendUser.activeSkin || 'classic'],
      stats: {
        wins: 0, losses: 0, totalGames: 0, totalCoinEarned: backendUser.coin || 1000,
        longestStreak: 0, currentStreak: 0, powerupsUsed: 0, chatMessagesSent: 0
      },
      achievements: [], lastLogin: null, loginStreak: 0, dailyMissions: {}, powerups: {}
    };
    users.push(localUser);
    setItem('users', users);

    const localToken = createJWT(localUser.id);
    setItem('token', localToken);

    state.init();
    showToast('Akun berhasil dibuat! Selamat datang!', 'success');
    location.hash = '#/lobby';
  });

  function showFieldError(fieldId, msg) {
    const input = container.querySelector(`#${fieldId}`);
    const error = container.querySelector(`#${fieldId}-error`);
    if (input) input.classList.add('input--error');
    if (error) error.textContent = msg;
  }

  function clearErrors() {
    container.querySelectorAll('.input').forEach(i => i.classList.remove('input--error', 'input--valid'));
    container.querySelectorAll('.input-error-msg').forEach(e => e.textContent = '');
  }

  container.querySelectorAll('.input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('input--error');
      const errEl = container.querySelector(`#${input.id}-error`);
      if (errEl) errEl.textContent = '';
    });
  });
}

