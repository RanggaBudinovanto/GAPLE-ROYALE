import state from './state.js';
import { initRouter } from './router.js';
import { initAudio } from './utils/audio.js';
import { playClick, playHover } from './utils/sfx.js';

document.addEventListener('DOMContentLoaded', () => {
  state.init();
  initAudio();
  initRouter();

  // Centralized interactive audio feedback (micro-interactions)
  let lastHovered = null;
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('button, .btn, .card--interactive, .sidebar-item, .bottom-nav-item, .chat-emoji, .powerup-slot, .domino-wrapper[data-valid="true"], .chat-toggle');
    if (target && target !== lastHovered) {
      lastHovered = target;
      playHover();
    } else if (!target) {
      lastHovered = null;
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .btn, .card--interactive, .sidebar-item, .bottom-nav-item, .chat-emoji, .powerup-slot, .domino-wrapper[data-valid="true"], .chat-toggle');
    if (target) {
      playClick();
    }
  });
});
