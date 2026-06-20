let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function isSfxEnabled() {
  // Decoupled from background music so sound effects play even if music is disabled
  return localStorage.getItem('gaple_sfx_enabled') !== 'false';
}

// 1. Casino Chip Click Sound (tap, select, click)
export function playClick() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(700, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1100, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.error('SFX error:', e);
  }
}

// 2. Card Hover (subtle high-pitched tick)
export function playHover() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    // Ignore context resume issues on hover
  }
}

// 3. Card Placement on Felt Table (synthesized wood/plastic tile clack click)
export function playCardPlace() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Transient click (high-mid frequency contact pop)
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(1100, now);
    oscClick.frequency.exponentialRampToValueAtTime(700, now + 0.015);
    gainClick.gain.setValueAtTime(0.15, now); // Increased from 0.08 for presence
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);
    oscClick.start(now);
    oscClick.stop(now + 0.015);

    // Resonant wooden thump
    const oscThump = ctx.createOscillator();
    const gainThump = ctx.createGain();
    oscThump.type = 'sine';
    oscThump.frequency.setValueAtTime(220, now);
    oscThump.frequency.exponentialRampToValueAtTime(80, now + 0.12); // Extended for richer decay
    gainThump.gain.setValueAtTime(0.35, now); // Increased from 0.18 for better punch
    gainThump.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    oscThump.connect(gainThump);
    gainThump.connect(ctx.destination);
    oscThump.start(now);
    oscThump.stop(now + 0.12);

    // High frequency transient pop (bone/plastic click)
    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(1800, now);
    gainHigh.gain.setValueAtTime(0.08, now); // Increased from 0.05
    gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    oscHigh.start(now);
    oscHigh.stop(now + 0.01);
  } catch (e) {
    console.error('SFX error:', e);
  }
}

// 4. Celebratory Coin / Win Chimes (gold arpeggio arcing)
export function playWin() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6 (Extended)
    
    notes.forEach((freq, idx) => {
      const time = ctx.currentTime + idx * 0.06; // Faster, more exciting arpeggio
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.15, time); // Increased from 0.08 for volume
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35); // Extended decay

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.35);
    });
  } catch (e) {
    console.error('SFX error:', e);
  }
}

// 4b. Lose Sound (sad minor key descent)
export function playLose() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const notes = [392.00, 349.23, 311.13, 246.94, 196.00]; // G4, F4, Eb4, B3, G3 (Sad minor vibe with deep final note)
    notes.forEach((freq, idx) => {
      const time = ctx.currentTime + idx * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.linearRampToValueAtTime(freq - 30, time + 0.45);
      
      gain.gain.setValueAtTime(0.2, time); // Increased from 0.12
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.45);
    });
  } catch (e) {
    console.error('SFX error:', e);
  }
}

// 5. Pass Turn (double muffled tap sound)
export function playPass() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error('SFX error:', e);
  }
}

// 6. Shop Purchase (cash register bell + metallic chime)
export function playPurchase() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Bell chime (high sine wave)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1400, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Follow-up metallic tick
    setTimeout(() => {
      if (!isSfxEnabled()) return;
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1800, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      } catch (err) {}
    }, 60);
  } catch (e) {
    console.error('SFX error:', e);
  }
}
