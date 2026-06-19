let bgMusic = null;
let musicEnabled = localStorage.getItem('gaple_music_enabled') !== 'false'; // Defaults to true
let toggleBtn = null;

// Audio file path
const MUSIC_PATH = '/casino-bgm.mp3';

export function initAudio() {
  if (bgMusic) return;

  // Create the Audio element
  bgMusic = new Audio(MUSIC_PATH);
  bgMusic.loop = true;
  bgMusic.volume = 0.3; // Gentle background volume

  // Render the floating toggle button
  createMusicToggle();

  // Try to autoplay if enabled
  if (musicEnabled) {
    tryPlayMusic();
  }
}

function tryPlayMusic() {
  if (!bgMusic || !musicEnabled) return;

  bgMusic.play()
    .then(() => {
      updateUI(true);
    })
    .catch((err) => {
      console.log('Autoplay blocked. Waiting for user interaction to start music.');
      updateUI(false);
      // Wait for user interaction to start playing
      const startOnInteraction = () => {
        if (musicEnabled && bgMusic && bgMusic.paused) {
          bgMusic.play().then(() => {
            updateUI(true);
          }).catch(console.error);
        }
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
      };
      document.addEventListener('click', startOnInteraction);
      document.addEventListener('keydown', startOnInteraction);
    });
}

export function toggleMusic() {
  if (!bgMusic) return;

  if (musicEnabled) {
    // Turn off
    bgMusic.pause();
    musicEnabled = false;
    localStorage.setItem('gaple_music_enabled', 'false');
    updateUI(false);
  } else {
    // Turn on
    musicEnabled = true;
    localStorage.setItem('gaple_music_enabled', 'true');
    bgMusic.play()
      .then(() => updateUI(true))
      .catch(console.error);
  }
}

function createMusicToggle() {
  if (document.getElementById('music-toggle')) return;

  toggleBtn = document.createElement('button');
  toggleBtn.id = 'music-toggle';
  toggleBtn.className = 'music-toggle-btn';
  toggleBtn.title = 'Nyalakan/Matikan Musik';

  // Floating styling with CSS variables from our design system
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 84px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(20, 26, 16, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1.5px solid var(--border-gold);
    color: var(--text-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    z-index: 999;
    cursor: pointer;
    transition: transform var(--dur-fast) var(--ease-spring), border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
  `;

  // Hover and active effects via JS events (since it is dynamically styled)
  toggleBtn.addEventListener('mouseenter', () => {
    toggleBtn.style.transform = 'scale(1.1)';
    toggleBtn.style.borderColor = 'var(--gold-bright)';
    toggleBtn.style.boxShadow = '0 0 12px rgba(245,200,66,0.3)';
  });
  toggleBtn.addEventListener('mouseleave', () => {
    toggleBtn.style.transform = 'none';
    toggleBtn.style.borderColor = 'var(--border-gold)';
    toggleBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
  });
  toggleBtn.addEventListener('mousedown', () => {
    toggleBtn.style.transform = 'scale(0.95)';
  });
  toggleBtn.addEventListener('mouseup', () => {
    toggleBtn.style.transform = 'scale(1.1)';
  });

  toggleBtn.addEventListener('click', toggleMusic);

  document.body.appendChild(toggleBtn);
  updateUI(musicEnabled && bgMusic && !bgMusic.paused);
}

function updateUI(isPlaying) {
  if (!toggleBtn) return;

  if (isPlaying) {
    toggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    `;
    // Add pulsing background effect when playing
    toggleBtn.style.animation = 'musicPulse 2s infinite ease-in-out';
  } else {
    toggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    `;
    toggleBtn.style.animation = 'none';
  }
}
