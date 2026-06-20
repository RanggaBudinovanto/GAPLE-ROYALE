import state from '../state.js';

export function render(container) {
  if (state.user) {
    state.syncWithBackend();
  }
  container.innerHTML = `
    <div class="splash-screen" style="
      position:fixed;inset:0;
      background:var(--bg-void);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      z-index:9999;
    ">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(212,160,23,0.08) 0%, transparent 70%);"></div>
      <div id="splash-particles" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>

      <h1 id="splash-logo" class="text-hero text-gold" style="
        opacity:0;transform:scale(0.8);
        text-align:center;letter-spacing:0.05em;
        text-shadow:0 0 40px rgba(245,200,66,0.3);
        position:relative;z-index:1;
      ">GAPLE ROYALE</h1>

      <p id="splash-tagline" style="
        opacity:0;transform:translateY(20px);
        font-family:var(--font-body);font-style:italic;
        font-size:var(--text-lg);color:var(--text-secondary);
        margin-top:var(--sp-4);position:relative;z-index:1;
      ">Meja Terbaik, Taruhan Terbesar</p>

      <div id="splash-dots" style="
        display:flex;gap:8px;margin-top:var(--sp-7);
        position:relative;z-index:1;
      ">
        <span class="splash-dot"></span>
        <span class="splash-dot"></span>
        <span class="splash-dot"></span>
      </div>
    </div>

    <style>
      .splash-dot {
        width:8px;height:8px;border-radius:50%;
        background:var(--gold-warm);
        animation: pulse 1.2s ease-in-out infinite;
      }
      .splash-dot:nth-child(2) { animation-delay:0.2s; }
      .splash-dot:nth-child(3) { animation-delay:0.4s; }
    </style>
  `;

  createParticles();

  const logo = document.getElementById('splash-logo');
  const tagline = document.getElementById('splash-tagline');

  setTimeout(() => {
    logo.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    logo.style.opacity = '1';
    logo.style.transform = 'scale(1)';
  }, 100);

  setTimeout(() => {
    tagline.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    tagline.style.opacity = '1';
    tagline.style.transform = 'translateY(0)';
  }, 500);

  const redirectTimer = setTimeout(() => {
    const screen = container.querySelector('.splash-screen');
    if (screen) {
      screen.style.transition = 'opacity 0.6s ease';
      screen.style.opacity = '0';
      setTimeout(() => {
        location.hash = state.user ? '#/lobby' : '#/login';
      }, 600);
    }
  }, 2400);

  return () => clearTimeout(redirectTimer);
}

function createParticles() {
  const particlesEl = document.getElementById('splash-particles');
  if (!particlesEl) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${3 + Math.random() * 4}px;
      height:${3 + Math.random() * 4}px;
      background:var(--gold-bright);
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${40 + Math.random() * 40}%;
      opacity:0;
      animation: floatParticle ${3 + Math.random() * 3}s ${Math.random() * 2}s ease-out infinite;
    `;
    particlesEl.appendChild(p);
  }
}
