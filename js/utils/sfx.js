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

// 3. Card Placement on Felt Table (synthesized tile clack click customized per skin class)
export function playCardPlace(skin = 'classic') {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Standard base values (clack/wood/felt)
    let clickFreq = 1100;
    let clickGain = 0.15;
    let clickDur = 0.015;

    let thumpFreq = 220;
    let thumpGain = 0.35;
    let thumpDur = 0.12;

    let highFreq = 1800;
    let highGain = 0.08;
    let highDur = 0.01;

    // 2. Adjust characteristics based on skin price class
    if (skin === 'candy_pop') {
      // Cute bubble pop sound: high-to-low click sweep + sine pop
      clickFreq = 1200;
      clickGain = 0.18;
      clickDur = 0.04;
      thumpFreq = 300;
      thumpGain = 0.3;
      thumpDur = 0.06;
      
      const oscPop = ctx.createOscillator();
      const gainPop = ctx.createGain();
      oscPop.type = 'sine';
      oscPop.frequency.setValueAtTime(400, now);
      oscPop.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gainPop.gain.setValueAtTime(0.2, now);
      gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      oscPop.connect(gainPop);
      gainPop.connect(ctx.destination);
      oscPop.start(now);
      oscPop.stop(now + 0.08);
    } 
    else if (skin === 'ocean_blue') {
      // Liquid bubble splash
      clickFreq = 900;
      clickGain = 0.12;
      thumpFreq = 180;
      thumpGain = 0.25;
      
      const bubbleFrequencies = [800, 1100, 1400];
      bubbleFrequencies.forEach((f, idx) => {
        const t = now + idx * 0.025;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.exponentialRampToValueAtTime(f + 300, t + 0.05);
        g.gain.setValueAtTime(0.05, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      });
    } 
    else if (skin === 'sakura_blossom') {
      // Oriental woodblock: light & organic
      clickFreq = 750;
      clickGain = 0.2;
      clickDur = 0.02;
      thumpFreq = 260;
      thumpGain = 0.2;
      thumpDur = 0.08;
      highFreq = 1500;
      highGain = 0.03;
    } 
    else if (skin === 'ruby_red') {
      // Glass clink / ruby resonance
      clickFreq = 1400;
      clickGain = 0.18;
      clickDur = 0.01;
      thumpFreq = 280;
      thumpGain = 0.15;
      
      const oscPing = ctx.createOscillator();
      const gainPing = ctx.createGain();
      oscPing.type = 'sine';
      oscPing.frequency.setValueAtTime(3200, now);
      gainPing.gain.setValueAtTime(0.12, now);
      gainPing.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      oscPing.connect(gainPing);
      gainPing.connect(ctx.destination);
      oscPing.start(now);
      oscPing.stop(now + 0.15);
    } 
    else if (skin === 'volcano') {
      // Deeper thud + crackle noise burst
      clickFreq = 500;
      clickGain = 0.25;
      clickDur = 0.03;
      thumpFreq = 100;
      thumpGain = 0.55;
      thumpDur = 0.18;
      
      try {
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350, now);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.12);
      } catch (err) {}
    } 
    else if (skin === 'cyberpunk') {
      // Futuristic synth click: high pitch, quick digital sweep
      clickFreq = 1800;
      clickGain = 0.2;
      clickDur = 0.03;
      thumpFreq = 150;
      thumpGain = 0.25;
      thumpDur = 0.08;
      highFreq = 3000;
      highGain = 0.15;
      
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'sine';
      sweep.frequency.setValueAtTime(800, now);
      sweep.frequency.exponentialRampToValueAtTime(3000, now + 0.04);
      sweepGain.gain.setValueAtTime(0.06, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.04);
    } 
    else if (skin === 'marble_white') {
      // Crisp stone clack
      clickFreq = 950;
      clickGain = 0.22;
      thumpFreq = 160;
      thumpGain = 0.42;
      thumpDur = 0.13;
      highFreq = 1300;
      highGain = 0.06;
    } 
    else if (skin === 'midnight') {
      // Deep echo / obsidian tile click
      clickFreq = 700;
      clickGain = 0.2;
      thumpFreq = 120;
      thumpGain = 0.45;
      thumpDur = 0.22;
      highFreq = 900;
      highGain = 0.04;
    } 
    else if (skin === 'carbon_fiber') {
      // Snappy, dry, high-tech carbon click
      clickFreq = 1600;
      clickGain = 0.25;
      clickDur = 0.012;
      thumpFreq = 250;
      thumpGain = 0.22;
      thumpDur = 0.06;
      highFreq = 2200;
      highGain = 0.12;
      highDur = 0.008;
    } 
    else if (skin === 'emerald') {
      // Heavy felt thump + jade resonance chime
      clickFreq = 1000;
      clickGain = 0.18;
      thumpFreq = 130;
      thumpGain = 0.5;
      thumpDur = 0.15;
      
      const jadeOsc = ctx.createOscillator();
      const jadeGain = ctx.createGain();
      jadeOsc.type = 'sine';
      jadeOsc.frequency.setValueAtTime(2000, now);
      jadeGain.gain.setValueAtTime(0.08, now);
      jadeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      jadeOsc.connect(jadeGain);
      jadeGain.connect(ctx.destination);
      jadeOsc.start(now);
      jadeOsc.stop(now + 0.2);
    } 
    else if (skin === 'rainbow_unicorn') {
      // Magical crystal chime + plastic clack
      thumpFreq = 240;
      thumpGain = 0.25;
      
      const chimes = [987.77, 1318.51, 1567.98, 1975.53]; // B5, E6, G6, B6
      chimes.forEach((f, idx) => {
        const t = now + idx * 0.02;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    } 
    else if (skin === 'royal_gold') {
      // Royal Gold: metallic gold ring clink + heavy clack
      clickFreq = 1200;
      clickGain = 0.2;
      thumpFreq = 180;
      thumpGain = 0.35;
      thumpDur = 0.12;

      // Golden metallic bell ring
      const oscBell = ctx.createOscillator();
      const gainBell = ctx.createGain();
      oscBell.type = 'sine';
      oscBell.frequency.setValueAtTime(2600, now);
      gainBell.gain.setValueAtTime(0.18, now); // Sweet bell ring
      gainBell.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      oscBell.connect(gainBell);
      gainBell.connect(ctx.destination);
      oscBell.start(now);
      oscBell.stop(now + 0.25);

      // Gold coin chime arpeggio
      const goldTones = [1975.53, 2349.32]; // B6, D7
      goldTones.forEach((f, idx) => {
        const t = now + idx * 0.03;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    }
    else if (skin === 'golden_luxury') {
      // Golden Luxury: metallic coin + grand luxurious chord chime + heavy premium thud
      clickFreq = 1300;
      clickGain = 0.25;
      thumpFreq = 150;
      thumpGain = 0.45;
      thumpDur = 0.16;

      // Luxurious minor-major 7th chime chords: E6, G#6, B6, D#7
      const chord = [1318.51, 1661.22, 1975.53, 2489.02];
      chord.forEach((f, idx) => {
        const t = now + idx * 0.02;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.09, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); // Long decaying chime
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    }

    // 3. Play base synthesized clack
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(clickFreq, now);
    oscClick.frequency.exponentialRampToValueAtTime(clickFreq * 0.6, now + clickDur);
    gainClick.gain.setValueAtTime(clickGain, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + clickDur);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);
    oscClick.start(now);
    oscClick.stop(now + clickDur);

    const oscThump = ctx.createOscillator();
    const gainThump = ctx.createGain();
    oscThump.type = 'sine';
    oscThump.frequency.setValueAtTime(thumpFreq, now);
    oscThump.frequency.exponentialRampToValueAtTime(thumpFreq * 0.4, now + thumpDur);
    gainThump.gain.setValueAtTime(thumpGain, now);
    gainThump.gain.exponentialRampToValueAtTime(0.001, now + thumpDur);
    oscThump.connect(gainThump);
    gainThump.connect(ctx.destination);
    oscThump.start(now);
    oscThump.stop(now + thumpDur);

    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(highFreq, now);
    gainHigh.gain.setValueAtTime(highGain, now);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, now + highDur);
    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    oscHigh.start(now);
    oscHigh.stop(now + highDur);
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

// ══════════════════════════════════════════════════════════════════
// NEW SFX: Coin Count, Turn, Timer, Achievement, Emotes
// ══════════════════════════════════════════════════════════════════

export function playCoinCount() {
  if (!isSfxEnabled()) return null;
  let count = 0;
  const interval = setInterval(() => {
    if (!isSfxEnabled()) return;
    count++;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const freq = 2400 + (count % 3) * 200;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }, 65);
  return interval;
}

export function playTurnNotification() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, now + 0.1);
    gain2.gain.setValueAtTime(0.0, now);
    gain2.gain.setValueAtTime(0.14, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.25);
  } catch (e) {
    console.error('SFX error:', e);
  }
}

export function playTimerWarning() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

export function playAchievementUnlock() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
    const shimmer = ctx.createOscillator();
    const shimGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(3200, now + 0.3);
    shimGain.gain.setValueAtTime(0.0, now);
    shimGain.gain.setValueAtTime(0.06, now + 0.3);
    shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    shimmer.connect(shimGain);
    shimGain.connect(ctx.destination);
    shimmer.start(now + 0.3);
    shimmer.stop(now + 0.8);
  } catch (e) {
    console.error('SFX error:', e);
  }
}

export function playEmoteSound(emoteId) {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    switch (emoteId) {
      case 'laugh': {
        [400, 600, 900, 1200].forEach((f, i) => {
          const t = now + i * 0.04;
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.06);
        });
        break;
      }
      case 'angry': {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(120, now);
        o.frequency.linearRampToValueAtTime(80, now + 0.15);
        g.gain.setValueAtTime(0.12, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.15);
        const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
        o2.type = 'sawtooth'; o2.frequency.setValueAtTime(200, now + 0.05);
        g2.gain.setValueAtTime(0.08, now + 0.05); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        o2.connect(g2); g2.connect(ctx.destination); o2.start(now + 0.05); o2.stop(now + 0.12);
        break;
      }
      case 'cry': {
        [440, 370, 311, 262].forEach((f, i) => {
          const t = now + i * 0.08;
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
          o.frequency.linearRampToValueAtTime(f - 30, t + 0.08);
          g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.12);
        });
        break;
      }
      case 'thumbsup': {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(1200, now);
        o.frequency.exponentialRampToValueAtTime(1800, now + 0.06);
        g.gain.setValueAtTime(0.12, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.1);
        break;
      }
      case 'clap': {
        [0, 0.08].forEach(delay => {
          const t = now + delay;
          const bufSize = Math.floor(ctx.sampleRate * 0.04);
          const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
          const src = ctx.createBufferSource(); src.buffer = buf;
          const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.setValueAtTime(1200, t);
          const g = ctx.createGain(); g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          src.connect(flt); flt.connect(g); g.connect(ctx.destination); src.start(t); src.stop(t + 0.04);
        });
        break;
      }
      case 'taunt': {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(1200, now);
        o.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        o.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        g.gain.setValueAtTime(0.1, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.18);
        break;
      }
      case 'shock': {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(300, now);
        o.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
        g.gain.setValueAtTime(0.12, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.15);
        const bufSize = Math.floor(ctx.sampleRate * 0.03);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource(); src.buffer = buf;
        const g2 = ctx.createGain(); g2.gain.setValueAtTime(0.08, now + 0.08); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        src.connect(g2); g2.connect(ctx.destination); src.start(now + 0.08); src.stop(now + 0.12);
        break;
      }
      case 'moneyeyes': {
        [1400, 1800, 2200].forEach((f, i) => {
          const t = now + i * 0.04;
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.08);
        });
        break;
      }
      case 'fire': {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(200, now);
        o.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        g.gain.setValueAtTime(0.1, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.15);
        const bufSize = Math.floor(ctx.sampleRate * 0.1);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource(); src.buffer = buf;
        const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.setValueAtTime(400, now);
        const g2 = ctx.createGain(); g2.gain.setValueAtTime(0.06, now); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        src.connect(flt); flt.connect(g2); g2.connect(ctx.destination); src.start(now); src.stop(now + 0.1);
        break;
      }
      case 'cool': {
        [329.63, 392.00, 493.88].forEach((f, i) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(f, now);
          g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.2);
        });
        break;
      }
      case 'sleepy': {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(400, now);
        o.frequency.exponentialRampToValueAtTime(150, now + 0.4);
        g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.4);
        break;
      }
      case 'gg': {
        [1200, 1600].forEach((f, i) => {
          const t = now + i * 0.08;
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.15);
        });
        break;
      }
    }
  } catch (e) {
    console.error('SFX error:', e);
  }
}
