function getGSAP() {
  return window.gsap || null;
}

export function staggerFadeIn(selector, { delay = 0, stagger = 0.08, y = 16, duration = 0.3 } = {}) {
  const gsap = getGSAP();
  if (!gsap) return;
  gsap.from(selector, {
    opacity: 0,
    y,
    duration,
    stagger,
    delay,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

export function fadeIn(el, { duration = 0.3, delay = 0, y = 0, scale = 1 } = {}) {
  const gsap = getGSAP();
  if (!gsap) return;
  gsap.from(el, {
    opacity: 0,
    y,
    scale,
    duration,
    delay,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

export function countUp(el, target, { duration = 1.2, prefix = '', suffix = '' } = {}) {
  const gsap = getGSAP();
  if (!gsap) {
    el.textContent = prefix + target + suffix;
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = prefix + Math.floor(obj.val).toLocaleString('id-ID') + suffix;
    }
  });
}

export function animateCardPlay(el, targetX, targetY, { duration = 0.4 } = {}) {
  const gsap = getGSAP();
  if (!gsap) return Promise.resolve();
  return new Promise(resolve => {
    const rect = el.getBoundingClientRect();
    gsap.to(el, {
      x: targetX - rect.left,
      y: targetY - rect.top,
      duration,
      ease: 'power2.out',
      onComplete: resolve
    });
  });
}

export function coinRain(container, count = 20) {
  for (let i = 0; i < count; i++) {
    const coin = document.createElement('div');
    coin.className = 'coin-particle';
    coin.style.cssText = `
      position: absolute;
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #f5c842, #d4a017);
      border-radius: 50%;
      border: 1.5px solid #9a7010;
      left: ${Math.random() * 100}%;
      top: -20px;
      animation: coinFall ${1.5 + Math.random() * 1}s ${Math.random() * 0.5}s ease-in forwards;
      z-index: 100;
      pointer-events: none;
    `;
    container.appendChild(coin);
    setTimeout(() => coin.remove(), 3000);
  }
}

export function shuffleAnimation(cards, { duration = 0.8 } = {}) {
  const gsap = getGSAP();
  if (!gsap) return Promise.resolve();
  return new Promise(resolve => {
    const tl = gsap.timeline({ onComplete: resolve });
    cards.forEach((card, i) => {
      tl.to(card, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 40,
        rotation: (Math.random() - 0.5) * 30,
        duration: duration * 0.4,
        ease: 'power2.out'
      }, i * 0.02);
    });
    tl.to(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: duration * 0.4,
      stagger: 0.03,
      ease: 'power2.inOut',
      clearProps: 'all'
    }, '+=0.1');
  });
}
