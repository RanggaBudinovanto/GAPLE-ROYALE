import state from './state.js';

const routes = {};
let currentCleanup = null;

export function registerRoute(hash, loader) {
  routes[hash] = loader;
}

export async function navigate(hash, params = {}) {
  if (!hash || hash === '#/' || hash === '#') hash = '#/splash';

  const baseHash = hash.split('/').slice(0, 2).join('/');

  const token = state.user;
  const publicRoutes = ['#/splash', '#/login'];
  if (!token && !publicRoutes.includes(baseHash)) {
    return navigate('#/login');
  }

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const loader = routes[baseHash] || routes['#/lobby'];
  if (!loader) return;

  const hashParts = hash.split('/');
  const routeParams = hashParts.length > 2 ? hashParts.slice(2).join('/') : null;

  try {
    const module = await loader();
    const app = document.getElementById('app');
    app.innerHTML = '';

    if (module.render) {
      const cleanup = module.render(app, { ...params, routeParam: routeParams });
      if (typeof cleanup === 'function') currentCleanup = cleanup;
    }
  } catch (err) {
    console.error('Route error:', err);
    const app = document.getElementById('app');
    app.innerHTML = `<div class="page-container text-center" style="padding-top:100px">
      <h2 class="text-heading text-gold">Terjadi Kesalahan</h2>
      <p class="text-secondary" style="margin-top:16px">${err.message}</p>
      <button class="btn btn-primary" style="margin-top:24px" onclick="location.hash='#/lobby'">Kembali ke Lobby</button>
    </div>`;
  }
}

export function initRouter() {
  registerRoute('#/splash', () => import('./pages/splash.js'));
  registerRoute('#/login', () => import('./pages/auth.js'));
  registerRoute('#/lobby', () => import('./pages/lobby.js'));
  registerRoute('#/shop', () => import('./pages/shop.js'));
  registerRoute('#/inventory', () => import('./pages/inventory.js'));
  registerRoute('#/matchmaking', () => import('./pages/matchmaking.js'));
  registerRoute('#/game', () => import('./pages/game.js'));
  registerRoute('#/result', () => import('./pages/result.js'));
  registerRoute('#/leaderboard', () => import('./pages/leaderboard.js'));
  registerRoute('#/profile', () => import('./pages/profile.js'));

  window.addEventListener('hashchange', () => navigate(location.hash));
  navigate(location.hash || '#/splash');
}
