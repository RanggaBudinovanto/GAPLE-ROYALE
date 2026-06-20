let bgMusic = null;
let musicEnabled = localStorage.getItem('gaple_music_enabled') !== 'false'; // Defaults to true
let toggleBtn = null;
let sfxEnabled = localStorage.getItem('gaple_sfx_enabled') !== 'false'; // Defaults to true
let sfxToggleBtn = null;

// Audio file path
const MUSIC_PATH = '/casino-bgm.mp3';

export function initAudio() {
  if (bgMusic) return;

  // Create the Audio element
  bgMusic = new Audio(MUSIC_PATH);
  bgMusic.loop = true;
  bgMusic.volume = 0.3; // Gentle background volume

  // Render the floating toggle buttons
  createMusicToggle();
  initSfxToggle();

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

  toggleBtn.addEventListener('click', toggleMusic);

  document.body.appendChild(toggleBtn);
  updateUI(musicEnabled && bgMusic && !bgMusic.paused);
}

function updateUI(isPlaying) {
  if (!toggleBtn) return;

  if (isPlaying) {
    toggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
    `;
    // Add pulsing background effect when playing
    toggleBtn.style.animation = 'musicPulse 2s infinite ease-in-out';
  } else {
    toggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
        <line x1="22" y1="2" x2="2" y2="22"></line>
      </svg>
    `;
    toggleBtn.style.animation = 'none';
  }
}

export function initSfxToggle() {
  if (document.getElementById('sfx-toggle')) return;

  sfxToggleBtn = document.createElement('button');
  sfxToggleBtn.id = 'sfx-toggle';
  sfxToggleBtn.className = 'sfx-toggle-btn';
  sfxToggleBtn.title = 'Nyalakan/Matikan Efek Suara';

  sfxToggleBtn.addEventListener('click', toggleSfx);

  document.body.appendChild(sfxToggleBtn);
  updateSfxUI(sfxEnabled);
}

export function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  localStorage.setItem('gaple_sfx_enabled', sfxEnabled ? 'true' : 'false');
  updateSfxUI(sfxEnabled);
}

function updateSfxUI(enabled) {
  if (!sfxToggleBtn) return;

  if (enabled) {
    sfxToggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    `;
  } else {
    sfxToggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    `;
  }
}

