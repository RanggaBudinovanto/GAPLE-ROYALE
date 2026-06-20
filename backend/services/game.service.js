const db = require('../models/db');
const { verifyToken } = require('../middleware/auth');
const { getBotReply } = require('./chat.service');
const { clearLeaderboardCache } = require('../config/redis');

function generateDominoSet() {
  const set = [];
  for (let i = 0; i <= 6; i++)
    for (let j = i; j <= 6; j++)
      set.push([i, j]);
  return set;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const activeGames = new Map();
const pendingInits = new Map();
const roomConnections = new Map();

const COIN_REWARDS = { win_duel: 200, win_4player: 300, lose: 50, base_per_game: 30, streak_bonus: 20 };

module.exports = function (io) {
  const gameNsp = io.of('/game');

  gameNsp.on('connection', (socket) => {
    const roomId = socket.handshake.query.roomId;
    if (!roomId) return socket.disconnect();

    socket.join(roomId);

    socket.on('join_matchmaking_accept', (data) => {
      const payload = verifyToken(data.token);
      if (!payload) return;

      socket.userId = payload.userId;
      socket.username = data.username || 'Player';
      socket.character = data.character || 'bocah_pemula';
      socket.skin = data.skin || 'classic';

      // Notify others in the room
      gameNsp.to(roomId).emit('player_joined_accept', {
        userId: socket.userId,
        username: socket.username,
        character: socket.character,
        skin: socket.skin
      });
    });

    socket.on('accept_match', () => {
      if (!socket.userId) return;
      gameNsp.to(roomId).emit('player_accepted_match', {
        userId: socket.userId
      });
    });

    socket.on('join', async (data) => {
      const payload = verifyToken(data.token);
      if (!payload) return socket.emit('error', { code: 'UNAUTHORIZED', message: 'Token tidak valid' });

      socket.userId = payload.userId;
      socket.roomId = roomId;
      socket.username = data.username || 'Player';
      socket.character = data.character || 'bocah_pemula';
      socket.skin = data.skin || 'classic';

      // ── Track connected sockets per room ──────────────────────────────
      if (!roomConnections.has(roomId)) roomConnections.set(roomId, new Map());
      roomConnections.get(roomId).set(payload.userId, socket);

      // ── Check if game is already active in memory (with init lock) ────
      let game = activeGames.get(roomId);
      if (!game) {
        if (pendingInits.has(roomId)) {
          game = await pendingInits.get(roomId);
        } else {
          const initPromise = initGame(roomId, io);
          pendingInits.set(roomId, initPromise);
          game = await initPromise;
          pendingInits.delete(roomId);
          if (game) activeGames.set(roomId, game);
        }
        if (!game) {
          socket.emit('waiting', { message: 'Menunggu pemain lain bergabung...' });
          return;
        }
      }

      // ── Send personalized game_start to this player ───────────────────
      const playerIdx = game.players.findIndex(p => p.id === payload.userId);
      const myHand = playerIdx >= 0 ? game.hands[playerIdx] : game.hands[0];

      socket.emit('game_start', {
        hand: myHand,
        playerIndex: playerIdx >= 0 ? playerIdx : 0,
        firstTurn: game.players[game.currentTurn].id,
        players: game.players.map((p, i) => ({
          userId: p.id,
          username: p.username,
          character: p.character,
          skin: p.skin || 'classic',
          handSize: game.hands[i].length,
          isBot: p.isBot
        }))
      });

      emitGameState(gameNsp, roomId, game);

      // If current turn is a bot, trigger bot play
      if (game.players[game.currentTurn].isBot) {
        setTimeout(() => botPlay(gameNsp, roomId, game), 1000);
      }
    });

    socket.on('play_card', (data) => {
      const game = activeGames.get(roomId);
      if (!game || game.gameOver) return;
      if (game.players[game.currentTurn].id !== socket.userId) {
        return socket.emit('error', { code: 'NOT_YOUR_TURN', message: 'Bukan giliran kamu' });
      }

      const { card, side } = data;
      const playerIdx = game.players.findIndex(p => p.id === socket.userId);
      const handIdx = game.hands[playerIdx].findIndex(c => 
        (c[0] === card[0] && c[1] === card[1]) || 
        (c[0] === card[1] && c[1] === card[0])
      );

      if (handIdx === -1) return socket.emit('error', { code: 'INVALID_MOVE', message: 'Kartu tidak ditemukan' });

      const played = game.hands[playerIdx].splice(handIdx, 1)[0];
      placeOnBoard(game, played, side);
      game.consecutivePasses = 0;

      gameNsp.to(roomId).emit('card_played', {
        playerId: socket.userId, card: played, side,
        newBoard: { left: game.boardLeft, right: game.boardRight, chain: game.boardChain }
      });

      if (game.hands[playerIdx].length === 0) {
        return endGame(gameNsp, roomId, game, playerIdx, 'hand_empty');
      }

      nextTurn(gameNsp, roomId, game);
    });

    socket.on('pass', () => {
      const game = activeGames.get(roomId);
      if (!game || game.gameOver) return;
      if (game.players[game.currentTurn].id !== socket.userId) return;

      game.consecutivePasses++;
      gameNsp.to(roomId).emit('player_passed', { playerId: socket.userId, reason: 'no_valid_moves' });

      if (game.consecutivePasses >= game.players.length) {
        const winner = determineWinner(game.hands);
        return endGame(gameNsp, roomId, game, winner, 'gaple');
      }

      nextTurn(gameNsp, roomId, game);
    });

    socket.on('chat', (data) => {
      gameNsp.to(roomId).emit('chat_message', {
        userId: socket.userId,
        username: socket.username,
        message: data.message,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('use_powerup', (data) => {
      const game = activeGames.get(roomId);
      if (!game || game.gameOver) return;
      gameNsp.to(roomId).emit('powerup_used', {
        userId: socket.userId, powerup: data.powerup
      });
    });

    socket.on('webrtc_signal', (data) => {
      const { to, signal } = data;
      if (!socket.userId || !to) return;
      const roomMap = roomConnections.get(roomId);
      if (roomMap) {
        const targetSocket = roomMap.get(to);
        if (targetSocket) {
          targetSocket.emit('webrtc_signal', {
            from: socket.userId,
            signal
          });
        }
      }
    });

    socket.on('voice_state_change', (data) => {
      if (!socket.userId) return;
      socket.to(roomId).emit('voice_state_change', {
        userId: socket.userId,
        isMuted: data.isMuted,
        isSpeaking: data.isSpeaking
      });
    });

    socket.on('disconnect', () => {
      if (socket.roomId && roomConnections.has(socket.roomId)) {
        roomConnections.get(socket.roomId).delete(socket.userId);
      }
    });
  });
};

/**
 * initGame - Load session from DB, deal cards, build player list.
 * Works for both bot games and PvP games.
 * Returns null if session not found or not yet active.
 */
async function initGame(roomId, io) {
  const [sessions] = await db.query('SELECT * FROM game_sessions WHERE room_id = ?', [roomId]);
  if (sessions.length === 0 || sessions[0].status === 'waiting') return null;

  const session = sessions[0];
  const numPlayers = session.mode === 'duel' ? 2 : 4;
  const set = shuffle(generateDominoSet());
  const handSize = numPlayers === 2 ? 14 : 7;

  // Fetch actual players from DB
  const [dbPlayers] = await db.query(
    'SELECT gp.user_id, gp.position, u.username, u.active_character, u.active_skin FROM game_players gp LEFT JOIN users u ON u.id = gp.user_id WHERE gp.session_id = ? ORDER BY gp.position ASC',
    [session.id]
  );

  const botNames = ['Bot Surya', 'Bot Dewi', 'Bot Andi', 'Bot Rini'];
  const botChars = ['raja_domino', 'si_hoki', 'juragan_meja', 'sang_bluffer'];
  const botSkins = ['classic', 'candy_pop', 'ocean_blue', 'sakura_blossom', 'ruby_red', 'volcano', 'cyberpunk', 'marble_white', 'midnight', 'carbon_fiber', 'emerald', 'rainbow_unicorn', 'royal_gold', 'golden_luxury'];

  const players = [];
  for (let i = 0; i < numPlayers; i++) {
    const dbP = dbPlayers[i];
    if (!dbP) {
      // Slot empty — shouldn't happen, but fallback
      players.push({
        id: `bot_fallback_${i}`,
        username: botNames[i],
        character: botChars[i % botChars.length],
        skin: botSkins[i % botSkins.length],
        isBot: true
      });
    } else if (dbP.user_id.startsWith('bot_')) {
      players.push({
        id: dbP.user_id,
        username: botNames[i] || 'Bot',
        character: botChars[i % botChars.length],
        skin: botSkins[i % botSkins.length],
        isBot: true
      });
    } else {
      players.push({
        id: dbP.user_id,
        username: dbP.username || 'Player',
        character: dbP.active_character || 'bocah_pemula',
        skin: dbP.active_skin || 'classic',
        isBot: false
      });
    }
  }

  const hands = [];
  for (let i = 0; i < numPlayers; i++) {
    hands.push(set.slice(i * handSize, (i + 1) * handSize));
  }

  return {
    sessionId: session.id,
    roomId,
    mode: session.mode,
    players,
    hands,
    boardChain: [],
    boardLeft: null,
    boardRight: null,
    currentTurn: 0,
    consecutivePasses: 0,
    gameOver: false,
    turnTimer: null,
    betAmount: session.bet_amount || 0
  };
}

function placeOnBoard(game, card, side) {
  const [a, b] = card;
  if (game.boardChain.length === 0) {
    game.boardChain.push(card);
    game.boardLeft = a;
    game.boardRight = b;
    return;
  }
  if (side === 'left') {
    if (b === game.boardLeft) { game.boardChain.unshift([a, b]); game.boardLeft = a; }
    else if (a === game.boardLeft) { game.boardChain.unshift([b, a]); game.boardLeft = b; }
  } else {
    if (a === game.boardRight) { game.boardChain.push([a, b]); game.boardRight = b; }
    else if (b === game.boardRight) { game.boardChain.push([b, a]); game.boardRight = a; }
  }
}

function nextTurn(nsp, roomId, game) {
  game.currentTurn = (game.currentTurn + 1) % game.players.length;

  nsp.to(roomId).emit('turn_change', {
    currentTurn: game.players[game.currentTurn].id, timerSeconds: 30
  });

  emitGameState(nsp, roomId, game);

  if (game.players[game.currentTurn].isBot) {
    setTimeout(() => botPlay(nsp, roomId, game), 800 + Math.random() * 1200);
  }
}

function botPlay(nsp, roomId, game) {
  if (game.gameOver) return;
  const idx = game.currentTurn;
  const hand = game.hands[idx];

  const validMoves = getValidMoves(hand, game.boardLeft, game.boardRight);

  if (validMoves.length === 0) {
    game.consecutivePasses++;
    nsp.to(roomId).emit('player_passed', { playerId: game.players[idx].id, reason: 'no_valid_moves' });

    if (game.consecutivePasses >= game.players.length) {
      return endGame(nsp, roomId, game, determineWinner(game.hands), 'gaple');
    }
    return nextTurn(nsp, roomId, game);
  }

  let move;
  if (game.botLevel === 'hard') {
    validMoves.sort((a, b) => (b.card[0] + b.card[1]) - (a.card[0] + a.card[1]));
    move = validMoves[0];
  } else {
    move = validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  game.hands[idx].splice(move.index, 1);
  const side = move.sides[0];
  placeOnBoard(game, move.card, side);
  game.consecutivePasses = 0;

  nsp.to(roomId).emit('card_played', {
    playerId: game.players[idx].id, card: move.card, side,
    newBoard: { left: game.boardLeft, right: game.boardRight, chain: game.boardChain }
  });

  if (game.hands[idx].length === 0) {
    return endGame(nsp, roomId, game, idx, 'hand_empty');
  }

  nextTurn(nsp, roomId, game);
}

function getValidMoves(hand, boardLeft, boardRight) {
  if (boardLeft === null) return hand.map((card, index) => ({ card, index, sides: ['first'] }));
  const moves = [];
  hand.forEach((card, index) => {
    const [a, b] = card;
    const sides = [];
    if (a === boardLeft || b === boardLeft) sides.push('left');
    if (a === boardRight || b === boardRight) sides.push('right');
    if (sides.length > 0) moves.push({ card, index, sides });
  });
  return moves;
}

function determineWinner(hands) {
  let winnerIdx = 0, minPips = Infinity;
  hands.forEach((hand, i) => {
    const pips = hand.reduce((s, [a, b]) => s + a + b, 0);
    if (hand.length < hands[winnerIdx].length || (hand.length === hands[winnerIdx].length && pips < minPips)) {
      winnerIdx = i; minPips = pips;
    }
  });
  return winnerIdx;
}

async function endGame(nsp, roomId, game, winnerIdx, reason) {
  game.gameOver = true;

  const scores = game.players.map((p, i) => ({
    userId: p.id, username: p.username,
    cardsLeft: game.hands[i].length,
    totalPip: game.hands[i].reduce((s, [a, b]) => s + a + b, 0),
    rank: 0
  }));
  scores.sort((a, b) => a.cardsLeft - b.cardsLeft || a.totalPip - b.totalPip);
  scores.forEach((s, i) => s.rank = i + 1);

  const coinEarned = {};
  const betAmount = game.betAmount || 0;
  const numPlayers = game.players.length;

  game.players.forEach((p, i) => {
    const isWinner = i === winnerIdx;
    if (betAmount > 0) {
      const winBonus = isWinner ? (betAmount * numPlayers) : 0;
      coinEarned[p.id] = { base: 0, winBonus, passive: 0, doubleMultiplier: 1, total: winBonus };
    } else {
      const base = isWinner ? COIN_REWARDS.base_per_game : COIN_REWARDS.lose;
      const winBonus = isWinner ? (game.mode === 'duel' ? COIN_REWARDS.win_duel : COIN_REWARDS.win_4player) : 0;
      coinEarned[p.id] = { base, winBonus, passive: 0, doubleMultiplier: 1, total: base + winBonus };
    }
  });

  // Calculate Rank Points (RP) changes before emitting game_over
  let isRankedGame = false;
  try {
    const [sessRows] = await db.query('SELECT is_ranked FROM game_sessions WHERE room_id = ?', [roomId]);
    if (sessRows.length > 0) {
      isRankedGame = !!sessRows[0].is_ranked;
    }
  } catch (dbErr) {
    console.error('Failed to query session is_ranked state:', dbErr);
  }

  const rankedInfo = {};
  const winnerId = game.players[winnerIdx].id;

  for (const p of game.players) {
    if (p.id.startsWith('bot_')) {
      rankedInfo[p.id] = { isRanked: false, oldRp: 0, newRp: 0, change: 0 };
      continue;
    }

    if (isRankedGame) {
      try {
        const [userRows] = await db.query('SELECT rank_points FROM users WHERE id = ?', [p.id]);
        const currentRp = userRows[0]?.rank_points || 0;
        const isWinner = p.id === winnerId;
        const change = isWinner ? (reason === 'gaple' ? 30 : 25) : -15;
        let newRp = currentRp + change;
        if (newRp < 0) newRp = 0;

        await db.query('UPDATE users SET rank_points = ? WHERE id = ?', [newRp, p.id]);
        rankedInfo[p.id] = {
          isRanked: true,
          oldRp: currentRp,
          newRp: newRp,
          change: change
        };
      } catch (uErr) {
        console.error(`Failed to update RP for user ${p.id}:`, uErr);
        rankedInfo[p.id] = { isRanked: true, oldRp: 0, newRp: 0, change: 0 };
      }
    } else {
      rankedInfo[p.id] = { isRanked: false, oldRp: 0, newRp: 0, change: 0 };
    }
  }

  nsp.to(roomId).emit('game_over', { reason, winner: winnerId, scores, coinEarned, rankedInfo });

  try {
    if (!winnerId.startsWith('bot_')) {
      await db.query('UPDATE game_sessions SET status = "finished", winner_id = ?, finished_at = NOW() WHERE room_id = ?', [winnerId, roomId]);
      const earned = coinEarned[winnerId]?.total || 0;
      await db.query('UPDATE users SET coin = coin + ? WHERE id = ?', [earned, winnerId]);

      // Record transaction log for PvP winner
      const [uRows] = await db.query('SELECT coin FROM users WHERE id = ?', [winnerId]);
      const balanceAfter = uRows[0]?.coin || 0;
      const isBetting = betAmount > 0;
      const reason = isBetting 
        ? `Kemenangan taruhan game ${game.mode === 'duel' ? '1v1' : 'Ber-4'}` 
        : `Kemenangan game ${game.mode === 'duel' ? '1v1' : 'Ber-4'}`;
      await db.query(
        'INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "earn", ?, ?, ?)',
        [winnerId, earned, reason, balanceAfter]
      );
    } else {
      await db.query('UPDATE game_sessions SET status = "finished", finished_at = NOW() WHERE room_id = ?', [roomId]);
    }
    await clearLeaderboardCache();
  } catch (err) {
    console.error('Error saving game result:', err);
  }

  setTimeout(() => activeGames.delete(roomId), 30000);
}

function emitGameState(nsp, roomId, game) {
  nsp.to(roomId).emit('game_state', {
    board: { left: game.boardLeft, right: game.boardRight, chain: game.boardChain },
    turn: game.players[game.currentTurn].id,
    handSizes: Object.fromEntries(game.players.map((p, i) => [p.id, game.hands[i].length])),
    timerSeconds: 30
  });
}

async function endLocalGame(userId, sessionId, winnerId, earnedCoins) {
  const [sessions] = await db.query('SELECT * FROM game_sessions WHERE id = ?', [sessionId]);
  if (sessions.length === 0) {
    return { status: 404, error: 'SESSION_NOT_FOUND', message: 'Sesi game tidak ditemukan' };
  }
  const session = sessions[0];
  if (session.status === 'finished') {
    return { status: 400, error: 'SESSION_ALREADY_FINISHED', message: 'Sesi game sudah selesai' };
  }

  const [players] = await db.query('SELECT * FROM game_players WHERE session_id = ? AND user_id = ?', [sessionId, userId]);
  if (players.length === 0) {
    return { status: 403, error: 'FORBIDDEN', message: 'Anda bukan pemain di sesi ini' };
  }

  const conn = await db.primary.getConnection();
  try {
    await conn.beginTransaction();

    const isWinner = winnerId === userId;
    const updateWinnerId = isWinner ? userId : null;

    await conn.execute(
      'UPDATE game_sessions SET status = "finished", winner_id = ?, finished_at = NOW() WHERE id = ?',
      [updateWinnerId, sessionId]
    );

    const [userRows] = await conn.execute('SELECT coin FROM users WHERE id = ? FOR UPDATE', [userId]);
    const currentCoin = userRows[0]?.coin || 0;
    const finalCoin = currentCoin + earnedCoins;

    await conn.execute('UPDATE users SET coin = ? WHERE id = ?', [finalCoin, userId]);

    if (earnedCoins > 0) {
      const reason = isWinner ? 'Menang game VS A.I.' : 'Selesai game VS A.I. (Reward)';
      await conn.execute(
        'INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "earn", ?, ?, ?)',
        [userId, earnedCoins, reason, finalCoin]
      );
    }

    await conn.commit();
    await clearLeaderboardCache();

    return { status: 200, data: { success: true, newBalance: finalCoin } };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports.endLocalGame = endLocalGame;

