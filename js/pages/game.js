import state from '../state.js';
import { dealCards, getValidMoves, calculatePipTotal } from '../game/domino.js';
import { createBoard, playCard, canPlayOnSide } from '../game/board.js';
import { botMove, getBotChatMessage, getBotEmoteReply } from '../game/bot.js';
import { usePowerup, getAvailablePowerups } from '../game/powerups.js';
import { calculateGameResult, calculateCoinReward, determineWinner } from '../game/scoring.js';
import { renderDomino } from '../components/domino-card.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { renderEmote, renderIcon, renderRankBadge, EMOTE_LIST } from '../components/emotes.js';
import { showEmotePopup } from '../components/emote-popup.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';
import { generateBotPlayers, updateMissionProgress, checkAchievements } from '../api.js';
import { formatNumber } from '../utils/format.js';
import { addGameHistory } from '../utils/storage.js';
import { staggerFadeIn } from '../utils/animation.js';
import { playCardPlace, playWin, playLose, playPass, playClick, playCoinCount, playTurnNotification, playTimerWarning, playAchievementUnlock, playEmoteSound } from '../utils/sfx.js';
import { SOCKET_URL, apiCall } from '../config.js';
import { getRankTier } from './matchmaking.js';

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  const gameConfig = state.currentGame;
  if (!gameConfig) { location.hash = '#/matchmaking'; return; }

  const mode = gameConfig.mode || 'duel';
  const botLevel = gameConfig.botLevel || 'easy';
  const numPlayers = mode === 'duel' ? 2 : 4;
  const roomTier = gameConfig.roomTier || 'default';
  const isRealPvP = gameConfig.isRealPvP === true;

  // Deduct upfront coins for offline/local betting games (where backend was offline/skipped)
  const betAmount = gameConfig.betAmount || 0;
  if (!isRealPvP && !gameConfig.sessionId && betAmount > 0) {
    const success = state.spendCoin(betAmount);
    if (!success) {
      showToast('Koin Anda tidak cukup untuk taruhan ini!', 'error');
      location.hash = '#/matchmaking';
      return;
    }
  }

  // ── PvP mode: get backend JWT token ───────────────────────────────────────
  const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');

  const players = gameConfig.players || [
    { id: user.id, username: user.username, activeCharacter: user.activeCharacter, skin: user.activeSkin || 'classic', isBot: false },
    ...generateBotPlayers(numPlayers - 1, mode)
  ];

  const hands = dealCards(numPlayers);
  const board = createBoard();

  let cleanupVoiceChatFn = null;

  const gs = {
    players,
    hands,
    board,
    currentPlayerIndex: 0,
    turnTimer: 30,
    timerInterval: null,
    passCount: 0,
    consecutivePasses: 0,
    gameOver: false,
    selectedCard: null,
    usedPowerups: [],
    doubleCoin: false,
    blockedPlayer: -1,
    chatMessages: [],
    chatOpen: false,
    chatUnread: 0,         // Unread message counter when panel is closed
    pendingSide: null,
    passiveUsed: { si_hoki: false, juragan_meja: false, sang_bluffer: false },
    undoState: null,
    pvpSocket: null,       // Socket.io connection for PvP
    myPlayerIndex: 0,      // Will be set by server for PvP
    voiceMuted: true,
    voiceInitialized: false,
    playerVoiceStates: {}  // key: userId, value: { isMuted: true, isSpeaking: false }
  };

  container.innerHTML = '';
  const gameEl = document.createElement('div');
  gameEl.className = `game-container tier-${roomTier}`;

  container.appendChild(gameEl);

  function renderGame() {
    const myIdx = isRealPvP ? gs.myPlayerIndex : 0;
    const validMoves = gs.currentPlayerIndex === myIdx && !gs.gameOver
      ? getValidMoves(gs.hands[myIdx], gs.board.left, gs.board.right)
      : [];

    const validIndices = new Set(validMoves.map(m => m.index));
    const powerups = getAvailablePowerups();

    const renderOpponent = (idx) => {
      const p = gs.players[idx];
      if (!p) return '';
      const isActive = gs.currentPlayerIndex === idx && !gs.gameOver;
      const isBlocked = gs.blockedPlayer === idx;
      
      const vState = gs.playerVoiceStates[p.id] || { isMuted: true, isSpeaking: false };
      const voiceBadgeClass = `opponent-voice-badge ${vState.isMuted ? 'opponent-voice-badge--muted' : ''} ${vState.isSpeaking ? 'opponent-voice-badge--speaking' : ''}`;
      const voiceBadgeContent = vState.isMuted ? renderIcon('icon_mic_off', 14) : renderIcon('icon_mic', 14);
      const voiceBadgeTitle = vState.isMuted ? 'Mic Nonaktif' : 'Mic Aktif';
      
      return `
        <div class="opponent ${isActive ? 'opponent--active' : ''} ${isBlocked ? 'opponent-blocked' : ''} ${vState.isSpeaking ? 'voice-speaking' : ''}" id="opponent-card-${p.id}">
          ${isRealPvP ? `<div class="${voiceBadgeClass}" id="voice-badge-${p.id}" title="${voiceBadgeTitle}">${voiceBadgeContent}</div>` : ''}
          <div class="opponent-avatar ${isActive ? 'avatar--glow' : ''}">
            ${renderCharacter(p.activeCharacter, 'tiny')}
          </div>
          ${isActive ? '<div class="opponent-thinking"><span></span><span></span><span></span></div>' : ''}
          <div class="opponent-name">${p.username}</div>
          <div class="opponent-cards">
            ${gs.hands[idx].length <= 5
              ? Array(gs.hands[idx].length).fill('<div class="opponent-card-back"></div>').join('')
              : `<div class="opponent-card-back"></div><span class="text-xs text-mono text-gold" style="font-weight:bold;margin-left:4px;">×${gs.hands[idx].length}</span>`
            }
          </div>
        </div>
      `;
    };

    gameEl.innerHTML = `
      <!-- Header -->
      <div class="game-header">
        <div class="game-header-left">
          <span class="game-room-id">${gameConfig.roomId}</span>
          <span class="text-xs text-secondary">
            ${mode === 'duel' ? 'Duel 1v1' : '4 Pemain'}
            ${gameConfig.betAmount > 0 
              ? `· <strong style="color:var(--gold-bright);">Taruhan: <span class="icon-inline">${renderIcon('icon_coins', 14)}</span> ${formatNumber(gameConfig.betAmount)} (Pool: <span class="icon-inline">${renderIcon('icon_coins', 14)}</span> ${formatNumber(gameConfig.betAmount * numPlayers)})</strong>`
              : `· ${botLevel === 'easy' ? 'Mudah' : 'Sulit'}`
            }
          </span>
        </div>
        <div class="game-timer">
          <div class="game-timer-bar">
            <div class="game-timer-fill ${gs.turnTimer <= 10 ? 'game-timer-fill--warning' : ''} ${gs.turnTimer <= 5 ? 'game-timer-fill--danger' : ''}"
                 style="width:${(gs.turnTimer / 30) * 100}%"></div>
          </div>
          <span>${gs.turnTimer}s</span>
        </div>
        <div class="flex items-center gap-3">
          ${isRealPvP ? `
            <div class="voice-controls">
              <button class="voice-btn ${gs.voiceMuted ? 'voice-btn--muted' : ''}" 
                      id="btn-toggle-mic" 
                      title="${!gs.voiceInitialized ? 'Voice chat menghubungkan...' : gs.voiceMuted ? 'Mikrofon Mati' : 'Mikrofon Aktif'}" 
                      ${!gs.voiceInitialized ? 'disabled' : ''}>
                ${gs.voiceMuted ? renderIcon('icon_mic_off', 16) : `${renderIcon('icon_mic', 16)} ON`}
              </button>
            </div>
          ` : ''}
          <div class="coin-display" style="font-size:14px;${gs.doubleCoin ? 'animation:doubleGlow 1s ease infinite;' : ''}">
            <div class="coin-icon coin-icon--sm"></div>
            <span>${formatNumber(user.coin)}</span>
          </div>
        </div>
      </div>

      <!-- 4-Direction Game Play Area Wrapper -->
      <div class="game-play-area-wrapper">

        ${(() => {
          const oppIndices = gs.players.map((_, i) => i).filter(i => i !== myIdx);
          const opp0 = oppIndices[0] ?? -1;
          const opp1 = oppIndices[1] ?? -1;
          const opp2 = oppIndices[2] ?? -1;
          const isFourPlayer = gs.players.length === 4;
          return `
        <!-- Top Area: main opponent -->
        <div class="game-area-top">
          ${isFourPlayer ? renderOpponent(opp1) : renderOpponent(opp0)}
        </div>

        <!-- Middle Area (Left Opponent + Board + Right Opponent) -->
        <div class="game-area-middle">
          <!-- Left Opponent (4p only) -->
          ${isFourPlayer ? `<div class="game-area-left">${renderOpponent(opp0)}</div>` : ''}

          <!-- Center Board -->
          <div class="game-board-container">
            <div class="game-board table-${roomTier}" id="game-board">
              <!-- Casino Table Markings -->
              <div class="casino-markings">
                <div class="casino-insignia">
                  <div class="casino-logo-text">GAPLE ROYALE</div>
                  <div class="casino-sub-text">♛ VELVET NOIR CASINO CLUB ♛</div>
                  <div class="casino-rules-text">MATA DOMINO MURNI • SPLIT ATAS BAWAH</div>
                </div>
              </div>
              ${gs.board.chain.length === 0
                ? '<div class="board-empty-msg" style="position:relative;z-index:2;">Taruh kartu pertama</div>'
                : renderBoardSnake(gs.board.chain, user.activeSkin, gs.board.centerIndex)
              }
            </div>
          </div>

          <!-- Right Opponent (4p only) -->
          ${isFourPlayer ? `<div class="game-area-right">${renderOpponent(opp2)}</div>` : ''}
        </div>`;
        })()}

      </div>

      <!-- Player Area (Bottom) -->
      <div class="game-player-area">
        <!-- Power-ups -->
        <div class="powerup-bar">
          ${powerups.map(pu => `
            <div class="powerup-slot ${pu.stock <= 0 || gs.currentPlayerIndex !== myIdx || gs.gameOver || gs.usedPowerups.includes(pu.id) ? 'powerup-slot--disabled' : ''}"
                 data-powerup="${pu.id}" title="${pu.name}">
               <span class="powerup-icon">${renderIcon(pu.iconId, 20)}</span>
               <span class="powerup-name">${pu.name}</span>
               <span class="powerup-count">${pu.stock}</span>
            </div>
          `).join('')}
        </div>

        <!-- Player Hand -->
        <div class="player-hand" id="player-hand">
          ${gs.hands[myIdx].map(([a, b], i) => {
            const isValid = validIndices.has(i);
            const isSelected = gs.selectedCard === i;
            return `<div class="domino-wrapper" data-index="${i}" data-valid="${isValid}">
              ${renderDomino(a, b, {
                skin: user.activeSkin
              }).replace('class="domino', `class="domino ${isSelected ? 'domino--selected' : ''} ${!isValid && gs.currentPlayerIndex === myIdx ? 'domino--disabled' : ''}`)}
            </div>`;
          }).join('')}
        </div>

        <!-- Actions -->
        <div class="player-actions">
          ${gs.currentPlayerIndex === myIdx && !gs.gameOver ? `
            ${gs.pendingSide
              ? `<div class="side-select-panel" style="display:flex;flex-direction:column;align-items:center;gap:var(--sp-3);width:100%;">
                   <span class="text-sm text-secondary">Pilih sisi untuk menaruh kartu:</span>
                   <div style="display:flex;gap:var(--sp-3);width:100%;justify-content:center;flex-wrap:wrap;">
                     <button class="btn btn-primary" id="btn-side-left" style="flex:1;min-width:120px;max-width:200px;padding:14px 16px;font-size:14px;">← KIRI (${gs.board.left})</button>
                     <button class="btn btn-primary" id="btn-side-right" style="flex:1;min-width:120px;max-width:200px;padding:14px 16px;font-size:14px;">KANAN (${gs.board.right}) →</button>
                   </div>
                   <button class="btn btn-ghost btn-sm" id="btn-side-cancel">Batal</button>
                 </div>`
              : validMoves.length === 0
                ? '<button class="btn btn-secondary" id="btn-pass" style="width:100%;max-width:250px;">PASS</button>'
                : gs.selectedCard !== null
                  ? `<div style="display:flex;gap:12px;width:100%;justify-content:center;max-width:400px;">
                       <button class="btn btn-secondary" id="btn-pass" style="flex:1;">SKIP</button>
                       <button class="btn btn-primary" id="btn-play" style="flex:2;">TARUH KARTU</button>
                     </div>`
                  : `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;">
                       <button class="btn btn-secondary" id="btn-pass" style="width:100%;max-width:200px;">SKIP</button>
                       <span class="text-sm text-secondary">Pilih kartu untuk dimainkan</span>
                     </div>`
            }
            ${!gs.passiveUsed.sang_bluffer && user.activeCharacter === 'sang_bluffer' && validMoves.length === 0
              ? '<button class="btn btn-secondary btn-sm" id="btn-bluffer-skip" style="margin-left:var(--sp-2);">Skip (Bluffer)</button>'
              : ''}
            ${gs.undoState && !gs.passiveUsed.juragan_meja && user.activeCharacter === 'juragan_meja'
              ? '<button class="btn btn-secondary btn-sm" id="btn-undo" style="margin-left:var(--sp-2);">Undo (Juragan)</button>'
              : ''}
          ` : gs.gameOver
            ? ''
            : `<span class="text-sm text-secondary" style="display:flex;align-items:center;gap:8px;">
                 <span class="spinner spinner--sm"></span>
                 Menunggu giliran ${gs.players[gs.currentPlayerIndex].username}...
               </span>`
          }
        </div>
      </div>

      <!-- Chat Toggle -->
      <div class="chat-toggle" id="chat-toggle" style="position:relative">
        💬
        ${gs.chatUnread > 0 ? `<span style="position:absolute;top:-4px;right:-4px;background:#e74c3c;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:bold;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);border:2px solid var(--bg-surface);">${gs.chatUnread > 9 ? '9+' : gs.chatUnread}</span>` : ''}
      </div>

      <!-- Chat Panel -->
      <div class="chat-panel ${gs.chatOpen ? 'chat-panel--open' : ''}" id="chat-panel">
        <div class="chat-panel-header">
          <span class="chat-panel-title">Chat</span>
          <button class="btn btn-ghost" id="chat-close" style="font-size:18px;">&times;</button>
        </div>
        <div class="chat-messages" id="chat-messages">
          ${gs.chatMessages.map(msg => {
            const emoteMatch = msg.content.match(/^\[emote:(\w+)\]$/);
            const contentHtml = emoteMatch
              ? `<span class="chat-emote-inline">${renderEmote(emoteMatch[1], 'medium')}</span>`
              : escapeHtml(msg.content);
            return `
            <div class="chat-msg">
              <div class="chat-msg-avatar">${msg.username[0]}</div>
              <div class="chat-msg-content">
                <span class="chat-msg-user">${msg.username}</span>
                <div class="chat-msg-text">${contentHtml}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="emote-bar">
          ${EMOTE_LIST.map(e =>
            `<button class="emote-btn" data-emote="${e.id}" title="${e.name}">${renderEmote(e.id, 'small')}</button>`
          ).join('')}
        </div>
        <div class="chat-input-area">
          <input class="chat-input" type="text" placeholder="Ketik pesan..." id="chat-input" maxlength="200">
          <button class="chat-send" id="chat-send">Kirim</button>
        </div>
      </div>
    `;

    attachHandlers();
  }

  function attachHandlers() {
    // Card selection — in PvP mode use myPlayerIndex; in local mode always 0
    const myIdx = isRealPvP ? gs.myPlayerIndex : 0;

    gameEl.querySelectorAll('.domino-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        if (gs.currentPlayerIndex !== myIdx || gs.gameOver) return;
        const idx = parseInt(wrapper.dataset.index);
        const valid = wrapper.dataset.valid === 'true';
        if (!valid) return;

        if (gs.selectedCard === idx) {
          handlePlayCard(idx);
        } else {
          gs.selectedCard = idx;
          renderGame();
        }
      });
    });

    // Play button
    const playBtn = gameEl.querySelector('#btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (gs.selectedCard !== null) handlePlayCard(gs.selectedCard);
      });
    }

    // Pass button
    const passBtn = gameEl.querySelector('#btn-pass');
    if (passBtn) {
      passBtn.addEventListener('click', handlePass);
    }

    // Side selection
    const sideLeft = gameEl.querySelector('#btn-side-left');
    const sideRight = gameEl.querySelector('#btn-side-right');
    const sideCancel = gameEl.querySelector('#btn-side-cancel');
    const _myIdx = isRealPvP ? gs.myPlayerIndex : 0;
    if (sideLeft && gs.pendingSide) {
      sideLeft.addEventListener('click', () => {
        const { cardIndex } = gs.pendingSide;
        gs.pendingSide = null;
        executePlay(_myIdx, cardIndex, 'left');
      });
    }
    if (sideRight && gs.pendingSide) {
      sideRight.addEventListener('click', () => {
        const { cardIndex } = gs.pendingSide;
        gs.pendingSide = null;
        executePlay(_myIdx, cardIndex, 'right');
      });
    }
    if (sideCancel) {
      sideCancel.addEventListener('click', () => {
        gs.pendingSide = null;
        gs.selectedCard = null;
        renderGame();
      });
    }

    // Sang Bluffer: skip without penalty
    const blufferBtn = gameEl.querySelector('#btn-bluffer-skip');
    if (blufferBtn) {
      blufferBtn.addEventListener('click', () => {
        gs.passiveUsed.sang_bluffer = true;
        showToast('Sang Bluffer: Skip tanpa penalty!', 'success');
        nextTurn();
      });
    }

    // Juragan Meja: undo
    const undoBtn = gameEl.querySelector('#btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (!gs.undoState) return;
        const _myIdx = isRealPvP ? gs.myPlayerIndex : 0;
        gs.hands[_myIdx] = gs.undoState.hand;
        gs.board = gs.undoState.board;
        gs.undoState = null;
        gs.passiveUsed.juragan_meja = true;
        showToast('Juragan Meja: Langkah di-undo!', 'success');
        renderGame();
      });
    }

    // Power-ups
    gameEl.querySelectorAll('.powerup-slot:not(.powerup-slot--disabled)').forEach(slot => {
      slot.addEventListener('click', async () => {
        const puId = slot.dataset.powerup;
        const confirmed = await showConfirm(`Gunakan ${slot.querySelector('.powerup-name').textContent}?`);
        if (!confirmed) return;
        handlePowerup(puId);
      });
    });

    // Chat
    const chatToggle = gameEl.querySelector('#chat-toggle');
    const chatClose = gameEl.querySelector('#chat-close');
    if (chatToggle) chatToggle.addEventListener('click', () => {
      gs.chatOpen = true;
      gs.chatUnread = 0; // Clear unread badge when opening
      renderGame();
      // Auto-scroll to bottom
      setTimeout(() => {
        const msgs = gameEl.querySelector('#chat-messages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }, 50);
    });
    if (chatClose) chatClose.addEventListener('click', () => { gs.chatOpen = false; renderGame(); });

    const chatInput = gameEl.querySelector('#chat-input');
    const chatSend = gameEl.querySelector('#chat-send');
    if (chatSend && chatInput) {
      const sendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        addChatMessage(user.username, text);
        chatInput.value = '';
        user.stats.chatMessagesSent++;
        updateMissionProgress('chat_5_messages', 1);
        state.persistUser();

        if (isRealPvP && gs.pvpSocket) {
          // Send real message to all players via server
          gs.pvpSocket.emit('chat', { message: text });
        } else {
          // Bot auto-reply in local mode
          setTimeout(() => {
            const botPlayer = gs.players.find(p => p.isBot);
            if (botPlayer) addChatMessage(botPlayer.username, getBotChatMessage());
          }, 800 + Math.random() * 1500);
        }
      };
      chatSend.addEventListener('click', sendMessage);
      chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
    }

    gameEl.querySelectorAll('.emote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('emote-btn--cooldown')) return;
        const emoteId = btn.dataset.emote;

        addChatMessage(user.username, `[emote:${emoteId}]`);
        showEmotePopup(user.id, emoteId, gameEl);
        playEmoteSound(emoteId);

        if (isRealPvP && gs.pvpSocket) {
          gs.pvpSocket.emit('emote', { emoteId });
        } else {
          setTimeout(() => {
            const botPlayer = gs.players.find(p => p.isBot);
            if (botPlayer) {
              const replyId = getBotEmoteReply();
              if (replyId) {
                addChatMessage(botPlayer.username, `[emote:${replyId}]`);
                showEmotePopup(botPlayer.id, replyId, gameEl);
                playEmoteSound(replyId);
              }
            }
          }, 800 + Math.random() * 1200);
        }

        gameEl.querySelectorAll('.emote-btn').forEach(b => b.classList.add('emote-btn--cooldown'));
        setTimeout(() => {
          gameEl.querySelectorAll('.emote-btn').forEach(b => b.classList.remove('emote-btn--cooldown'));
        }, 2000);
      });
    });

    // Auto-scroll chat
    const chatMsgs = gameEl.querySelector('#chat-messages');
    if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function addChatMessage(username, content) {
    gs.chatMessages.push({ username, content, timestamp: new Date().toISOString() });
    if (gs.chatMessages.length > 50) gs.chatMessages.shift();

    // If chat panel is open: fast partial DOM append (no full re-render)
    const chatMsgs = gameEl.querySelector('#chat-messages');
    if (chatMsgs && gs.chatOpen) {
      const emoteMatch = content.match(/^\[emote:(\w+)\]$/);
      const contentHtml = emoteMatch
        ? `<span class="chat-emote-inline">${renderEmote(emoteMatch[1], 'medium')}</span>`
        : escapeHtml(content);
      const msgEl = document.createElement('div');
      msgEl.className = 'chat-msg';
      msgEl.innerHTML = `
        <div class="chat-msg-avatar">${username[0]}</div>
        <div class="chat-msg-content">
          <span class="chat-msg-user">${username}</span>
          <div class="chat-msg-text">${contentHtml}</div>
        </div>`;
      chatMsgs.appendChild(msgEl);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    } else {
      // Chat panel closed: increment unread counter and update just the badge
      gs.chatUnread++;
      const toggleBtn = gameEl.querySelector('#chat-toggle');
      if (toggleBtn) {
        const existing = toggleBtn.querySelector('span');
        if (existing) existing.remove();
        const badge = document.createElement('span');
        badge.style.cssText = 'position:absolute;top:-4px;right:-4px;background:#e74c3c;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:bold;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);border:2px solid var(--bg-surface);';
        badge.textContent = gs.chatUnread > 9 ? '9+' : gs.chatUnread;
        toggleBtn.appendChild(badge);
      }
    }
  }

  function handlePlayCard(cardIndex) {
    const myIdx = isRealPvP ? gs.myPlayerIndex : 0;
    const card = gs.hands[myIdx][cardIndex];
    const validMoves = getValidMoves(gs.hands[myIdx], gs.board.left, gs.board.right);
    const move = validMoves.find(m => m.index === cardIndex);
    if (!move) return;

    if (move.sides.length > 1 && gs.board.chain.length > 0) {
      gs.pendingSide = { cardIndex, move };
      renderGame();
      return;
    }

    executePlay(myIdx, cardIndex, move.sides[0]);
  }

  function executePlay(playerIdx, cardIndex, side) {
    // ── PvP: emit to server and let server broadcast ───────────────────────
    if (isRealPvP && gs.pvpSocket && playerIdx === gs.myPlayerIndex) {
      const card = gs.hands[playerIdx][cardIndex];
      // Optimistic: remove card locally from hand
      gs.hands[playerIdx].splice(cardIndex, 1);
      if (gs.board.chain.length === 0) side = 'first';
      
      // JANGAN update board secara lokal. Biarkan server broadcast 'card_played'
      // playCard(gs.board, card, side); // Dihapus untuk mencegah desinkronisasi board
      
      playCardPlace(user.activeSkin || 'classic');
      gs.selectedCard = null;
      gs.pendingSide = null;
      // Emit to server
      gs.pvpSocket.emit('play_card', { card, side });
      renderGame();
      return;
    }

    // ── Local (bot/offline) mode ──────────────────────────────────────────
    const _localMyIdx = isRealPvP ? gs.myPlayerIndex : 0;
    if (playerIdx === _localMyIdx && user.activeCharacter === 'juragan_meja' && !gs.passiveUsed.juragan_meja) {
      gs.undoState = {
        hand: [...gs.hands[_localMyIdx]],
        board: JSON.parse(JSON.stringify(gs.board))
      };
    }

    const card = gs.hands[playerIdx][cardIndex];
    gs.hands[playerIdx].splice(cardIndex, 1);

    if (gs.board.chain.length === 0) side = 'first';
    playCard(gs.board, card, side);
    
    // Play sound based on bot/player active skin
    const skin = gs.players[playerIdx]?.skin || 'classic';
    playCardPlace(skin);

    gs.selectedCard = null;
    gs.pendingSide = null;
    gs.consecutivePasses = 0;

    if (gs.hands[playerIdx].length === 0) {
      endGame(playerIdx, 'hand_empty');
      return;
    }

    nextTurn();
  }

  function handlePass() {
    // ── PvP: emit pass to server ──────────────────────────────────────────
    if (isRealPvP && gs.pvpSocket) {
      gs.consecutivePasses++;
      gs.selectedCard = null;
      playPass();
      gs.pvpSocket.emit('pass');
      renderGame();
      return;
    }

    // ── Local mode ────────────────────────────────────────────────────────
    gs.consecutivePasses++;
    gs.selectedCard = null;
    playPass();
    autoTriggerEmote(user.id, 'pass');

    if (gs.consecutivePasses >= gs.players.length) {
      const winnerIdx = determineWinner(gs.hands);
      endGame(winnerIdx, 'gaple');
      return;
    }

    nextTurn();
  }

  function nextTurn() {
    gs.currentPlayerIndex = (gs.currentPlayerIndex + 1) % gs.players.length;

    // Skip blocked player
    if (gs.blockedPlayer === gs.currentPlayerIndex) {
      gs.blockedPlayer = -1;
      gs.currentPlayerIndex = (gs.currentPlayerIndex + 1) % gs.players.length;
    }

    resetTimer();
    renderGame();

    if (gs.players[gs.currentPlayerIndex].isBot && !gs.gameOver) {
      setTimeout(() => executeBotTurn(), 800 + Math.random() * 1200);
    }
  }

  function executeBotTurn() {
    if (gs.gameOver) return;
    const idx = gs.currentPlayerIndex;
    const result = botMove(gs.hands[idx], gs.board.left, gs.board.right, botLevel);

    if (result) {
      executePlay(idx, result.index, result.side);
    } else {
      gs.consecutivePasses++;
      if (gs.consecutivePasses >= gs.players.length) {
        const winnerIdx = determineWinner(gs.hands);
        endGame(winnerIdx, 'gaple');
        return;
      }
      nextTurn();
    }
  }

  function handlePowerup(puId) {
    const result = usePowerup(puId, gs);
    if (result.error) {
      showToast(result.message || result.error, 'error');
      return;
    }

    showToast(result.message, 'success');

    if (result.type === 'shuffle') {
      const cards = gameEl.querySelectorAll('.player-hand .domino-wrapper');
      cards.forEach(card => {
        const rx = (Math.random() - 0.5) * 80;
        const ry = (Math.random() - 0.5) * 30;
        const rr = (Math.random() - 0.5) * 25;
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform = `translate(${rx}px, ${ry}px) rotate(${rr}deg)`;
        setTimeout(() => {
          card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
          card.style.transform = 'translate(0,0) rotate(0)';
        }, 350);
      });
      setTimeout(renderGame, 800);
      return;
    }

    if (result.type === 'peek' && result.revealedCard) {
      const oppCards = gameEl.querySelectorAll(`.opponent:nth-child(${result.targetIndex}) .opponent-card-back`);
      if (oppCards.length > 0) {
        const target = oppCards[Math.floor(Math.random() * oppCards.length)];
        target.style.transition = 'transform 0.3s ease, background 0.3s ease';
        target.style.transform = 'rotateY(180deg) scale(1.3)';
        target.style.background = 'var(--gold-pale)';
        target.innerHTML = `<span style="font-size:8px;font-weight:bold;color:var(--text-dark);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">${result.revealedCard[0]}|${result.revealedCard[1]}</span>`;
        setTimeout(() => {
          target.style.transform = '';
          target.style.background = '';
          target.innerHTML = '';
        }, 2500);
      }
      showToast(`${result.targetPlayer.username}: [${result.revealedCard[0]}|${result.revealedCard[1]}]`, 'info', 3000);
    }

    if (result.type === 'block') {
      const blockedOpp = gameEl.querySelectorAll('.opponent')[result.blockedIndex - 1];
      if (blockedOpp) {
        const chain = document.createElement('div');
        chain.textContent = '🔗';
        chain.style.cssText = 'position:absolute;top:-8px;right:-8px;font-size:20px;animation:scaleIn 0.3s ease;';
        blockedOpp.style.position = 'relative';
        blockedOpp.appendChild(chain);
        setTimeout(() => chain.remove(), 3000);
      }
    }

    if (result.type === 'double_coin') {
      const coinEl = gameEl.querySelector('.coin-display');
      if (coinEl) coinEl.style.animation = 'doubleGlow 1s ease infinite';
    }

    renderGame();
  }

  function resetTimer() {
    gs.turnTimer = 30;
    clearInterval(gs.timerInterval);
    const myIdx = isRealPvP ? gs.myPlayerIndex : 0;
    if (gs.currentPlayerIndex === myIdx && !gs.gameOver) {
      playTurnNotification();
    }
    gs.timerInterval = setInterval(() => {
      gs.turnTimer--;
      const timerFill = gameEl.querySelector('.game-timer-fill');
      const timerText = gameEl.querySelector('.game-timer span');
      if (timerFill) {
        timerFill.style.width = `${(gs.turnTimer / 30) * 100}%`;
        timerFill.className = `game-timer-fill ${gs.turnTimer <= 10 ? 'game-timer-fill--warning' : ''} ${gs.turnTimer <= 5 ? 'game-timer-fill--danger' : ''}`;
      }
      if (timerText) timerText.textContent = `${gs.turnTimer}s`;
      if (gs.turnTimer <= 5 && gs.turnTimer > 0 && gs.currentPlayerIndex === myIdx) {
        playTimerWarning();
      }

      if (gs.turnTimer <= 0) {
        clearInterval(gs.timerInterval);
        const myIdx = isRealPvP ? gs.myPlayerIndex : 0;
        if (gs.currentPlayerIndex === myIdx) {
          const validMoves = getValidMoves(gs.hands[myIdx], gs.board.left, gs.board.right);
          if (validMoves.length > 0) {
            const move = validMoves[0];
            executePlay(myIdx, move.index, move.sides[0]);
          } else {
            handlePass();
          }
        }
      }
    }, 1000);
  }

  function showGameOverPopup(isWinner, coinTotal, activeCharacter, reason, rankedInfo) {
    if (isWinner) {
      playWin();
    } else {
      playLose();
    }

    const overlay = document.createElement('div');
    overlay.className = 'game-over-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(8, 10, 6, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes goldShimmer {
        0%, 100% { background-position: -200% center; }
        50% { background-position: 200% center; }
      }
      @keyframes crownFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(3deg); }
      }
      @keyframes popIn {
        0% { transform: scale(0.85); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes starSpin {
        0% { transform: scale(0) rotate(-45deg); opacity: 0; }
        70% { transform: scale(1.2) rotate(10deg); opacity: 1; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes textPulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      .game-over-modal-card {
        width: 90%;
        max-width: 440px;
        background: linear-gradient(135deg, rgba(20, 26, 16, 0.98), rgba(9, 24, 14, 0.98));
        border: 2px solid ${isWinner ? 'var(--border-bright)' : 'rgba(231, 76, 60, 0.4)'};
        box-shadow: 0 0 45px ${isWinner ? 'rgba(245, 200, 66, 0.3)' : 'rgba(231, 76, 60, 0.2)'};
        border-radius: var(--radius-xl);
        padding: var(--sp-6) var(--sp-5);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        position: relative;
        overflow: hidden;
      }
      .winner-title-shimmer {
        font-family: var(--font-display);
        font-size: 52px;
        font-weight: 900;
        letter-spacing: 0.08em;
        margin: var(--sp-2) 0;
        background: ${isWinner ? 'linear-gradient(90deg, #ffe066, #f5c842, #d4a017, #ffe066)' : 'linear-gradient(90deg, #bdc3c7, #95a5a6, #7f8c8d, #bdc3c7)'};
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: goldShimmer 3s linear infinite;
        filter: drop-shadow(0 0 15px ${isWinner ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.1)'});
      }
    `;
    document.head.appendChild(style);

    if (isWinner) {
      setTimeout(() => {
        import('../utils/animation.js').then(module => {
          module.coinRain(overlay, 25);
        });
      }, 300);
    }

    const crownSvg = isWinner ? `
      <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="var(--gold-bright)" stroke-width="1.5" style="animation: crownFloat 3s ease-in-out infinite; filter: drop-shadow(0 4px 10px rgba(245,200,66,0.45));">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="var(--gold-gradient)" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="2" cy="4" r="1.5" fill="#fff"/>
        <circle cx="8" cy="4" r="1.5" fill="#fff"/>
        <circle cx="12" cy="4" r="1.5" fill="#fff"/>
        <circle cx="16" cy="4" r="1.5" fill="#fff"/>
        <circle cx="22" cy="4" r="1.5" fill="#fff"/>
      </svg>
    ` : `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#95a5a6" stroke-width="1.5" style="opacity: 0.5;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="4 4"/>
        <path d="M8 15s1.5-2 4-2 4 2 4 2" stroke-linecap="round"/>
        <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
        <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
      </svg>
    `;

    const bannerText = reason === 'gaple' 
      ? (isWinner ? 'KEMENANGAN GAPLE SEMPURNA!' : 'TERBLOKIR (GAPLE)') 
      : reason === 'timeout'
        ? (isWinner ? 'LAWAN WAKTU HABIS (MENANG AUTO)!' : 'KAMU WAKTU HABIS (KALAH AUTO)!')
        : reason === 'disconnect'
          ? (isWinner ? 'LAWAN KELUAR GAME (MENANG AUTO)!' : 'KAMU KELUAR GAME (KALAH AUTO)!')
          : (isWinner ? 'KARTU HABIS!' : 'GAME SELESAI');

    const starDecoration = isWinner ? `
      <div style="display:flex;gap:8px;margin:var(--sp-2) 0;align-items:center;">
        <span style="animation:starSpin 0.5s 0.2s ease-out forwards;opacity:0;">${renderIcon('icon_star', 24)}</span>
        <span style="animation:starSpin 0.5s 0.4s ease-out forwards;opacity:0;transform:translateY(-6px);">${renderIcon('icon_star', 32)}</span>
        <span style="animation:starSpin 0.5s 0.6s ease-out forwards;opacity:0;">${renderIcon('icon_star', 24)}</span>
      </div>
    ` : '';

    const coinSoundInterval = playCoinCount();
    setTimeout(() => { if (coinSoundInterval) clearInterval(coinSoundInterval); }, 1500);

    overlay.innerHTML = `
      <div class="game-over-modal-card">
        <div style="margin-bottom:var(--sp-2);">${crownSvg}</div>
        <h1 class="winner-title-shimmer">${isWinner ? 'WINNER' : 'DEFEAT'}</h1>
        <p style="font-family:var(--font-display);font-size:11px;color:var(--text-secondary);letter-spacing:0.12em;text-transform:uppercase;margin:0 0 var(--sp-2) 0;">${bannerText}</p>
        
        ${starDecoration}
        
        <div class="character-container ${isWinner ? 'character-win' : 'character-lose'}" style="width:110px;height:165px;margin:var(--sp-2) 0;display:inline-flex;align-items:center;justify-content:center;">
          ${renderCharacter(activeCharacter, 'medium')}
        </div>
        
        
        ${rankedInfo && rankedInfo.isRanked ? (() => {
          const tier = getRankTier(rankedInfo.newRp);
          const rpChangeText = rankedInfo.change >= 0 ? `+${rankedInfo.change} RP` : `${rankedInfo.change} RP`;
          const rpChangeColor = rankedInfo.change >= 0 ? 'var(--status-win)' : 'var(--status-lose)';
          return `
            <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:280px;margin-bottom:var(--sp-5);">
              <!-- Coin rewards -->
              <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-default);padding:10px 16px;border-radius:var(--radius-lg);box-shadow:inset 0 0 10px rgba(0,0,0,0.4);">
                <div style="font-family:var(--font-display);font-size:10px;color:var(--text-secondary);letter-spacing:0.08em;margin-bottom:4px;">KOIN DIPEROLEH</div>
                <div class="coin-display" style="font-size:20px;justify-content:center;color:var(--gold-bright);font-weight:bold;display:flex;align-items:center;gap:6px;">
                  <div class="coin-icon coin-icon--sm"></div>
                  <span class="text-mono">+${coinTotal}</span>
                </div>
              </div>

              <!-- Rank progression -->
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(212,160,23,0.25);padding:10px 16px;border-radius:var(--radius-lg);box-shadow:inset 0 0 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="icon-inline">${renderRankBadge(tier.badge, tier.level, 24)}</span>
                  <div style="text-align:left;">
                    <div style="font-family:var(--font-heading);font-weight:700;font-size:11px;color:${tier.color};">${tier.name.toUpperCase()}</div>
                    <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-secondary);">${rankedInfo.newRp} RP</div>
                  </div>
                </div>
                <div style="font-family:var(--font-mono);font-size:14px;font-weight:bold;color:${rpChangeColor};">
                  ${rpChangeText}
                </div>
              </div>
            </div>
          `;
        })() : `
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-default);padding:14px 28px;border-radius:var(--radius-lg);margin-bottom:var(--sp-5);box-shadow:inset 0 0 10px rgba(0,0,0,0.4);width:100%;max-width:280px;">
            <div style="font-family:var(--font-display);font-size:11px;color:var(--text-secondary);letter-spacing:0.08em;margin-bottom:6px;">KOIN DIPEROLEH</div>
            <div class="coin-display" style="font-size:26px;justify-content:center;color:var(--gold-bright);font-weight:bold;display:flex;align-items:center;gap:8px;">
              <div class="coin-icon coin-icon--md"></div>
              <span class="text-mono" style="animation:textPulse 1.5s infinite;">+${coinTotal}</span>
            </div>
          </div>
        `}
        
        <button class="btn btn-primary btn-block btn-lg" id="btn-continue-to-results" style="box-shadow:0 0 20px ${isWinner ? 'rgba(245,200,66,0.35)' : 'rgba(255,255,255,0.1)'};letter-spacing:0.08em;font-weight:900;font-family:var(--font-display);text-transform:uppercase;">
          LIHAT HASIL DETAIL
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 50);

    const contBtn = overlay.querySelector('#btn-continue-to-results');
    contBtn.addEventListener('click', () => {
      playClick();
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        style.remove();
        location.hash = `#/result/${gameConfig.roomId}`;
      }, 500);
    });
  }

  function endGame(winnerIdx, reason) {
    gs.gameOver = true;
    clearInterval(gs.timerInterval);

    const myIdx = isRealPvP ? gs.myPlayerIndex : 0;
    const isWinner = winnerIdx === myIdx;
    const scores = calculateGameResult(gs.hands, gs.players, mode, winnerIdx, gs.doubleCoin);
    const streak = isWinner ? (user.stats.currentStreak || 0) + 1 : 0;
    // betAmount is accessible from outer render() scope
    const coinResult = calculateCoinReward(user, isWinner, mode, streak, gs.doubleCoin, user.activeCharacter, betAmount, numPlayers);

    // Update user stats
    user.stats.totalGames++;
    if (isWinner) {
      user.stats.wins++;
      user.stats.currentStreak = streak;
      user.stats.longestStreak = Math.max(user.stats.longestStreak, streak);
    } else {
      user.stats.losses++;
      user.stats.currentStreak = 0;
    }
    user.coin += coinResult.total;
    user.stats.totalCoinEarned += coinResult.total;
    state.persistUser();

    // Call backend endpoint to end the local session in DB
    if (!isRealPvP && gameConfig.sessionId) {
      const winnerId = gs.players[winnerIdx].id;
      apiCall('POST', '/game/local-end', {
        sessionId: gameConfig.sessionId,
        winnerId,
        coinEarned: coinResult.total
      }).then(res => {
        if (res.error) {
          console.warn('Failed to sync local game over results to backend:', res.message);
        } else if (res.data && res.data.newBalance !== undefined) {
          user.coin = res.data.newBalance;
          state.set('coin', user.coin);
          state.persistUser();
        }
      }).catch(err => {
        console.warn('Error during local game end API call:', err);
      });
    }

    updateMissionProgress('play_3_rounds', 1);
    if (isWinner) updateMissionProgress('win_1_game', 1);

    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) playAchievementUnlock();

    autoTriggerEmote(gs.players[winnerIdx].id, isWinner ? 'win' : 'lose');
    if (!isWinner) autoTriggerEmote(user.id, 'lose');

    if (reason === 'gaple' && isWinner) {
      if (!user.achievements.find(a => a.id === 'gaple_king')) {
        user.achievements.push({ id: 'gaple_king', unlockedAt: new Date().toISOString() });
        user.coin += 400;
        user.stats.totalCoinEarned += 400;
        state.persistUser();
        showToast('Achievement: Raja Gaple! +400 coin', 'success');
      }
    }

    addGameHistory({
      userId: user.id,
      sessionId: gameConfig.roomId,
      mode,
      result: isWinner ? 'win' : 'lose',
      coinEarned: coinResult.total,
      playedAt: new Date().toISOString()
    });

    // Store result for result page
    state.set('lastGameResult', {
      scores,
      coinResult,
      isWinner,
      reason,
      mode,
      players: gs.players,
      newAchievements,
      betAmount
    });

    renderGame();
    showCardReveal(winnerIdx, reason, () => {
      showGameOverPopup(isWinner, coinResult.total, user.activeCharacter, reason);
    });
  }

  function showCardReveal(winnerIdx, reason, onDone) {
    const myIdx = isRealPvP ? gs.myPlayerIndex : 0;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:8000;
      background:rgba(8,10,6,0.92);
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:var(--sp-5);opacity:0;transition:opacity 0.4s ease;
    `;

    const title = reason === 'timeout'
      ? 'WAKTU HABIS!'
      : reason === 'disconnect'
        ? 'PEMAIN KELUAR!'
        : gs.hands[winnerIdx]?.length === 0 
          ? 'KARTU HABIS!' 
          : 'GAPLE! SEMUA TERBLOKIR';

    let cardsHtml = '';
    gs.players.forEach((p, idx) => {
      const isMe = idx === myIdx;
      const isWin = idx === winnerIdx;
      const hand = gs.hands[idx] || [];
      const pipTotal = hand.reduce((s, [a, b]) => s + a + b, 0);

      cardsHtml += `
        <div style="margin-bottom:var(--sp-5);width:100%;max-width:600px;">
          <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-3);">
            <div style="width:36px;height:36px;border-radius:50%;border:2px solid ${isWin ? 'var(--status-win)' : isMe ? 'var(--gold-bright)' : 'var(--border-default)'};overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--bg-surface);flex-shrink:0;">
              ${renderCharacter(p.activeCharacter, 'tiny')}
            </div>
            <div style="flex:1;">
              <span style="font-family:var(--font-heading);font-size:15px;font-weight:700;color:${isWin ? 'var(--status-win)' : isMe ? 'var(--text-gold)' : 'var(--text-primary)'};">${p.username}</span>
              ${isWin ? '<span class="badge badge--green" style="margin-left:8px;font-size:9px;">MENANG</span>' : ''}
            </div>
            <div style="text-align:right;">
              <span style="font-family:var(--font-mono);font-size:13px;color:var(--text-secondary);">${hand.length} kartu</span>
              <span style="font-family:var(--font-mono);font-size:13px;color:var(--text-muted);margin-left:8px;">pip: ${pipTotal}</span>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;padding:var(--sp-3);background:rgba(255,255,255,0.02);border:1px solid ${isWin ? 'rgba(46,204,113,0.3)' : 'var(--border-default)'};border-radius:var(--radius-md);">
            ${hand.length > 0
              ? hand.map(([a, b], ci) =>
                  `<div style="opacity:0;animation:dealCard 0.3s ${ci * 0.08}s ease-out forwards;">
                    ${renderDomino(a, b, { skin: user.activeSkin, size: 'small' })}
                  </div>`
                ).join('')
              : '<span class="text-muted text-sm" style="padding:8px;">Tidak ada kartu tersisa</span>'
            }
          </div>
        </div>
      `;
    });

    overlay.innerHTML = `
      <div style="text-align:center;margin-bottom:var(--sp-5);">
        <h2 style="font-family:var(--font-display);font-size:24px;color:var(--text-gold);letter-spacing:0.08em;margin:0 0 var(--sp-2) 0;">${title}</h2>
        <p style="font-size:13px;color:var(--text-secondary);margin:0;">Kartu semua pemain terbuka</p>
      </div>
      <div style="max-height:70vh;overflow-y:auto;width:100%;display:flex;flex-direction:column;align-items:center;">
        ${cardsHtml}
      </div>
      <button class="btn btn-primary btn-lg" id="btn-reveal-continue" style="margin-top:var(--sp-5);letter-spacing:0.08em;font-weight:900;min-width:200px;">LANJUTKAN</button>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => { overlay.style.opacity = '1'; }, 50);

    overlay.querySelector('#btn-reveal-continue').addEventListener('click', () => {
      playClick();
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        onDone();
      }, 400);
    });
  }

  function autoTriggerEmote(playerId, eventType) {
    const map = {
      win: ['laugh', 'cool', 'gg'],
      lose: ['cry', 'angry'],
      pass: ['sleepy'],
      powerup: ['fire', 'shock']
    };
    const pool = map[eventType];
    if (!pool) return;
    const emoteId = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
      showEmotePopup(playerId, emoteId, gameEl);
      playEmoteSound(emoteId);
    }, 400);
  }

  // ════════════════════════════════════════════════════════════════
  // START GAME
  // ════════════════════════════════════════════════════════════════
  if (isRealPvP && backendToken && typeof io !== 'undefined') {
    // ── REAL PVP: Connect via Socket.io ────────────────────────────────────
    showToast('Menghubungkan ke server...', 'info');

    const socket = io(`${SOCKET_URL}/game`, {
      query: { roomId: gameConfig.roomId },
      transports: ['websocket', 'polling']
    });
    gs.pvpSocket = socket;

    // Initialize WebRTC Voice Chat Manager
    const { initVoiceChat, cleanupVoiceChat } = setupVoiceChat(socket, gs, user, renderGame);
    cleanupVoiceChatFn = cleanupVoiceChat;

    // ── Send join event with auth token ────────────────────────────────────
    socket.on('connect', () => {
      socket.emit('join', {
        token: backendToken,
        username: user.username,
        character: user.activeCharacter,
        skin: user.activeSkin || 'classic'
      });
    });

    // ── Server confirmed game start → replace local state ─────────────────
    socket.on('game_start', (data) => {
      gs.myPlayerIndex = data.playerIndex ?? 0;
      if (gs.myPlayerIndex < 0 || gs.myPlayerIndex >= (data.players?.length || 4)) {
        showToast('Server error: indeks pemain tidak valid', 'error');
        gs.myPlayerIndex = 0;
      }
      while (gs.hands.length <= gs.myPlayerIndex) gs.hands.push([]);
      gs.hands[gs.myPlayerIndex] = data.hand;

      // Rebuild players array from server data
      if (data.players && data.players.length > 0) {
        gs.players = data.players.map(p => ({
          id: p.userId,
          username: p.username,
          activeCharacter: p.character,
          skin: p.skin || 'classic',
          isBot: p.isBot || false
        }));
        // Resize hands array to match player count (non-self hands = empty for now)
        while (gs.hands.length < gs.players.length) gs.hands.push([]);
      }

      // Set whose turn it is
      const firstTurnIdx = gs.players.findIndex(p => p.id === data.firstTurn);
      gs.currentPlayerIndex = firstTurnIdx >= 0 ? firstTurnIdx : 0;

      renderGame();
      resetTimer();
      showToast(`Pertandingan dimulai! Giliran: ${gs.players[gs.currentPlayerIndex].username}`, 'success');

      // Start peer WebRTC connections and prompt local mic permissions
      initVoiceChat().catch(err => console.error('Failed to init voice chat:', err));
    });

    // ── Waiting for other players ──────────────────────────────────────────
    socket.on('waiting', (data) => {
      showToast(data.message || 'Menunggu pemain lain...', 'info');
    });

    // ── Another player played a card ───────────────────────────────────────
    socket.on('card_played', (data) => {
      const oppIdx = gs.players.findIndex(p => p.id === data.playerId);
      if (data.playerId !== user.id) {
        // Update opponent hand sizes (we don't have their real cards)
        if (oppIdx >= 0 && gs.hands[oppIdx] && gs.hands[oppIdx].length > 0) {
          gs.hands[oppIdx].pop(); // Remove one card visually
        }
      }
      // Update board from server authoritatively for all players
      if (data.newBoard) {
        gs.board.left = data.newBoard.left;
        gs.board.right = data.newBoard.right;
        gs.board.chain = data.newBoard.chain || gs.board.chain;
        gs.board.centerIndex = Math.floor((gs.board.chain.length - 1) / 2);
      }
      const playedSkin = (oppIdx >= 0 && gs.players[oppIdx]) ? (gs.players[oppIdx].skin || 'classic') : 'classic';
      playCardPlace(playedSkin);
      renderGame();
    });

    // ── A player passed ────────────────────────────────────────────────────
    socket.on('player_passed', (data) => {
      if (data.playerId !== user.id) {
        const p = gs.players.find(pl => pl.id === data.playerId);
        if (p) showToast(`${p.username} tidak bisa bermain, PASS!`, 'warning');
        gs.consecutivePasses++;
      }
      renderGame();
    });

    // ── Turn changed ────────────────────────────────────────────────────────
    socket.on('turn_change', (data) => {
      const idx = gs.players.findIndex(p => p.id === data.currentTurn);
      gs.currentPlayerIndex = idx >= 0 ? idx : 0;
      gs.selectedCard = null;
      gs.pendingSide = null;
      gs.consecutivePasses = 0;
      resetTimer();
      renderGame();
    });

    // ── Authoritative game state from server ───────────────────────────────
    socket.on('game_state', (data) => {
      if (data.board) {
        gs.board.left = data.board.left;
        gs.board.right = data.board.right;
        if (data.board.chain) {
          gs.board.chain = data.board.chain;
          gs.board.centerIndex = Math.floor((gs.board.chain.length - 1) / 2);
        }
      }
      // Update hand sizes for opponents
      if (data.handSizes) {
        gs.players.forEach((p, i) => {
          if (p.id !== user.id && data.handSizes[p.id] !== undefined) {
            // Adjust hand array length to match server count
            const target = data.handSizes[p.id];
            while (gs.hands[i].length < target) gs.hands[i].push([0, 0]);
            while (gs.hands[i].length > target) gs.hands[i].pop();
          }
        });
      }
      const turnIdx = gs.players.findIndex(p => p.id === data.turn);
      if (turnIdx >= 0) gs.currentPlayerIndex = turnIdx;
      renderGame();
    });

    // ── Chat messages from server ──────────────────────────────────────────
    socket.on('chat_message', (data) => {
      if (data.userId === user.id) return; // own message already shown
      addChatMessage(data.username, data.message);
    });

    // ── Emote from server ──────────────────────────────────────────────────
    socket.on('emote', (data) => {
      if (data.userId === user.id) return;
      showEmotePopup(data.userId, data.emoteId, gameEl);
      playEmoteSound(data.emoteId);
      addChatMessage(data.username || 'Player', `[emote:${data.emoteId}]`);
    });

    // ── Game over from server ──────────────────────────────────────────────
    socket.on('game_over', (data) => {
      gs.gameOver = true;
      clearInterval(gs.timerInterval);
      const isWinner = data.winner === user.id;
      const myCoins = (data.coinEarned?.[user.id] && data.coinEarned[user.id].total !== undefined)
        ? data.coinEarned[user.id].total
        : (isWinner ? 200 : 50);
      const scores = data.scores || [];
      const streak = isWinner ? (user.stats.currentStreak || 0) + 1 : 0;

      user.stats.totalGames++;
      if (isWinner) {
        user.stats.wins++;
        user.stats.currentStreak = streak;
        user.stats.longestStreak = Math.max(user.stats.longestStreak, streak);
      } else {
        user.stats.losses++;
        user.stats.currentStreak = 0;
      }
      user.coin += myCoins;
      user.stats.totalCoinEarned += myCoins;

      const myRankedInfo = data.rankedInfo?.[user.id] || null;
      if (myRankedInfo && myRankedInfo.isRanked) {
        user.rankPoints = myRankedInfo.newRp;
      }

      state.set('coin', user.coin);
      state.persistUser();

      // Sync backend balance to ensure client matches backend exactly (handles upfront bet deductions etc.)
      state.syncWithBackend();

      state.set('lastGameResult', {
        scores,
        coinResult: { total: myCoins },
        isWinner,
        reason: data.reason,
        mode,
        players: gs.players,
        newAchievements: [],
        rankedInfo: myRankedInfo,
        betAmount: gameConfig.betAmount || 0
      });

      // Update opponent hands from server data if available
      if (data.hands) {
        data.hands.forEach((h, i) => { if (h) gs.hands[i] = h; });
      }

      renderGame();
      const pvpWinnerIdx = gs.players.findIndex(p => p.id === data.winner);
      showCardReveal(pvpWinnerIdx >= 0 ? pvpWinnerIdx : 0, data.reason, () => {
        showGameOverPopup(isWinner, myCoins, user.activeCharacter, data.reason, myRankedInfo);
      });
    });

    socket.on('error', (err) => {
      showToast(`Error: ${err.message || err.code}`, 'error');
    });

    socket.on('connect_error', () => {
      showToast('Koneksi ke server terputus! Dikembalikan ke Lobi.', 'error');
      // Redirect back to lobby instead of fallback to bot
      location.hash = '#/matchmaking';
    });

    // Override executePlay and handlePass to emit to server
    const _origExecutePlay = executePlay;
    const _origHandlePass = handlePass;

    // Patch executePlay: for player's own moves, emit to socket
    window._gameSocketRef = socket;

    // Initial render while waiting
    renderGame();

  } else {
    // ── LOCAL / BOT MODE ───────────────────────────────────────────────────
    _startLocalGame();
  }

  function _startLocalGame() {
    renderGame();
    resetTimer();

    // Deal animation: stagger cards appearing
    const handCards = document.querySelectorAll('.player-hand .domino-wrapper');
    handCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-30px) rotate(10deg) scale(0.7)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotate(0) scale(1)';
      }, 100 + i * 80);
    });

    // Si Hoki passive: auto-peek 1 opponent card at game start
    if (user.activeCharacter === 'si_hoki' && !gs.passiveUsed.si_hoki) {
      gs.passiveUsed.si_hoki = true;
      setTimeout(() => {
        const localMyIdx = isRealPvP ? gs.myPlayerIndex : 0;
        const oppIndices = gs.players.map((_, i) => i).filter(i => i !== localMyIdx);
        const opponentIdx = oppIndices[Math.floor(Math.random() * oppIndices.length)];
        if (opponentIdx !== undefined && gs.hands[opponentIdx] && gs.hands[opponentIdx].length > 0) {
          const randomCard = gs.hands[opponentIdx][Math.floor(Math.random() * gs.hands[opponentIdx].length)];
          showToast(`Si Hoki: Mengintip kartu ${gs.players[opponentIdx].username} → [${randomCard[0]}|${randomCard[1]}]`, 'info', 4000);
        }
      }, 2000);
    }
  }

  return () => {
    clearInterval(gs.timerInterval);
    if (gs.pvpSocket) {
      gs.pvpSocket.disconnect();
      gs.pvpSocket = null;
    }
    if (cleanupVoiceChatFn) {
      cleanupVoiceChatFn();
    }
  };
} // end of render()

function renderBoardSnake(chain, skin, centerIndex) {
  const isMobile = window.innerWidth < 768;
  const isUltraMobile = window.innerWidth < 375;
  const HW = isUltraMobile ? 44 : isMobile ? 52 : 80;
  const HH = isUltraMobile ? 24 : isMobile ? 28 : 44;
  const VW = HH, VH = HW, G = 2;

  const boardEl = document.getElementById('game-board');
  const boardW = boardEl ? boardEl.clientWidth - (isMobile ? 20 : 40) : 500;
  const boardH = (boardEl && boardEl.clientHeight > 100) ? boardEl.clientHeight - (isMobile ? 20 : 40) : 400;

  const startX = Math.floor(boardW / 2) - Math.floor(HW / 2);
  const startY = Math.floor(boardH / 2) - Math.floor(HH / 2);

  const items = [];
  const cIdx = (centerIndex != null && centerIndex >= 0 && centerIndex < chain.length) ? centerIndex : Math.floor(chain.length / 2);

  const rightChain = chain.slice(cIdx);
  layoutHalf(rightChain, startX, startY, 1, boardW, items, HW, HH, VW, VH, G, 1, false);

  const leftChain = chain.slice(0, cIdx).reverse();
  if (leftChain.length > 0) {
    layoutHalf(leftChain, startX - HW - G, startY, -1, boardW, items, HW, HH, VW, VH, G, -1, true);
  }

  if (items.length === 0) return '<div class="board-empty-msg">Taruh kartu pertama</div>';

  const minX = Math.min(...items.map(t => t.x));
  const minY = Math.min(...items.map(t => t.y));
  if (minX < 0) items.forEach(t => t.x -= minX);
  if (minY < 0) items.forEach(t => t.y -= minY);

  const html = items.map(t =>
    `<div style="position:absolute;left:${t.x}px;top:${t.y}px;">
      ${renderDomino(t.a, t.b, { skin, horizontal: t.horizontal })}
    </div>`
  ).join('');

  return `<div style="position:relative;width:100%;height:100%;z-index:2;">${html}</div>`;
}

function layoutHalf(tiles, startX, startY, startDir, maxW, items, HW, HH, VW, VH, G, turnY, isLeftChain) {
  let cx = startX, cy = startY, dir = startDir;

  for (let i = 0; i < tiles.length; i++) {
    const [a, b] = tiles[i];
    const incoming = isLeftChain ? b : a;
    const outgoing = isLeftChain ? a : b;

    let render_a, render_b;
    const fits = dir === 1 ? (cx + HW <= maxW) : (cx >= 0);

    if (fits) {
      if (dir === 1) {
        render_a = incoming;
        render_b = outgoing;
      } else {
        render_a = outgoing;
        render_b = incoming;
      }
      items.push({ a: render_a, b: render_b, x: cx, y: cy, horizontal: true });
      cx += dir * (HW + G);
    } else {
      const lastX = cx - dir * (HW + G);
      const vx = dir === 1 ? lastX + HW - VW : lastX;
      const vy = turnY === 1 ? cy + HH + G : cy - G - VH;

      if (turnY === 1) {
        render_a = incoming;
        render_b = outgoing;
      } else {
        render_a = outgoing;
        render_b = incoming;
      }
      items.push({ a: render_a, b: render_b, x: vx, y: vy, horizontal: false });

      cy = turnY === 1 ? vy + VH + G : vy - G - HH;
      dir *= -1;
      cx = dir === 1 ? vx : vx + VW - HW;
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function setupVoiceChat(socket, gs, user, renderGame) {
  const myUserId = user.id;
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  let localStream = null;
  const peers = new Map();

  let audioCtx = null;
  let analyser = null;
  let micSource = null;
  let checkInterval = null;
  let lastSpeakingState = false;

  function getOrCreatePeer(targetUserId) {
    if (peers.has(targetUserId)) {
      return peers.get(targetUserId);
    }

    const pc = new RTCPeerConnection(configuration);
    pc.iceQueue = [];
    pc.remoteDescriptionSet = false;

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc_signal', {
          to: targetUserId,
          signal: { type: 'candidate', candidate: event.candidate }
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`WebRTC connection state with ${targetUserId}: ${pc.connectionState}`);
    };

    pc.ontrack = (event) => {
      console.log(`Received remote audio track from ${targetUserId}`);
      const remoteStream = event.streams[0];
      let audioEl = document.getElementById(`audio-remote-${targetUserId}`);
      if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.id = `audio-remote-${targetUserId}`;
        audioEl.autoplay = true;
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);
      }
      audioEl.srcObject = remoteStream;
    };

    peers.set(targetUserId, pc);
    return pc;
  }

  async function initVoiceChat() {
    console.log('Initializing voice chat...');
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      // Default to muted
      localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });

      gs.voiceInitialized = true;
      gs.voiceMuted = true;
      renderGame();
    } catch (err) {
      console.warn('Microphone access denied or not available:', err);
      showToast('Akses mikrofon ditolak/tidak tersedia.', 'warning');
      gs.voiceInitialized = true;
      gs.voiceMuted = true;
      renderGame();
    }

    // Set up local speaking detection
    startSpeakingDetection();

    // Initiate connections with peers
    for (const p of gs.players) {
      if (p.id === myUserId || p.isBot) continue;

      if (myUserId < p.id) {
        console.log(`Initiating WebRTC offer to ${p.username} (${p.id})`);
        try {
          const pc = getOrCreatePeer(p.id);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit('webrtc_signal', {
            to: p.id,
            signal: { type: 'offer', sdp: pc.localDescription }
          });
        } catch (err) {
          console.error(`Failed to create offer for ${p.id}:`, err);
        }
      }
    }
  }

  function startSpeakingDetection() {
    if (!localStream) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      micSource = audioCtx.createMediaStreamSource(localStream);
      micSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      checkInterval = setInterval(() => {
        if (gs.voiceMuted) {
          if (lastSpeakingState) {
            lastSpeakingState = false;
            socket.emit('voice_state_change', { isMuted: true, isSpeaking: false });
          }
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Amplitude threshold for speaking detection
        const isSpeaking = average > 15;

        if (isSpeaking !== lastSpeakingState) {
          lastSpeakingState = isSpeaking;
          socket.emit('voice_state_change', { isMuted: false, isSpeaking });
        }
      }, 200);
    } catch (err) {
      console.warn('Failed to start local speaking detection:', err);
    }
  }

  // Socket listener for signal
  socket.on('webrtc_signal', async (data) => {
    const { from, signal } = data;
    if (!from || !signal) return;

    try {
      const pc = getOrCreatePeer(from);

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(signal.sdp);
        pc.remoteDescriptionSet = true;
        
        while (pc.iceQueue.length > 0) {
          const cand = pc.iceQueue.shift();
          await pc.addIceCandidate(cand);
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('webrtc_signal', {
          to: from,
          signal: { type: 'answer', sdp: pc.localDescription }
        });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(signal.sdp);
        pc.remoteDescriptionSet = true;

        while (pc.iceQueue.length > 0) {
          const cand = pc.iceQueue.shift();
          await pc.addIceCandidate(cand);
        }
      } else if (signal.type === 'candidate') {
        if (pc.remoteDescriptionSet) {
          await pc.addIceCandidate(signal.candidate);
        } else {
          pc.iceQueue.push(signal.candidate);
        }
      }
    } catch (err) {
      console.error('Error handling WebRTC signal:', err);
    }
  });

  // Socket listener for peer state change
  socket.on('voice_state_change', (data) => {
    const { userId, isMuted: peerMuted, isSpeaking: peerSpeaking } = data;
    gs.playerVoiceStates[userId] = { isMuted: peerMuted, isSpeaking: peerSpeaking };
    renderGame();
  });

  const onMicClick = (e) => {
    const btn = e.target.closest('#btn-toggle-mic');
    if (!btn) return;

    gs.voiceMuted = !gs.voiceMuted;
    
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !gs.voiceMuted;
      });
    }

    renderGame();

    socket.emit('voice_state_change', { isMuted: gs.voiceMuted, isSpeaking: false });
  };
  document.addEventListener('click', onMicClick);

  function cleanupVoiceChat() {
    console.log('Cleaning up WebRTC voice chat...');
    document.removeEventListener('click', onMicClick);

    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    
    if (audioCtx) {
      if (audioCtx.state !== 'closed') {
        audioCtx.close();
      }
      audioCtx = null;
    }
    
    if (micSource) {
      micSource.disconnect();
      micSource = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }

    peers.forEach((pc, targetId) => {
      pc.close();
      const audioEl = document.getElementById(`audio-remote-${targetId}`);
      if (audioEl) audioEl.remove();
    });
    peers.clear();
  }

  return { initVoiceChat, cleanupVoiceChat };
}
