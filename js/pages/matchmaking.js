import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter } from '../components/character.js';
import { generateRoomId, formatNumber, winRate } from '../utils/format.js';
import { staggerFadeIn } from '../utils/animation.js';
import { playClick, playHover } from '../utils/sfx.js';
import { apiCall, SOCKET_URL } from '../config.js';
import { renderIcon, renderRankBadge } from '../components/emotes.js';

// Web Audio API Sound Synthesizer for high-end SFX
function playSynthSound(type) {
  if (localStorage.getItem('gaple_sfx_enabled') === 'false') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'found') {
      // Fanfare: Major chord arpeggio C4 -> E4 -> G4 -> C5 -> E5 -> G5
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
      });
    } else if (type === 'accept') {
      // High pitch chip clink
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'ready') {
      // Success fanfare chime
      const now = ctx.currentTime;
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
      });
    } else if (type === 'fail') {
      // Descending buzzer
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.4);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (err) {
    console.error('Audio synthesis failed:', err);
  }
}

const BOT_POOL = [
  { id: 'bocah_warnet', name: 'Bot Warnet' },
  { id: 'satpam_meja', name: 'Bot Satpam' },
  { id: 'pawang_domino', name: 'Bot Pawang' },
  { id: 'si_paling_gaple', name: 'Bot Gaple' },
  { id: 'ratu_casino', name: 'Bot Ratu' },
  { id: 'bandar_darat', name: 'Bot Bandar' },
  { id: 'hacker_gaple', name: 'Bot Hacker' },
  { id: 'eyang_hoki', name: 'Bot Eyang' },
  { id: 'master_zen', name: 'Bot Zen' },
  { id: 'legenda_royale', name: 'Bot Legenda' },
  { id: 'magang_domino', name: 'Bot Magang' },
  { id: 'kapten_kartu', name: 'Bot Kapten' }
];

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  // Step: mode | format | bet_selection | lobby | searching | match_found
  let step = 'mode';
  const stepHistory = ['mode'];
  
  let modeType = 'classic'; // classic | ranked | ai | betting
  let selectedMode = null; // duel | fourplayer
  let selectedOpponent = null; // bot | pvp
  let botLevel = 'easy'; // easy | hard
  let isRanked = false;
  let betAmount = 0; // amount of stake koin
  
  // Lobby state
  let lobbyPlayers = [null, null, null, null]; // [Player1(You), Player2, Player3, Player4]
  
  let searchTimer = null;
  let searchSeconds = 0;
  
  let acceptTimer = null;
  let acceptSeconds = 10;
  let userAccepted = false;
  let simulatedReadiness = [false, false, false, false];
  let pvpAcceptSocket = null;

  container.innerHTML = '<div class="page-with-sidebar"><div id="nav-mount"></div><div class="page-content" id="mm-content"></div></div>';
  const navCleanup = renderNavbar(container.querySelector('#nav-mount'));

  function handleBack() {
    if (stepHistory.length > 1) {
      stepHistory.pop();
      step = stepHistory[stepHistory.length - 1];
      
      clearInterval(searchTimer);
      clearInterval(acceptTimer);

      if (step === 'mode') {
        selectedMode = null;
        selectedOpponent = null;
        modeType = 'classic';
        betAmount = 0;
        isRanked = false;
        lobbyPlayers = [null, null, null, null];
      } else if (step === 'format') {
        selectedMode = null;
        lobbyPlayers = [null, null, null, null];
      } else if (step === 'bet_selection') {
        betAmount = 0;
        lobbyPlayers = [null, null, null, null];
      }
      renderStep();
    }
  }

  function initializeLobby() {
    // Player 1 is always the user
    lobbyPlayers = [
      { id: user.id, username: user.username, activeCharacter: user.activeCharacter, isBot: false },
      null, null, null
    ];
    
    // In VS AI mode, pre-fill all slots with random bots
    if (selectedOpponent === 'bot') {
      const needed = selectedMode === 'fourplayer' ? 3 : 1;
      const shuffledBots = [...BOT_POOL].sort(() => 0.5 - Math.random());
      for (let i = 0; i < needed; i++) {
        const bot = shuffledBots[i];
        lobbyPlayers[i + 1] = {
          id: `bot_${i + 1}`,
          username: bot.name,
          activeCharacter: bot.id,
          isBot: true
        };
      }
    }
  }

  function addBotToLobby(slotIdx) {
    // Find active characters in lobby to avoid duplicates if possible
    const currentIds = lobbyPlayers.filter(p => p !== null).map(p => p.activeCharacter);
    const available = BOT_POOL.filter(b => !currentIds.includes(b.id));
    const pool = available.length > 0 ? available : BOT_POOL;
    const bot = pool[Math.floor(Math.random() * pool.length)];
    
    lobbyPlayers[slotIdx] = {
      id: `bot_${slotIdx}_${Date.now()}`,
      username: bot.name,
      activeCharacter: bot.id,
      isBot: true
    };
    playClick();
    renderStep();
  }

  function kickPlayerFromLobby(slotIdx) {
    lobbyPlayers[slotIdx] = null;
    playClick();
    renderStep();
  }

  function renderStep() {
    const content = container.querySelector('#mm-content');

    content.innerHTML = `
      <style>
        /* Keyframe Animations */
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes radarPulse {
          0% { transform: scale(0.7); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(212, 160, 23, 0.25); box-shadow: 0 0 5px rgba(212,160,23,0.1); }
          50% { border-color: var(--gold-bright); box-shadow: 0 0 15px rgba(245,200,66,0.3); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Matchmaking Selection Mode Cards */
        .mm-mode-card {
          position: relative;
          padding: var(--sp-6) var(--sp-4);
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--border-default);
          cursor: pointer;
          transition: all var(--dur-normal) var(--ease-spring);
          overflow: hidden;
          background: rgba(20,26,16,0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        .mode--classic {
          border-color: rgba(46, 204, 113, 0.35);
          background-image: radial-gradient(circle at top right, rgba(46, 204, 113, 0.15) 0%, transparent 60%);
        }
        .mode--classic:hover {
          border-color: var(--status-win);
          box-shadow: 0 0 25px rgba(46, 204, 113, 0.4);
          transform: translateY(-5px);
        }

        .mode--ranked {
          border-color: rgba(212, 160, 23, 0.35);
          background-image: radial-gradient(circle at top right, rgba(212, 160, 23, 0.15) 0%, transparent 60%);
        }
        .mode--ranked:hover {
          border-color: var(--gold-bright);
          box-shadow: 0 0 25px rgba(245, 200, 66, 0.4);
          transform: translateY(-5px);
        }

        .mode--ai {
          border-color: rgba(52, 152, 219, 0.35);
          background-image: radial-gradient(circle at top right, rgba(52, 152, 219, 0.15) 0%, transparent 60%);
        }
        .mode--ai:hover {
          border-color: #3498db;
          box-shadow: 0 0 25px rgba(52, 152, 219, 0.4);
          transform: translateY(-5px);
        }

        .mode--betting {
          border-color: rgba(245, 200, 66, 0.45);
          background-image: radial-gradient(circle at top right, rgba(245, 200, 66, 0.2) 0%, transparent 60%);
        }
        .mode--betting:hover {
          border-color: var(--gold-bright);
          box-shadow: 0 0 25px rgba(245, 200, 66, 0.5);
          transform: translateY(-5px);
        }

        .chip-card {
          position: relative;
          padding: var(--sp-5) var(--sp-3);
          border-radius: var(--radius-lg);
          border: 2px solid rgba(212, 160, 23, 0.2);
          background: rgba(20, 26, 16, 0.7);
          cursor: pointer;
          transition: all 0.3s var(--ease-spring);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .chip-card:hover:not(.chip-disabled) {
          border-color: var(--gold-bright);
          box-shadow: 0 0 20px rgba(245, 200, 66, 0.35);
          transform: translateY(-3px);
        }
        .chip-disabled {
          border-color: rgba(231, 76, 60, 0.3) !important;
          background: rgba(40, 20, 20, 0.45) !important;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .chip-disabled .chip-lock {
          font-size: 10px;
          color: var(--status-lose);
          font-weight: bold;
          margin-top: 6px;
        }

        /* Lobby Grid Slots */
        .lobby-slots-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: var(--sp-4);
          width: 100%;
          margin-bottom: var(--sp-5);
        }

        .lobby-slot-card {
          position: relative;
          height: 220px;
          border-radius: var(--radius-lg);
          background: rgba(13, 17, 10, 0.7);
          border: 1.5px solid var(--border-default);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--sp-3);
          transition: all 0.3s var(--ease-out);
          text-align: center;
        }

        .lobby-slot-card.slot--filled {
          background: linear-gradient(to bottom, rgba(20,26,16,0.8), rgba(13,17,10,0.9));
          border-color: var(--border-gold);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .lobby-slot-card.slot--empty {
          border: 2px dashed rgba(212, 160, 23, 0.25);
          cursor: pointer;
        }
        .lobby-slot-card.slot--empty:hover {
          border-color: var(--gold-bright);
          background: rgba(212, 160, 23, 0.04);
          box-shadow: 0 0 15px rgba(212, 160, 23, 0.1);
        }

        .lobby-slot-card.slot--leader {
          border-color: var(--gold-bright);
          box-shadow: 0 0 15px rgba(245, 200, 66, 0.15);
        }

        .lobby-slot-card.slot--leader::after {
          content: 'KAPTEN';
          position: absolute;
          top: -10px;
          background: var(--gold-gradient);
          color: var(--text-dark);
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 9px;
          letter-spacing: 0.1em;
          padding: 3px 12px;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .kick-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--status-lose);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
          transition: transform 0.2s;
          z-index: 10;
        }
        .kick-btn:hover {
          transform: scale(1.18);
        }

        /* Fullscreen Overlay for Search Radar */
        .searching-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(8, 10, 6, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-4);
        }

        /* Fullscreen Overlay for Match Found Accept Screen */
        .accept-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(8, 10, 6, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-4);
        }

        .accept-content-card {
          width: 100%;
          max-width: 720px;
          background: linear-gradient(135deg, rgba(20,26,16,0.95), rgba(9,28,16,0.95));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          padding: var(--sp-6) var(--sp-5);
          box-shadow: 0 0 50px rgba(245, 200, 66, 0.25);
          text-align: center;
        }

        .accept-slots-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 640px;
          margin: var(--sp-6) auto;
          gap: var(--sp-4);
        }

        .accept-team-col {
          display: flex;
          flex-direction: column;
          gap: var(--sp-5);
        }

        .accept-slot-circle {
          position: relative;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          border: 2px solid rgba(212, 160, 23, 0.35);
          background: rgba(13, 17, 10, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }

        .accept-slot-circle.ready {
          border-color: var(--status-win);
          box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
          transform: scale(1.05);
        }

        .accept-slot-circle .slot-ready-check {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--status-win);
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 11px;
          font-weight: 900;
          opacity: 0;
          transform: scale(0.4);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .accept-slot-circle.ready .slot-ready-check {
          opacity: 1;
          transform: scale(1);
        }

        .accept-center-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-4);
        }

        .accept-timer-ring {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(-90deg);
        }

        .progress-ring__circle {
          transition: stroke-dashoffset 0.1s linear;
          stroke-linecap: round;
        }

        .timer-countdown-text {
          font-family: var(--font-mono);
          font-size: 46px;
          font-weight: 900;
          color: var(--text-gold);
          text-shadow: 0 0 15px rgba(245,200,66,0.4);
          line-height: 1;
        }

        .timer-countdown-label {
          font-family: var(--font-display);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--text-secondary);
          margin-top: 2px;
        }
      </style>

      <!-- Step Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-5);flex-shrink:0;">
        <div>
          ${step !== 'mode' ? `
            <button class="btn btn-ghost btn-sm" id="btn-back-step" style="display:inline-flex;align-items:center;gap:6px;padding:8px 0;margin-bottom:var(--sp-2);color:var(--text-secondary);cursor:pointer;font-family:var(--font-mono);text-transform:none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              KEMBALI
            </button>
          ` : ''}
          <h1 class="text-display text-gold" style="margin:0;font-size:36px;letter-spacing:-0.02em;font-family:var(--font-display);">MATCHMAKING</h1>
          <p class="text-secondary" style="font-size:14px;margin-top:4px;">
            ${step === 'mode' ? 'Pilih mode permainan bertema casino Gaple Royale' : step === 'format' ? 'Pilih jumlah pemain untuk meja permainan Anda' : step === 'bet_selection' ? 'Tentukan taruhan koin emas sebelum masuk meja' : 'Kelola lobi Anda, undang Bot latihan, atau mulai bertanding'}
          </p>
        </div>
      </div>

      <!-- Main Layout Wrapper (2 Columns) -->
      <div class="matchmaking-layout" style="display:flex;gap:var(--sp-6);width:100%;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1;">
        
        <!-- Column 1: Game Modes Dashboard or Lobby Slots (Left) -->
        <div style="flex:1.4;min-width:320px;display:flex;flex-direction:column;gap:var(--sp-5);" class="anim-fade-in">
          
          <!-- STEP 1: MODE DASHBOARD (MLBB STYLE) -->
          ${step === 'mode' ? `
            <div id="step-mode">
              <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);font-size:11px;letter-spacing:0.15em;">PILIH MODE BERMAIN</h3>
              <div class="grid grid-2" style="gap:var(--sp-4);">
                
                <!-- CLASSIC MODE CARD -->
                <div class="mm-mode-card mode--classic" data-modetype="classic">
                  <div class="mm-icon-wrapper" style="width:64px;height:64px;border-radius:50%;background:rgba(46,204,113,0.15);border:1.5px solid rgba(46,204,113,0.4);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <span style="display:inline-flex;">${renderIcon('icon_swords', 28)}</span>
                  </div>
                  <div style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:4px;letter-spacing:0.04em;">CLASSIC</div>
                  <div style="font-size:11px;color:var(--status-win);font-weight:700;margin-bottom:12px;font-family:var(--font-mono);letter-spacing:0.05em;">TRADISIONAL | CASUAL</div>
                  <p class="text-xs text-secondary" style="line-height:1.5;margin:0;">Bermain santai bersama pemain lain dengan aturan tradisional gaple lengkap.</p>
                </div>

                <!-- RANKED MODE CARD -->
                <div class="mm-mode-card mode--ranked" data-modetype="ranked">
                  <div class="mm-icon-wrapper" style="width:64px;height:64px;border-radius:50%;background:rgba(212,160,23,0.15);border:1.5px solid rgba(212,160,23,0.4);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <span style="display:inline-flex;">${renderIcon('icon_crown', 28)}</span>
                  </div>
                  <div style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text-gold);margin-bottom:4px;letter-spacing:0.04em;">RANKED</div>
                  <div style="font-size:11px;color:var(--gold-bright);font-weight:700;margin-bottom:12px;font-family:var(--font-mono);letter-spacing:0.05em;">KOMPETITIF | MEJA PRESTASI</div>
                  <p class="text-xs text-secondary" style="line-height:1.5;margin:0;">Gengsi tinggi! Naikkan tingkat klasemen kompetitif dan raih lencana kemuliaan.</p>
                </div>

                <!-- VS A.I. MODE CARD -->
                <div class="mm-mode-card mode--ai" data-modetype="ai">
                  <div class="mm-icon-wrapper" style="width:64px;height:64px;border-radius:50%;background:rgba(52,152,219,0.15);border:1.5px solid rgba(52,152,219,0.4);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <span style="display:inline-flex;">${renderIcon('icon_robot', 28)}</span>
                  </div>
                  <div style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:4px;letter-spacing:0.04em;">VS A.I.</div>
                  <div style="font-size:11px;color:#3498db;font-weight:700;margin-bottom:12px;font-family:var(--font-mono);letter-spacing:0.05em;">LATIHAN | LURING</div>
                  <p class="text-xs text-secondary" style="line-height:1.5;margin:0;">Latih taktik Anda secara instan melawan bot komputer dengan level kecerdasan buatan.</p>
                </div>

                <!-- BERTARUH CARD -->
                <div class="mm-mode-card mode--betting" data-modetype="betting">
                  <div class="mm-icon-wrapper" style="width:64px;height:64px;border-radius:50%;background:rgba(245,200,66,0.15);border:1.5px solid rgba(245,200,66,0.4);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <span style="display:inline-flex;">${renderIcon('icon_coins', 28)}</span>
                  </div>
                  <div style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text-gold);margin-bottom:4px;letter-spacing:0.04em;">BERTARUH</div>
                  <div style="font-size:11px;color:var(--gold-bright);font-weight:700;margin-bottom:12px;font-family:var(--font-mono);letter-spacing:0.05em;">MEJA STAKE | REBUT POOL</div>
                  <p class="text-xs text-secondary" style="line-height:1.5;margin:0;">Pertaruhkan koin Anda! Pemenang tunggal menyapu bersih seluruh pool taruhan meja.</p>
                </div>

              </div>
            </div>
          ` : ''}

          <!-- STEP 1.5: FORMAT SELECTION -->
          ${step === 'format' ? `
            <div id="step-format">
              <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);font-size:11px;letter-spacing:0.15em;">PILIH FORMAT MEJA PERMAINAN</h3>
              <div class="grid grid-2" style="gap:var(--sp-4);">
                
                <!-- DUEL 1v1 -->
                <div class="mm-mode-card mode--classic mm-format-card" data-format="duel">
                  <div class="mm-icon-wrapper" style="width:64px;height:64px;border-radius:50%;background:rgba(46,204,113,0.15);border:1.5px solid rgba(46,204,113,0.4);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <span style="display:inline-flex;">${renderIcon('icon_swords', 28)}</span>
                  </div>
                  <div style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:4px;letter-spacing:0.04em;">DUEL 1v1</div>
                  <div style="font-size:11px;color:var(--status-win);font-weight:700;margin-bottom:12px;font-family:var(--font-mono);letter-spacing:0.05em;">CEPAT | 14 KARTU</div>
                  <p class="text-xs text-secondary" style="line-height:1.5;margin:0;">Satu lawan satu di meja eksklusif. Duel murni konsentrasi tinggi, 14 kartu di tangan.</p>
                </div>

                <!-- 4 PEMAIN -->
                <div class="mm-mode-card mode--ai mm-format-card" data-format="fourplayer">
                  <div class="mm-icon-wrapper" style="width:64px;height:64px;border-radius:50%;background:rgba(52,152,219,0.15);border:1.5px solid rgba(52,152,219,0.4);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <span style="display:inline-flex;">${renderIcon('icon_users', 28)}</span>
                  </div>
                  <div style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:4px;letter-spacing:0.04em;">4 PEMAIN</div>
                  <div style="font-size:11px;color:#3498db;font-weight:700;margin-bottom:12px;font-family:var(--font-mono);letter-spacing:0.05em;">KLASIK | 7 KARTU</div>
                  <p class="text-xs text-secondary" style="line-height:1.5;margin:0;">Bermain berempat penuh persaingan sengit. Pembagian 7 kartu per pemain.</p>
                </div>

              </div>
            </div>
          ` : ''}

          <!-- STEP 1.8: STAKE SELECTION (BETTING MODE ONLY) -->
          ${step === 'bet_selection' ? `
            <div id="step-bet-selection">
              <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);font-size:11px;letter-spacing:0.15em;">TENTUKAN NOMINAL TARUHAN</h3>
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:var(--sp-4);width:100%;">
                ${[100, 500, 1000, 2000, 5000].map(amt => {
                  const isDisabled = user.coin < amt;
                  const totalPool = amt * (selectedMode === 'duel' ? 2 : 4);
                  return `
                    <div class="chip-card ${isDisabled ? 'chip-disabled' : ''}" data-bet="${amt}">
                      <div style="font-size:32px;margin-bottom:8px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        ${amt === 100 ? renderIcon('icon_coin', 32) : amt === 500 ? renderIcon('icon_coins', 32) : amt === 1000 ? renderIcon('icon_diamond', 32) : amt === 2000 ? renderIcon('icon_crown', 32) : renderIcon('icon_fire', 32)}
                      </div>
                      <div style="font-family:var(--font-heading);font-size:18px;font-weight:900;color:${isDisabled ? 'var(--text-muted)' : 'var(--text-gold)'};">
                        ${formatNumber(amt)}
                      </div>
                      <div style="font-size:9px;font-family:var(--font-mono);color:var(--text-secondary);margin-top:2px;">
                        Pool: <span class="icon-inline">${renderIcon('icon_coins', 10)}</span> ${formatNumber(totalPool)}
                      </div>
                      ${isDisabled ? `
                        <div class="chip-lock"><span class="icon-inline">${renderIcon('icon_x', 10)}</span> Koin Kurang</div>
                      ` : `
                        <div style="font-size:9px;color:var(--status-win);font-weight:bold;margin-top:4px;text-transform:uppercase;font-family:var(--font-mono);">SIAP MASUK</div>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- STEP 2: LOBBY ROOM (MLBB STYLE) -->
          ${step === 'lobby' ? `
            <div id="step-lobby">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-4);">
                <h3 class="text-label text-secondary" style="margin:0;font-size:11px;letter-spacing:0.15em;">LOBI PERSIAPAN PERTANDINGAN</h3>
                <span class="badge badge--gold text-mono" style="font-size:11px;padding:4px 12px;text-transform:uppercase;">
                  ${selectedMode === 'fourplayer' ? '4 Players' : '1v1 Duel'} (${lobbyPlayers.filter(p => p !== null).length}/${selectedMode === 'fourplayer' ? 4 : 2})
                </span>
              </div>

              <!-- Lobby Slots Row -->
              <div class="lobby-slots-container">
                ${lobbyPlayers.slice(0, selectedMode === 'fourplayer' ? 4 : 2).map((player, idx) => {
                  if (player) {
                    const isLeader = idx === 0;
                    return `
                      <div class="lobby-slot-card slot--filled ${isLeader ? 'slot--leader' : ''}">
                        ${player.isBot ? `<button class="kick-btn" data-slot="${idx}" title="Tendang Bot">✕</button>` : ''}
                        <div class="character-container character-idle" style="width:70px;height:105px;margin-bottom:var(--sp-2);display:inline-flex;align-items:center;justify-content:center;">
                           ${renderCharacter(player.activeCharacter, 'small')}
                        </div>
                        <div style="font-family:var(--font-heading);font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;">${player.username}</div>
                        <div style="font-size:9px;font-family:var(--font-mono);color:${player.isBot ? 'var(--status-lose)' : 'var(--status-win)'};letter-spacing:0.05em;text-transform:uppercase;font-weight:600;">
                          ${player.isBot ? 'A.I. BOT' : 'Pemain'}
                        </div>
                      </div>
                    `;
                  } else {
                    return `
                      <div class="lobby-slot-card slot--empty ${selectedOpponent === 'pvp' ? 'slot--pvp-only' : ''}" style="${selectedOpponent === 'pvp' ? 'pointer-events:none; cursor:default; border-style:solid; border-color:rgba(212,160,23,0.1);' : ''}" data-slot="${idx}">
                        ${selectedOpponent === 'pvp' ? `
                          <div style="margin-bottom:8px;opacity:0.2;">${renderIcon('icon_users', 28)}</div>
                          <div style="font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--text-secondary);letter-spacing:0.04em;">CARI LAWAN</div>
                          <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Menunggu antrean...</div>
                        ` : `
                          <div style="font-size:28px;margin-bottom:8px;animation:heartbeat 2s infinite;color:var(--gold-bright);">+</div>
                          <div style="font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--text-gold);letter-spacing:0.04em;">UNDANG BOT</div>
                          <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Slot Kosong</div>
                        `}
                      </div>
                    `;
                  }
                }).join('')}
              </div>

              <!-- Lobby Action Control Panel (Only show in bot opponent mode) -->
              ${selectedOpponent === 'bot' ? `
                <div class="card" style="padding:var(--sp-4);background:rgba(20,26,16,0.4);border-color:var(--border-default);margin-top:var(--sp-4);display:flex;flex-direction:column;gap:14px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--sp-3);">
                    <div>
                      <h4 style="font-family:var(--font-heading);font-size:14px;color:var(--text-gold);margin:0 0 4px 0;letter-spacing:0.04em;">PENGATURAN BOT MEJA</h4>
                      <p style="font-size:11px;color:var(--text-secondary);margin:0;">Lawan bot akan mengikuti tingkat keahlian yang Anda tetapkan di bawah.</p>
                    </div>
                    <div>
                      <select id="select-bot-level" class="input" style="padding:8px 16px;font-family:var(--font-mono);font-size:12px;border-color:var(--border-gold);color:var(--text-gold);background:var(--bg-void);width:auto;cursor:pointer;">
                        <option value="easy" ${botLevel === 'easy' ? 'selected' : ''}>BOT MUDAH (Easy)</option>
                        <option value="hard" ${botLevel === 'hard' ? 'selected' : ''}>BOT SULIT (Hard)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Big Bottom Match Button -->
              <div style="margin-top:var(--sp-6);text-align:center;">
                ${lobbyPlayers.slice(0, selectedMode === 'fourplayer' ? 4 : 2).includes(null) ? `
                  <!-- Empty slots exist -> queue for PvP matchmaking -->
                  <button class="btn btn-primary btn-lg" id="btn-start-matchmaking" style="box-shadow:0 0 25px rgba(245,200,66,0.35);font-size:18px;padding:16px 48px;letter-spacing:0.08em;font-weight:900;">
                    ${betAmount > 0 ? `MULAI TARUHAN (${renderIcon('icon_coins', 16)} ${formatNumber(betAmount)})` : 'MULAI ANTRIAN (PvP)'}
                  </button>
                  <p class="text-xs text-muted" style="margin-top:10px;font-family:var(--font-body);font-style:italic;">
                    Sistem akan mencari pemain asli secara daring untuk mengisi slot kosong yang tersisa.
                  </p>
                ` : `
                  <!-- Lobby is fully filled with bots -> play offline instantly -->
                  <button class="btn btn-primary btn-lg" id="btn-start-matchmaking" style="box-shadow:0 0 25px rgba(46,204,113,0.3);font-size:18px;padding:16px 48px;letter-spacing:0.08em;font-weight:900;background:linear-gradient(135deg,#2ecc71 0%,#27ae60 100%);color:#fff;">
                    MULAI BERMAIN (LURING)
                  </button>
                  <p class="text-xs text-muted" style="margin-top:10px;font-family:var(--font-body);font-style:italic;">
                    Lobi terisi penuh. Permainan luring melawan A.I. akan segera dimulai tanpa antrean.
                  </p>
                `}
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Column 2: Player Stats & Quick Info (Right) -->
        <div class="mm-sidebar" style="flex:0.8;min-width:300px;display:flex;flex-direction:column;gap:var(--sp-5);">
          <!-- Player Info Card -->
          <div class="card card--premium" style="display:flex;flex-direction:column;align-items:center;padding:var(--sp-5);text-align:center;background:rgba(20,26,16,0.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">
            <div class="character-container character-idle" style="width:90px;height:90px;margin-bottom:var(--sp-3);display:inline-flex;align-items:center;justify-content:center;">
              ${renderCharacter(user.activeCharacter, 'large')}
            </div>
            <div style="font-family:var(--font-heading);font-size:22px;font-weight:700;color:var(--text-gold);margin-bottom:var(--sp-1);">${user.username}</div>
            <div class="coin-display" style="font-size:16px;margin-bottom:var(--sp-2);display:inline-flex;align-items:center;gap:6px;">
              <div class="coin-icon coin-icon--sm"></div>
              <span class="text-mono" style="font-weight:bold;color:var(--gold-bright);">${formatNumber(user.coin)}</span>
            </div>
            
            ${(() => {
              const tier = getRankTier(user.rankPoints || 0);
              return `
                <div style="margin-bottom:var(--sp-4);display:flex;align-items:center;gap:6px;padding:4px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(212,160,23,0.15);border-radius:var(--radius-full);">
                  <span class="icon-inline">${renderRankBadge(tier.badge, tier.level, 18)}</span>
                  <span style="font-family:var(--font-heading);font-weight:700;font-size:11px;letter-spacing:0.04em;color:${tier.color};">${tier.name.toUpperCase()}</span>
                  <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);margin-left:4px;">(${user.rankPoints || 0} RP)</span>
                </div>
              `;
            })()}

            <div style="display:grid;grid-template-columns:1fr 1fr;width:100%;gap:var(--sp-2);text-align:left;border-top:1px solid var(--border-default);padding-top:var(--sp-3);font-size:13px;">
              <span class="text-secondary">Total Main:</span>
              <span class="text-mono" style="text-align:right;font-weight:600;">${user.stats.totalGames}</span>
              <span class="text-secondary">Win Rate:</span>
              <span class="text-mono" style="text-align:right;color:var(--status-win);font-weight:600;">${winRate(user.stats.wins, user.stats.totalGames)}%</span>
            </div>
          </div>

          <!-- Quick Guide Card -->
          <div class="card card--flat" style="padding:var(--sp-5);background:rgba(255,255,255,0.02);border:1px solid var(--border-default);">
            <h4 style="font-family:var(--font-heading);font-size:14px;color:var(--text-gold);margin:0 0 var(--sp-3) 0;letter-spacing:0.08em;text-transform:uppercase;font-weight:700;">Panduan Bermain</h4>
            <ul style="padding-left:16px;margin:0;font-size:13px;color:var(--text-secondary);display:flex;flex-direction:column;gap:10px;line-height:1.45;">
              <li>Cocokkan ujung kartu domino dengan nilai yang sama di atas meja.</li>
              <li>Pemenang adalah pemain pertama yang berhasil menghabiskan semua kartu di tangan.</li>
              <li>Jika semua pemain terblokir (*Gaple*), pemain dengan jumlah titik (*pip*) terkecil yang menang.</li>
              <li>Gunakan tombol **Power-Up** seperti *Block* atau *Shuffle* untuk membalikkan keadaan!</li>
            </ul>
          </div>
        </div>

      </div>

      <!-- SEARCHING RADAR QUEUE OVERLAY -->
      ${step === 'searching' ? `
        <div class="searching-overlay">
          <div style="text-align:center;" class="anim-scale-in">
            <!-- Conic Radar Wheel -->
            <div style="position:relative;width:160px;height:160px;margin:0 auto var(--sp-6);">
              <div style="position:absolute;inset:0;border:2px solid rgba(212,160,23,0.3);border-radius:50%;box-shadow: 0 0 30px rgba(245,200,66,0.1);"></div>
              <div style="position:absolute;inset:25px;border:1px dashed rgba(212,160,23,0.2);border-radius:50%;"></div>
              <div style="position:absolute;inset:50px;border:1px solid rgba(212,160,23,0.15);border-radius:50%;"></div>
              
              <!-- Scanning Sweep -->
              <div style="position:absolute;inset:0;border-radius:50%;background: conic-gradient(from 0deg, transparent 40%, rgba(245,200,66,0.22) 100%);animation:radarSpin 2.2s linear infinite;pointer-events:none;"></div>
              
              <!-- Concentric pulse rings -->
              <div style="position:absolute;inset:0;border:2px solid var(--gold-bright);border-radius:50%;animation:radarPulse 2s ease-out infinite;pointer-events:none;"></div>
              <div style="position:absolute;inset:0;border:2px solid var(--gold-bright);border-radius:50%;animation:radarPulse 2s ease-out 1s infinite;pointer-events:none;"></div>
              
              <div style="position:absolute;top:50%;left:50%;width:14px;height:14px;background:var(--gold-bright);border-radius:50%;transform:translate(-50%,-50%);box-shadow: 0 0 20px var(--gold-bright);"></div>
            </div>
            
            <h3 style="font-family:var(--font-heading);font-size:26px;color:var(--text-gold);margin-bottom:var(--sp-1);letter-spacing:0.06em;font-weight:900;animation:textPulse 1.8s ease-in-out infinite;">MENCARI MEJA...</h3>
            <p class="text-secondary" style="font-size:13px;margin:0 0 var(--sp-4);">Menghubungkan Anda ke server dan pemain aktif lain</p>
            
            <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);padding:10px 28px;border-radius:var(--radius-full);border:1px solid rgba(255,255,255,0.06);font-family:var(--font-mono);font-size:16px;color:var(--text-primary);box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--status-win);animation:pulse 1s infinite;"></span>
              <span>Waktu antrean: <strong id="search-counter" style="color:var(--gold-bright);">${searchSeconds}s</strong></span>
            </div>
            
            <div style="margin-top:var(--sp-6);">
              <button class="btn btn-secondary" id="cancel-search" style="border-radius:var(--radius-full);padding:10px 32px;font-size:12px;letter-spacing:0.05em;">BATALKAN ANTRIAN</button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- MATCH FOUND EPIC CONFIRM OVERLAY -->
      ${step === 'match_found' ? `
        <div class="accept-overlay">
          <div class="accept-content-card anim-scale-in">
            <div style="margin-bottom:var(--sp-1);filter:drop-shadow(0 0 8px rgba(245,200,66,0.4));">${renderIcon('icon_bell', 46)}</div>
            <h2 style="font-family:var(--font-heading);font-size:30px;color:var(--text-gold);margin:0 0 var(--sp-1) 0;letter-spacing:0.08em;font-weight:900;text-shadow:0 0 15px rgba(245,200,66,0.3);">PERTANDINGAN DITEMUKAN!</h2>
            <p class="text-secondary" style="font-size:13px;margin:0 0 var(--sp-4);">Konfirmasi kesiapan Anda sebelum batas waktu berakhir</p>

            <div class="accept-slots-container">
              <!-- Left Column Players -->
              <div class="accept-team-col">
                <!-- Slot 1 (You) -->
                <div class="accept-slot-circle ${userAccepted ? 'ready' : ''}" id="mf-slot-0">
                  <div class="slot-avatar-wrap" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0.9;">
                    ${userAccepted ? renderCharacter(user.activeCharacter, 'small') : '<span style="font-size:24px;opacity:0.4;">👤</span>'}
                  </div>
                  <div class="slot-ready-check">✓</div>
                </div>

                <!-- Slot 2 (if 4-player, otherwise this displays on the right side) -->
                ${selectedMode === 'fourplayer' ? `
                  <div class="accept-slot-circle ${simulatedReadiness[1] ? 'ready' : ''}" id="mf-slot-1">
                    <div class="slot-avatar-wrap" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0.9;">
                      ${simulatedReadiness[1] ? renderCharacter(lobbyPlayers[1]?.activeCharacter || 'bocah_warnet', 'small') : '<span style="font-size:24px;opacity:0.4;">👤</span>'}
                    </div>
                    <div class="slot-ready-check">✓</div>
                  </div>
                ` : ''}
              </div>

              <!-- Center Countdown Wheel & Big CTA Button -->
              <div class="accept-center-action">
                <div class="accept-timer-ring">
                  <svg class="progress-ring" width="140" height="140">
                    <circle class="progress-ring__circle" stroke="var(--gold-bright)" stroke-width="5" fill="transparent" r="62" cx="70" cy="70" stroke-dasharray="389.5" stroke-dashoffset="0"/>
                  </svg>
                  <span class="timer-countdown-text" id="mf-countdown-text">${acceptSeconds}</span>
                  <span class="timer-countdown-label">DETIK</span>
                </div>
                
                <div style="width:180px;height:60px;">
                  ${!userAccepted ? `
                    <button class="btn btn-primary btn-block btn-lg" id="btn-accept-match" style="box-shadow:0 0 25px rgba(245,200,66,0.4);letter-spacing:0.08em;font-size:18px;font-weight:900;padding:12px 0;">MASUK</button>
                  ` : `
                    <button class="btn btn-block btn-lg" disabled style="background:rgba(46,204,113,0.12);border:1.5px solid var(--status-win);color:var(--status-win);letter-spacing:0.08em;font-size:14px;padding:12px 0;opacity:1;cursor:default;font-weight:bold;">MENUNGGU... (${simulatedReadiness.filter(Boolean).length}/${selectedMode === 'fourplayer' ? 4 : 2})</button>
                  `}
                </div>
              </div>

              <!-- Right Column Players -->
              <div class="accept-team-col">
                <!-- Slot 2 for Duel, or Slot 3 for 4-player -->
                <div class="accept-slot-circle ${simulatedReadiness[selectedMode === 'fourplayer' ? 2 : 1] ? 'ready' : ''}" id="mf-slot-${selectedMode === 'fourplayer' ? 2 : 1}">
                  <div class="slot-avatar-wrap" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0.9;">
                    ${simulatedReadiness[selectedMode === 'fourplayer' ? 2 : 1] ? renderCharacter(lobbyPlayers[selectedMode === 'fourplayer' ? 2 : 1]?.activeCharacter || 'kapten_kartu', 'small') : '<span style="font-size:24px;opacity:0.4;">👤</span>'}
                  </div>
                  <div class="slot-ready-check">✓</div>
                </div>

                <!-- Slot 4 (Only for 4-player) -->
                ${selectedMode === 'fourplayer' ? `
                  <div class="accept-slot-circle ${simulatedReadiness[3] ? 'ready' : ''}" id="mf-slot-3">
                    <div class="slot-avatar-wrap" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0.9;">
                      ${simulatedReadiness[3] ? renderCharacter(lobbyPlayers[3]?.activeCharacter || 'pawang_domino', 'small') : '<span style="font-size:24px;opacity:0.4;">👤</span>'}
                    </div>
                    <div class="slot-ready-check">✓</div>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <p style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);margin:0;" id="mf-timer-warning">Konfirmasi otomatis berakhir dalam ${acceptSeconds} detik</p>
          </div>
        </div>
      ` : ''}
    `;

    // MODE DASHBOARD EVENT CLICKS
    if (step === 'mode') {
      content.querySelectorAll('.mm-mode-card').forEach(card => {
        card.addEventListener('click', () => {
          playClick();
          modeType = card.dataset.modetype;
          step = 'format';
          stepHistory.push('format');
          renderStep();
        });
      });
    }

    // FORMAT SELECTION EVENT CLICKS
    if (step === 'format') {
      content.querySelectorAll('.mm-format-card').forEach(card => {
        card.addEventListener('click', () => {
          playClick();
          selectedMode = card.dataset.format;
          
          if (modeType === 'betting') {
            step = 'bet_selection';
            stepHistory.push('bet_selection');
          } else {
            if (modeType === 'classic') {
              isRanked = false;
              selectedOpponent = 'pvp';
            } else if (modeType === 'ranked') {
              isRanked = true;
              selectedOpponent = 'pvp';
            } else if (modeType === 'ai') {
              isRanked = false;
              selectedOpponent = 'bot';
            }
            betAmount = 0;
            initializeLobby();
            step = 'lobby';
            stepHistory.push('lobby');
          }
          renderStep();
        });
      });
    }

    // STAKE SELECTION EVENT CLICKS
    if (step === 'bet_selection') {
      content.querySelectorAll('.chip-card:not(.chip-disabled)').forEach(card => {
        card.addEventListener('click', () => {
          playClick();
          betAmount = parseInt(card.dataset.bet);
          isRanked = false;
          selectedOpponent = 'pvp';
          initializeLobby();
          step = 'lobby';
          stepHistory.push('lobby');
          renderStep();
        });
      });
      content.querySelectorAll('.chip-card.chip-disabled').forEach(card => {
        card.addEventListener('click', () => {
          playSynthSound('fail');
          showToast('Koin Anda tidak mencukupi untuk taruhan ini!', 'error');
        });
      });
    }

    // GENERAL BACK STEP CLICK
    const backBtn = content.querySelector('#btn-back-step');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        playClick();
        handleBack();
      });
    }

    // LOBBY INTERACTION EVENT CLICKS
    if (step === 'lobby') {
      // Add bot clicks on empty slots
      content.querySelectorAll('.lobby-slot-card.slot--empty').forEach(card => {
        card.addEventListener('click', () => {
          const slotIdx = parseInt(card.dataset.slot);
          addBotToLobby(slotIdx);
        });
      });

      // Kick bot clicks
      content.querySelectorAll('.kick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent triggering card clicks
          const slotIdx = parseInt(btn.dataset.slot);
          kickPlayerFromLobby(slotIdx);
        });
      });

      // Bot level selection
      const levelSelect = content.querySelector('#select-bot-level');
      if (levelSelect) {
        levelSelect.addEventListener('change', (e) => {
          botLevel = e.target.value;
          playClick();
        });
      }

      // Start match button in lobby
      const startBtn = content.querySelector('#btn-start-matchmaking');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          playClick();
          // Check if any empty slots remain
          const size = selectedMode === 'fourplayer' ? 4 : 2;
          const slots = lobbyPlayers.slice(0, size);
          const hasEmpty = slots.includes(null);
          
          if (hasEmpty) {
            // There are empty slots -> Search for PvP matches online
            step = 'searching';
            stepHistory.push('searching');
            renderStep();
            startSearch();
          } else {
            // Lobby is fully pre-filled with bots -> Start game directly
            const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
            if (backendToken) {
              startBtn.disabled = true;
              startBtn.textContent = 'MEMPROSES...';
              apiCall('POST', '/matchmaking/create', {
                mode: selectedMode,
                opponentType: 'bot',
                botLevel,
                betAmount: betAmount
              }).then(res => {
                startBtn.disabled = false;
                startBtn.textContent = 'MULAI PERMAINAN';
                if (!res.error && res.data) {
                  state.syncWithBackend().then(() => {
                    startGame(botLevel, { roomId: res.data.roomId, sessionId: res.data.sessionId });
                  });
                } else {
                  startGame(botLevel);
                }
              }).catch(() => {
                startBtn.disabled = false;
                startBtn.textContent = 'MULAI PERMAINAN';
                startGame(botLevel);
              });
            } else {
              startGame(botLevel);
            }
          }
        });
      }
    }

    // CANCEL SEARCH CLICK
    if (step === 'searching') {
      const cancelBtn = content.querySelector('#cancel-search');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          playClick();
          clearInterval(searchTimer);
          if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
          if (searchSocket) { searchSocket.disconnect(); searchSocket = null; }
          if (pvpRoomId) {
            apiCall('DELETE', `/matchmaking/cancel/${pvpRoomId}`).catch(() => {});
            pvpRoomId = null;
          }
          step = 'lobby';
          stepHistory.pop(); // remove search step
          renderStep();
        });
      }
    }


    // MATCH FOUND ACCEPT CLICK
    if (step === 'match_found') {
      const acceptBtn = content.querySelector('#btn-accept-match');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          playSynthSound('accept');
          userAccepted = true;
          simulatedReadiness[0] = true;
          renderStep();
          
          // Re-trigger visual updates
          const mySlot = container.querySelector('#mf-slot-0');
          if (mySlot) mySlot.classList.add('ready');
          
          if (pvpAcceptSocket) {
            pvpAcceptSocket.emit('accept_match');
          }
          
          checkIfAllReady();
        });
      }
    }

    // Trigger visual transitions
    staggerFadeIn('#mm-content .mm-mode-card', { stagger: 0.1, delay: 0.1 });
  }

  // Track the current PvP room being searched
  let pvpRoomId = null;
  let pvpSessionId = null;
  let pollInterval = null;
  let searchSocket = null;

  async function startSearch() {
    searchSeconds = 0;

    // ── COUNTER animation ─────────────────────────────────────────────────
    const counterTimer = setInterval(() => {
      searchSeconds++;
      const counter = document.getElementById('search-counter');
      if (counter) counter.textContent = `${searchSeconds}s`;
    }, 1000);
    searchTimer = counterTimer;

    // ── Call real backend API ─────────────────────────────────────────────
    const token = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
    if (!token) {
      // No backend token — prompt login instead of fallback simulation
      showToast('Token autentikasi tidak ditemukan! Harap Login terlebih dahulu.', 'error');
      clearInterval(counterTimer);
      step = 'lobby';
      stepHistory.pop();
      renderStep();
      return;
    }

    const res = await apiCall('POST', '/matchmaking/create', {
      mode: selectedMode,
      opponentType: 'pvp',
      botLevel,
      isRanked: isRanked,
      betAmount: betAmount
    });

    if (res.error) {
      // Backend unavailable → show error toast and stay in lobby/queue (do not fallback to simulated bot match)
      showToast('Koneksi ke server API gagal! Silakan coba lagi beberapa saat.', 'error');
      clearInterval(counterTimer);
      step = 'lobby';
      stepHistory.pop();
      renderStep();
      return;
    }

    pvpRoomId = res.data.roomId;
    pvpSessionId = res.data.sessionId;

    if (res.data.status === 'ready') {
      // Lucky! Full room immediately (e.g. joined a waiting room that just filled)
      clearInterval(counterTimer);
      _onMatchFound(res.data);
      return;
    }

    // ── Connect Socket.io to room for instant match_ready notification ────
    if (typeof io !== 'undefined') {
      if (searchSocket) { searchSocket.disconnect(); }
      searchSocket = io(`${SOCKET_URL}/game`, {
        query: { roomId: pvpRoomId },
        transports: ['websocket', 'polling']
      });
      searchSocket.on('match_ready', (data) => {
        clearInterval(pollInterval);
        clearInterval(counterTimer);
        if (searchSocket) { searchSocket.disconnect(); searchSocket = null; }
        _onMatchFound(data);
      });
    }

    // ── Poll for room status (fallback if socket misses it) ──────────────
    pollInterval = setInterval(async () => {
      const statusRes = await apiCall('GET', `/matchmaking/status/${pvpRoomId}`);
      if (statusRes.error) return;

      if (statusRes.data.status === 'active' || statusRes.data.status === 'ready') {
        clearInterval(pollInterval);
        clearInterval(counterTimer);
        if (searchSocket) { searchSocket.disconnect(); searchSocket = null; }
        _onMatchFound(statusRes.data);
      }
    }, 2000);
  }

  function _onMatchFound(roomData) {
    // Populate lobbyPlayers from roomData.players
    if (roomData && roomData.players) {
      const neededCount = selectedMode === 'fourplayer' ? 4 : 2;
      lobbyPlayers = Array(neededCount).fill(null);
      // Place current user in slot 0
      const myInfo = roomData.players.find(p => p.userId === user.id);
      if (myInfo) {
        lobbyPlayers[0] = { id: myInfo.userId, username: myInfo.username, activeCharacter: myInfo.activeCharacter, skin: myInfo.skin || 'classic', isBot: false };
      } else {
        lobbyPlayers[0] = { id: user.id, username: user.username, activeCharacter: user.activeCharacter, skin: user.activeSkin || 'classic', isBot: false };
      }
      // Place other players in next slots
      let slotIdx = 1;
      roomData.players.forEach(p => {
        if (p.userId !== user.id && slotIdx < neededCount) {
          lobbyPlayers[slotIdx] = { id: p.userId, username: p.username, activeCharacter: p.activeCharacter, skin: p.skin || 'classic', isBot: false };
          slotIdx++;
        }
      });
    }

    playSynthSound('found');
    step = 'match_found';
    stepHistory.push('match_found');
    userAccepted = false;
    simulatedReadiness = [false, false, false, false];
    acceptSeconds = 10;
    renderStep();
    startAcceptCountdown(roomData);
  }

  /** Fallback: simulate finding a match after 3s (used when backend unreachable) */
  function _simulatedSearch() {
    let s = 0;
    const t = setInterval(() => {
      s++;
      searchSeconds = s;
      const counter = document.getElementById('search-counter');
      if (counter) counter.textContent = `${s}s`;
      if (s >= 3) {
        clearInterval(t);
        step = 'match_found';
        stepHistory.push('match_found');
        userAccepted = false;
        simulatedReadiness = [false, false, false, false];
        acceptSeconds = 10;
        renderStep();
        startAcceptCountdown(null);
      }
    }, 1000);
    searchTimer = t;
  }

  function startAcceptCountdown(roomData) {
    const circumference = 2 * Math.PI * 62; // ~389.5 for radius 62
    const isRealPvP = !!(roomData && roomData.roomId);

    if (isRealPvP && typeof io !== 'undefined') {
      const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
      pvpAcceptSocket = io(`${SOCKET_URL}/game`, {
        query: { roomId: roomData.roomId },
        transports: ['websocket', 'polling']
      });

      pvpAcceptSocket.on('connect', () => {
        pvpAcceptSocket.emit('join_matchmaking_accept', {
          token: backendToken,
          username: user.username,
          character: user.activeCharacter,
          skin: user.activeSkin || 'classic'
        });
      });

      pvpAcceptSocket.on('player_accepted_match', (data) => {
        const idx = lobbyPlayers.findIndex(p => p && p.id === data.userId);
        if (idx >= 0) {
          setPlayerReady(idx);
        }
      });

      pvpAcceptSocket.on('player_joined_accept', (data) => {
        const idx = lobbyPlayers.findIndex(p => p && p.id === data.userId);
        if (idx >= 0) {
          lobbyPlayers[idx].username = data.username;
          lobbyPlayers[idx].activeCharacter = data.character;
          lobbyPlayers[idx].skin = data.skin || 'classic';
          renderStep();
        }
      });
    }

    // Animate circular ring and countdown digits
    acceptTimer = setInterval(() => {
      acceptSeconds--;

      const digit = document.getElementById('mf-countdown-text');
      const warningText = document.getElementById('mf-timer-warning');
      const ringCircle = container.querySelector('.progress-ring__circle');

      if (digit) digit.textContent = acceptSeconds;
      if (warningText) warningText.textContent = `Konfirmasi otomatis berakhir dalam ${acceptSeconds} detik`;

      if (ringCircle) {
        const offset = circumference - (acceptSeconds / 10) * circumference;
        ringCircle.style.strokeDashoffset = offset;
      }

      // Simulate only for bot/local games, not PvP
      if (!isRealPvP) {
        const needed = selectedMode === 'fourplayer' ? 4 : 2;
        if (acceptSeconds === 8) setPlayerReady(1);
        if (needed === 4) {
          if (acceptSeconds === 6) setPlayerReady(2);
          if (acceptSeconds === 4) setPlayerReady(3);
        } else {
          if (acceptSeconds === 6) setPlayerReady(1);
        }
      }

      // Timeout check
      if (acceptSeconds <= 0) {
        clearInterval(acceptTimer);
        if (pvpAcceptSocket) {
          pvpAcceptSocket.disconnect();
          pvpAcceptSocket = null;
        }

        if (!userAccepted) {
          playSynthSound('fail');
          // Cancel the PvP room if we have one
          if (pvpRoomId) {
            apiCall('DELETE', `/matchmaking/cancel/${pvpRoomId}`).catch(() => {});
            pvpRoomId = null;
          }
          showToast('Anda tidak menyetujui pertandingan! Dikembalikan ke Lobi.', 'error');
          step = 'lobby';
          stepHistory.pop();
          renderStep();
        } else {
          startGame(botLevel, roomData);
        }
      }
    }, 1000);
  }

  function setPlayerReady(idx) {
    simulatedReadiness[idx] = true;
    playSynthSound('accept');
    
    // Update player slot visually in the DOM directly
    const slot = container.querySelector(`#mf-slot-${idx}`);
    if (slot) {
      slot.classList.add('ready');
      // If we don't have a customized lobby player name, fill with a random bot
      if (!lobbyPlayers[idx]) {
        const bot = BOT_POOL[idx % BOT_POOL.length];
        lobbyPlayers[idx] = {
          id: `bot_match_${idx}`,
          username: bot.name,
          activeCharacter: bot.id,
          isBot: true
        };
      }
      
      // Render the SVG into the slot avatar
      const avatarWrap = slot.querySelector('.slot-avatar-wrap');
      if (avatarWrap) {
        avatarWrap.innerHTML = renderCharacter(lobbyPlayers[idx].activeCharacter, 'small');
      }
    }
    
    checkIfAllReady();
  }

  function checkIfAllReady() {
    const needed = selectedMode === 'fourplayer' ? 4 : 2;
    const readyCount = simulatedReadiness.slice(0, needed).filter(Boolean).length;
    
    // Update accept action button status text
    const btn = container.querySelector('#btn-accept-match');
    if (btn && userAccepted) {
      btn.textContent = `SIAP BERMAIN (${readyCount}/${needed})`;
    }

    if (readyCount === needed) {
      clearInterval(acceptTimer);
      if (pvpAcceptSocket) {
        pvpAcceptSocket.disconnect();
        pvpAcceptSocket = null;
      }
      playSynthSound('ready');
      
      // Show confirmation dialog state in the modal warning text
      const warningText = document.getElementById('mf-timer-warning');
      if (warningText) {
        warningText.innerHTML = '<span style="color:var(--status-win);font-weight:bold;animation:textPulse 0.5s infinite;">MEJA SIAP! MEMASUKI PERTANDINGAN...</span>';
      }

      // Sync backend balance before transitioning to game screen
      state.syncWithBackend();

      // Wait 1.2 seconds for visual confirmation and audio chime feedback
      setTimeout(() => {
        startGame(botLevel, pvpRoomId ? { roomId: pvpRoomId, sessionId: pvpSessionId } : null);
      }, 1200);
    }
  }

  function showToast(message, type = 'info') {
    import('../components/toast.js').then(module => {
      module.showToast(message, type);
    }).catch(() => {
      console.log(`[Toast] ${type}: ${message}`);
    });
  }

  function startGame(level, roomData) {
    clearInterval(searchTimer);
    clearInterval(acceptTimer);
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }

    // If roomData has a real backend roomId, use it for PvP socket connection
    const roomId = (roomData && roomData.roomId) ? roomData.roomId : generateRoomId();
    const sessionId = (roomData && roomData.sessionId) ? roomData.sessionId : null;
    const isRealPvP = !!(roomData && roomData.roomId);
    
    // Construct final list of players for game.js to load
    const neededCount = selectedMode === 'fourplayer' ? 4 : 2;
    const finalPlayers = [];
    
    for (let i = 0; i < neededCount; i++) {
      if (lobbyPlayers[i]) {
        finalPlayers.push({
          id: lobbyPlayers[i].id,
          username: lobbyPlayers[i].username,
          activeCharacter: lobbyPlayers[i].activeCharacter,
          skin: lobbyPlayers[i].skin || 'classic',
          isBot: lobbyPlayers[i].isBot
        });
      } else {
        // Fallback generator if slot is somehow empty
        const bot = BOT_POOL[i % BOT_POOL.length];
        finalPlayers.push({
          id: `bot_fallback_${i}`,
          username: bot.name,
          activeCharacter: bot.id,
          skin: 'classic',
          isBot: true
        });
      }
    }

    state.set('currentGame', {
      roomId,
      sessionId,
      mode: selectedMode,
      botLevel: level,
      opponentType: isRealPvP ? 'pvp' : selectedOpponent,
      isRealPvP,          // ← game.js uses this to decide socket vs local
      isRanked,           // ← store ranked state!
      betAmount,          // ← store bet amount!
      players: finalPlayers
    });
    location.hash = `#/game/${roomId}`;
  }

  renderStep();

  return () => {
    clearInterval(searchTimer);
    clearInterval(acceptTimer);
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
    if (searchSocket) { searchSocket.disconnect(); searchSocket = null; }
    if (pvpAcceptSocket) { pvpAcceptSocket.disconnect(); pvpAcceptSocket = null; }
    if (navCleanup) navCleanup();
  };
}

export function getRankTier(rp) {
  const points = rp || 0;
  if (points >= 1500) return { name: 'Royale Champion', badge: 'royale', level: '', color: 'var(--gold-bright)' };

  const tiers = [
    { limit: 100, name: 'Bronze I', badge: 'bronze', level: 'I', color: '#cd7f32' },
    { limit: 200, name: 'Bronze II', badge: 'bronze', level: 'II', color: '#cd7f32' },
    { limit: 300, name: 'Bronze III', badge: 'bronze', level: 'III', color: '#cd7f32' },
    { limit: 400, name: 'Silver I', badge: 'silver', level: 'I', color: '#C0C0C0' },
    { limit: 500, name: 'Silver II', badge: 'silver', level: 'II', color: '#C0C0C0' },
    { limit: 600, name: 'Silver III', badge: 'silver', level: 'III', color: '#C0C0C0' },
    { limit: 700, name: 'Gold I', badge: 'gold', level: 'I', color: '#ffd700' },
    { limit: 800, name: 'Gold II', badge: 'gold', level: 'II', color: '#ffd700' },
    { limit: 900, name: 'Gold III', badge: 'gold', level: 'III', color: '#ffd700' },
    { limit: 1000, name: 'Platinum I', badge: 'platinum', level: 'I', color: '#00f6ff' },
    { limit: 1100, name: 'Platinum II', badge: 'platinum', level: 'II', color: '#00f6ff' },
    { limit: 1200, name: 'Platinum III', badge: 'platinum', level: 'III', color: '#00f6ff' },
    { limit: 1300, name: 'Diamond I', badge: 'diamond', level: 'I', color: '#ba55d3' },
    { limit: 1400, name: 'Diamond II', badge: 'diamond', level: 'II', color: '#ba55d3' },
    { limit: 1500, name: 'Diamond III', badge: 'diamond', level: 'III', color: '#ba55d3' }
  ];

  for (const tier of tiers) {
    if (points < tier.limit) return tier;
  }

  return { name: 'Bronze I', badge: 'bronze', level: 'I', color: '#cd7f32' };
}
