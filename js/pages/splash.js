import state from '../state.js';
import { renderDomino } from '../components/domino-card.js';

export function render(container) {
  if (state.user) {
    state.syncWithBackend();
  }

  const floatingItems = [];
  for (let i = 0; i < 35; i++) {
    const type = i % 3;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const scale = 0.3 + Math.random() * 0.5;
    const opacity = 0.04 + Math.random() * 0.06;
    const dur = 15 + Math.random() * 20;
    const delay = Math.random() * -20;
    const rot = (Math.random() - 0.5) * 360;
    const tx = (Math.random() - 0.5) * 60;
    const ty = (Math.random() - 0.5) * 80;

    let content = '';
    if (type === 0) {
      const a = Math.floor(Math.random() * 7), b = Math.floor(Math.random() * 7);
      content = renderDomino(a, b, { skin: Math.random() > 0.5 ? 'royal_gold' : 'classic' });
    } else if (type === 1) {
      content = `<svg viewBox="0 0 40 40" width="36" height="36"><circle cx="20" cy="20" r="18" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/><circle cx="20" cy="20" r="13" fill="none" stroke="#996500" stroke-width="0.8" stroke-dasharray="3 2"/><text x="20" y="25" fill="#996500" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">$</text></svg>`;
    } else {
      content = `<svg viewBox="0 0 40 40" width="38" height="38"><circle cx="20" cy="20" r="18" fill="#c0392b" stroke="#fff" stroke-width="1.5"/><circle cx="20" cy="20" r="13" fill="none" stroke="#fff" stroke-dasharray="4 2" stroke-width="1.5"/><circle cx="20" cy="20" r="9" fill="#141a10" stroke="#f5c842" stroke-width="1"/><text x="20" y="24" fill="#f5c842" font-size="9" font-weight="700" text-anchor="middle" font-family="sans-serif">100</text></svg>`;
    }

    floatingItems.push(`<div style="position:absolute;left:${left}%;top:${top}%;opacity:${opacity};transform:scale(${scale}) rotate(${rot}deg);animation:splashFloat ${dur}s ease-in-out ${delay}s infinite alternate;--stx:${tx}px;--sty:${ty}px;pointer-events:none;">${content}</div>`);
  }

  const goldParticles = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const s = 1 + Math.random() * 3;
    const d = 8 + Math.random() * 12;
    const del = Math.random() * -10;
    const op = 0.1 + Math.random() * 0.25;
    goldParticles.push(`<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:var(--gold-bright);border-radius:50%;opacity:0;animation:splashParticle ${d}s linear ${del}s infinite;--sp-op:${op};pointer-events:none;"></div>`);
  }

  container.innerHTML = `
    <div class="splash-screen" style="
      position:fixed;inset:0;z-index:9999;
      background:#060806;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      overflow:hidden;
    ">
      <style>
        @keyframes splashFloat {
          0% { transform: translate(0,0) rotate(var(--rot,0deg)); }
          100% { transform: translate(var(--stx,20px), var(--sty,-30px)) rotate(calc(var(--rot,0deg) + 15deg)); }
        }
        @keyframes splashParticle {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: var(--sp-op, 0.2); }
          90% { opacity: var(--sp-op, 0.2); }
          100% { transform: translateY(-120px); opacity: 0; }
        }
        @keyframes splashSpotlight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes splashLogoReveal {
          0% { opacity:0; transform:scale(0.6); filter:blur(12px) brightness(2); letter-spacing:0.4em; }
          60% { opacity:1; transform:scale(1.05); filter:blur(0) brightness(1.3); letter-spacing:0.12em; }
          100% { opacity:1; transform:scale(1); filter:blur(0) brightness(1); letter-spacing:0.1em; }
        }
        @keyframes splashGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(245,200,66,0.3), 0 0 60px rgba(245,200,66,0.1); }
          50% { text-shadow: 0 0 60px rgba(245,200,66,0.6), 0 0 120px rgba(245,200,66,0.2); }
        }
        @keyframes splashSubReveal {
          0% { opacity:0; transform:translateY(20px); letter-spacing:0.5em; }
          100% { opacity:1; transform:translateY(0); letter-spacing:0.2em; }
        }
        @keyframes splashTagReveal {
          0% { opacity:0; transform:translateY(16px); }
          100% { opacity:0.7; transform:translateY(0); }
        }
        @keyframes splashOrnamentReveal {
          0% { opacity:0; width:0; }
          100% { opacity:0.5; width:80px; }
        }
        @keyframes splashProgressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes splashProgressGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(245,200,66,0.4); }
          50% { box-shadow: 0 0 14px rgba(245,200,66,0.7); }
        }
        @keyframes splashStarPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes splashFadeOut {
          0% { opacity:1; }
          100% { opacity:0; }
        }
      </style>

      <!-- BG: Dark felt with multiple gradient layers -->
      <div style="position:absolute;inset:0;background:
        radial-gradient(ellipse at center, rgba(20,90,42,0.2) 0%, transparent 60%),
        radial-gradient(ellipse at 30% 70%, rgba(245,200,66,0.04) 0%, transparent 40%),
        radial-gradient(ellipse at 70% 30%, rgba(245,200,66,0.03) 0%, transparent 40%);
        pointer-events:none;"></div>

      <!-- Rotating spotlight -->
      <div style="position:absolute;top:-60%;left:-60%;width:220%;height:220%;pointer-events:none;">
        <div style="position:absolute;top:50%;left:50%;width:400px;height:800px;
          background:conic-gradient(from 0deg, transparent 80%, rgba(245,200,66,0.03) 88%, transparent 96%);
          transform-origin:center center;animation:splashSpotlight 25s linear infinite;"></div>
      </div>

      <!-- Vignette -->
      <div style="position:absolute;inset:0;pointer-events:none;
        background:radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);"></div>

      <!-- Floating casino items -->
      <div style="position:absolute;inset:0;pointer-events:none;">
        ${floatingItems.join('')}
      </div>

      <!-- Gold particles -->
      <div style="position:absolute;inset:0;pointer-events:none;">
        ${goldParticles.join('')}
      </div>

      <!-- Center content -->
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 var(--sp-5);">

        <!-- Ornamental top -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:var(--sp-4);opacity:0;animation:splashSubReveal 0.8s 0.2s ease-out forwards;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4a017" opacity="0.5"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>
          <span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.35em;text-transform:uppercase;">VELVET NOIR CASINO CLUB</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4a017" opacity="0.5"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>
        </div>

        <!-- Main Logo -->
        <h1 id="splash-logo" style="
          font-family:var(--font-display);font-size:clamp(42px, 10vw, 72px);font-weight:900;
          margin:0;letter-spacing:0.1em;line-height:1;
          background:linear-gradient(90deg, #ffe875, #f5c842, #d4a017, #f5c842, #ffe875);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation: splashLogoReveal 1.2s cubic-bezier(0.16,1,0.3,1) forwards, splashGlow 3s 1.2s ease-in-out infinite, goldShimmer 4s 1.2s linear infinite;
          filter:drop-shadow(0 4px 20px rgba(245,200,66,0.3));
        ">GAPLE ROYALE</h1>

        <!-- Sub title -->
        <div style="opacity:0;animation:splashSubReveal 0.6s 0.6s ease-out forwards;margin-top:var(--sp-3);">
          <span style="font-family:var(--font-display);font-size:clamp(10px, 2vw, 13px);color:var(--text-gold);letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">Premium Casino Domino Experience</span>
        </div>

        <!-- Ornamental divider lines -->
        <div style="display:flex;align-items:center;gap:var(--sp-4);margin-top:var(--sp-4);">
          <div style="height:1px;background:linear-gradient(90deg, transparent, var(--border-gold));opacity:0;animation:splashOrnamentReveal 0.8s 0.8s ease-out forwards;"></div>
          <div style="display:flex;gap:6px;opacity:0;animation:splashSubReveal 0.5s 1s ease-out forwards;">
            <span style="color:var(--gold-bright);font-size:6px;animation:splashStarPulse 2s 0s ease-in-out infinite;">&#9830;</span>
            <span style="color:var(--gold-bright);font-size:10px;animation:splashStarPulse 2s 0.3s ease-in-out infinite;">&#9830;</span>
            <span style="color:var(--gold-bright);font-size:6px;animation:splashStarPulse 2s 0.6s ease-in-out infinite;">&#9830;</span>
          </div>
          <div style="height:1px;background:linear-gradient(90deg, var(--border-gold), transparent);opacity:0;animation:splashOrnamentReveal 0.8s 0.8s ease-out forwards;"></div>
        </div>

        <!-- Tagline -->
        <p id="splash-tagline" style="
          opacity:0;animation:splashTagReveal 0.6s 1.2s ease-out forwards;
          font-family:var(--font-body);font-style:italic;font-size:var(--text-md);
          color:var(--text-secondary);margin-top:var(--sp-5);letter-spacing:0.05em;
        ">Meja Terbaik, Taruhan Terbesar</p>

        <!-- Premium loading bar -->
        <div style="margin-top:var(--sp-7);width:200px;opacity:0;animation:splashSubReveal 0.5s 1.4s ease-out forwards;">
          <div style="width:100%;height:3px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;position:relative;">
            <div id="splash-progress" style="height:100%;width:0%;border-radius:4px;
              background:linear-gradient(90deg, var(--gold-bright), #ffe875);
              animation:splashProgressFill 1.8s 1.5s cubic-bezier(0.4,0,0.2,1) forwards, splashProgressGlow 1s 1.5s ease-in-out infinite;
            "></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;">
            <span style="font-family:var(--font-mono);font-size:8px;color:var(--text-muted);letter-spacing:0.1em;">MEMUAT</span>
            <span id="splash-pct" style="font-family:var(--font-mono);font-size:8px;color:var(--text-gold);letter-spacing:0.05em;">0%</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate percentage counter
  const pctEl = document.getElementById('splash-pct');
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct += Math.floor(2 + Math.random() * 5);
    if (pct >= 100) { pct = 100; clearInterval(pctTimer); }
    if (pctEl) pctEl.textContent = pct + '%';
  }, 60);

  // Redirect after full animation
  const redirectTimer = setTimeout(() => {
    const screen = container.querySelector('.splash-screen');
    if (screen) {
      screen.style.animation = 'splashFadeOut 0.8s ease forwards';
      setTimeout(() => {
        location.hash = state.user ? '#/lobby' : '#/login';
      }, 800);
    }
  }, 3600);

  return () => {
    clearTimeout(redirectTimer);
    clearInterval(pctTimer);
  };
}
