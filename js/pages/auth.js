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
  let activeTab = 'login';

  // Generate dynamic floating items for premium background
  const itemsCount = 26;
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
  const particleCount = 20;
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
      background-image:radial-gradient(circle at calc(50% + var(--mouse-x, 0) * 15%) calc(50% + var(--mouse-y, 0) * 15%), rgba(20, 90, 42, 0.4) 0%, transparent 60%),
                       radial-gradient(ellipse at top left, rgba(0,0,0,0.5) 0%, transparent 50%),
                       radial-gradient(ellipse at top right, rgba(0,0,0,0.5) 0%, transparent 50%);
      padding:var(--sp-5);position:relative;overflow:hidden;
    ">
      <!-- Style injection for background animations -->
      <style>
        @keyframes floatBgItem {
          0% {
            transform: translate(0, 0) rotate(var(--rot-start, 0deg));
          }
          100% {
            transform: translate(var(--tx, 20px), var(--ty, -40px)) rotate(var(--rot-end, 15deg));
          }
        }
        @keyframes floatBgParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--p-op, 0.2);
          }
          90% {
            opacity: var(--p-op, 0.2);
          }
          100% {
            transform: translateY(-150px) translateX(var(--ptx, 15px));
            opacity: 0;
          }
        }

        .floating-bg-item {
          pointer-events: none;
          /* Apply mouse offset dynamically via margins to avoid conflicts with @keyframes transform */
          margin-left: calc(var(--mouse-x, 0) * var(--pf, 10px));
          margin-top: calc(var(--mouse-y, 0) * var(--pf, 10px));
          transition: margin 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .layer-mg {
          pointer-events: auto !important;
        }

        .floating-item-inner {
          transition: transform var(--dur-normal) var(--ease-spring), filter var(--dur-normal) ease, opacity var(--dur-normal) ease;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .layer-mg:hover {
          z-index: 10 !important;
          opacity: 1 !important;
        }
        .layer-mg:hover .floating-item-inner {
          transform: scale(1.3) rotate(calc(var(--rot) + 15deg)) !important;
          filter: drop-shadow(0 0 16px var(--gold-bright)) brightness(1.2);
          cursor: pointer;
        }

        .casino-coin, .casino-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(2px 3px 6px rgba(0,0,0,0.55));
          user-select: none;
        }
        .casino-coin svg, .casino-chip svg {
          display: block;
        }
      </style>

      <!-- Decorative floating items (Cards, Coins, Chips) -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;">
        ${itemsHtml.join('')}
      </div>

      <!-- Floating Gold Particles -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;">
        ${particlesHtml.join('')}
      </div>

      <div class="card card--glass" style="max-width:420px;width:100%;animation:scaleIn 0.4s var(--ease-spring);position:relative;z-index:1;">
        <!-- Logo -->
        <div style="text-align:center;margin-bottom:var(--sp-6);">
          <h1 style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--text-gold);letter-spacing:0.08em;">GAPLE ROYALE</h1>
          <p style="font-size:var(--text-sm);color:var(--text-muted);margin-top:4px;font-style:italic;">Premium Casino Domino</p>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin-bottom:var(--sp-5);">
          <button class="tab tab--active" id="tab-login" data-tab="login">Masuk</button>
          <button class="tab" id="tab-register" data-tab="register">Daftar</button>
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
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-login">MASUK KE MEJA</button>
          <p style="text-align:center;margin-top:var(--sp-4);font-size:var(--text-sm);color:var(--text-secondary);">
            Belum punya akun? <a href="#" id="link-to-register" style="color:var(--text-gold);">Daftar →</a>
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
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-register">BUAT AKUN BARU</button>
          <p style="text-align:center;margin-top:var(--sp-4);font-size:var(--text-sm);color:var(--text-secondary);">
            Sudah punya akun? <a href="#" id="link-to-login" style="color:var(--text-gold);">Masuk →</a>
          </p>
        </form>
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
    activeTab = tab;
    tabLogin.classList.toggle('tab--active', tab === 'login');
    tabRegister.classList.toggle('tab--active', tab === 'register');
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
        inventory: [backendUser.activeCharacter || 'bocah_pemula', backendUser.activeSkin || 'classic'],
        stats: {
          wins: 0, losses: 0, totalGames: 0, totalCoinEarned: backendUser.coin || 1000,
          longestStreak: 0, currentStreak: 0, powerupsUsed: 0, chatMessagesSent: 0
        },
        achievements: [], lastLogin: null, loginStreak: 0, dailyMissions: {}, powerups: {}
      };
      users.push(localUser);
    } else {
      localUser.id = backendUser.id;
      localUser.coin = backendUser.coin;
      localUser.activeCharacter = backendUser.activeCharacter;
      localUser.activeSkin = backendUser.activeSkin;
      localUser.passwordHash = btoa(password);
    }
    setItem('users', users);

    const localToken = createJWT(localUser.id);
    setItem('token', localToken);

    state.init();

    // Fetch full inventory from backend and sync to local state
    try {
      const invRes = await apiCall('GET', `/users/${backendUser.id}/inventory`, null, backendToken);
      if (!invRes.error && invRes.data?.inventory) {
        const fullInventory = invRes.data.inventory.map(item => item.itemId);
        // Always include free defaults
        if (!fullInventory.includes('bocah_pemula')) fullInventory.unshift('bocah_pemula');
        if (!fullInventory.includes('classic')) fullInventory.unshift('classic');
        // Merge with existing local inventory (to preserve offline purchases)
        const merged = Array.from(new Set([...(state.user.inventory || []), ...fullInventory]));
        state.user.inventory = merged;
        state.persistUser();
      }
    } catch (_) { /* non-fatal */ }

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

