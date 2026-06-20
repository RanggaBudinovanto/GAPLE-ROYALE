const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');

// In-memory waiting rooms map: roomId -> { sessionId, mode, maxPlayers, players: [userId], createdAt, io }
const waitingRooms = new Map();

// Reference to socket.io instance, set via setIO()
let _io = null;

function setIO(io) {
  _io = io;
}

function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'GAP-';
  for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

/**
 * createSession - Creates or joins a PvP room
 * For PvP: tries to join an existing waiting room with the same mode first.
 * For bot: immediately creates a full room and starts the session.
 */
async function createSession(userId, mode, opponentType, botLevel, isRanked, betAmount) {
  const maxPlayers = mode === 'duel' ? 2 : 4;
  const isRankedBool = isRanked === true || isRanked === 'true';
  const betAmountInt = parseInt(betAmount || 0);

  // Validate coin balance for betting games
  if (betAmountInt > 0) {
    const [uRows] = await db.query('SELECT coin FROM users WHERE id = ?', [userId]);
    const currentCoin = uRows[0]?.coin || 0;
    if (currentCoin < betAmountInt) {
      return {
        status: 400,
        error: 'INSUFFICIENT_COINS',
        message: 'Koin Anda tidak cukup untuk taruhan ini!'
      };
    }
  }

  // ── BOT MODE ─────────────────────────────────────────────────────────────
  if (opponentType === 'bot') {
    const roomId = generateRoomId();
    const sessionId = uuidv4();

    // Deduct coins upfront for bot mode
    if (betAmountInt > 0) {
      await db.query('UPDATE users SET coin = coin - ? WHERE id = ?', [betAmountInt, userId]);
      const [uRows2] = await db.query('SELECT coin FROM users WHERE id = ?', [userId]);
      const balanceAfter = uRows2[0]?.coin || 0;
      await db.query(
        'INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "spend", ?, ?, ?)',
        [userId, betAmountInt, `Taruhan game VS A.I.`, balanceAfter]
      );
    }

    await db.query(
      'INSERT INTO game_sessions (id, room_id, mode, status, is_ranked, bet_amount) VALUES (?, ?, ?, ?, FALSE, ?)',
      [sessionId, roomId, mode, 'active', betAmountInt]
    );
    await db.query(
      'INSERT INTO game_players (session_id, user_id, position) VALUES (?, ?, 0)',
      [sessionId, userId]
    );

    const botCount = maxPlayers - 1;
    for (let i = 0; i < botCount; i++) {
      await db.query(
        'INSERT INTO game_players (session_id, user_id, position) VALUES (?, ?, ?)',
        [sessionId, `bot_${i}`, i + 1]
      );
    }
    await db.query(
      'UPDATE game_sessions SET status = "active", started_at = NOW() WHERE id = ?',
      [sessionId]
    );

    return {
      status: 200,
      data: {
        roomId, sessionId,
        wsUrl: `${process.env.WS_URL || 'http://localhost:' + (process.env.PORT || 3000)}/game`,
        status: 'ready',
        botLevel,
        opponentType: 'bot'
      }
    };
  }

  // ── PVP MODE ──────────────────────────────────────────────────────────────
  // Try to find an existing waiting room for the same mode, ranked status, and bet amount
  for (const [existingRoomId, room] of waitingRooms.entries()) {
    if (
      room.mode === mode &&
      room.isRanked === isRankedBool &&
      (room.betAmount || 0) === betAmountInt &&
      room.players.length < room.maxPlayers &&
      !room.players.includes(userId)
    ) {
      // ── JOIN existing room ──────────────────────────────────────────────
      const position = room.players.length;
      room.players.push(userId);

      await db.query(
        'INSERT INTO game_players (session_id, user_id, position) VALUES (?, ?, ?)',
        [room.sessionId, userId, position]
      );

      if (room.players.length >= room.maxPlayers) {
        // Room is full → activate session and notify all waiting players
        await db.query(
          'UPDATE game_sessions SET status = "active", started_at = NOW() WHERE id = ?',
          [room.sessionId]
        );

        // Deduct upfront coins from all PvP players
        if (betAmountInt > 0) {
          for (const pId of room.players) {
            await db.query('UPDATE users SET coin = coin - ? WHERE id = ?', [betAmountInt, pId]);
            const [uRows2] = await db.query('SELECT coin FROM users WHERE id = ?', [pId]);
            const balanceAfter = uRows2[0]?.coin || 0;
            const modeText = mode === 'duel' ? '1v1' : 'Ber-4';
            await db.query(
              'INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "spend", ?, ?, ?)',
              [pId, betAmountInt, `Taruhan game ${modeText}`, balanceAfter]
            );
          }
        }

        waitingRooms.delete(existingRoomId);

        // Fetch players info
        const [playerRows] = await db.query(
          'SELECT gp.user_id, gp.position, u.username, u.active_character, u.active_skin FROM game_players gp LEFT JOIN users u ON u.id = gp.user_id WHERE gp.session_id = ? ORDER BY gp.position ASC',
          [room.sessionId]
        );
        const players = playerRows.map(p => ({
          userId: p.user_id,
          position: p.position,
          username: p.username || 'Player',
          activeCharacter: p.active_character || 'bocah_pemula',
          skin: p.active_skin || 'classic'
        }));

        // Broadcast "match_ready" to the room so all polling clients know to proceed
        if (_io) {
          _io.of('/game').to(existingRoomId).emit('match_ready', {
            roomId: existingRoomId,
            sessionId: room.sessionId,
            status: 'ready',
            players
          });
        }

        return {
          status: 200,
          data: {
            roomId: existingRoomId,
            sessionId: room.sessionId,
            status: 'ready',
            opponentType: 'pvp',
            players,
            wsUrl: `${process.env.WS_URL || 'http://localhost:' + (process.env.PORT || 3000)}/game`,
            message: 'Pertandingan siap dimulai!'
          }
        };
      }

      // Fetch names of current players in the queue
      const [userRows] = await db.query(
        'SELECT id, username, active_character, active_skin FROM users WHERE id IN (?)',
        [room.players]
      );
      const players = room.players.map(id => {
        const u = userRows.find(row => row.id === id);
        return {
          userId: id,
          username: u ? u.username : 'Mencari...',
          activeCharacter: u ? u.active_character : 'bocah_pemula',
          skin: u ? (u.active_skin || 'classic') : 'classic'
        };
      });

      return {
        status: 202,
        data: {
          roomId: existingRoomId,
          sessionId: room.sessionId,
          status: 'waiting',
          opponentType: 'pvp',
          players,
          currentPlayers: room.players.length,
          maxPlayers: room.maxPlayers,
          message: 'Bergabung ke antrian, menunggu pemain lain...'
        }
      };
    }
  }

  // ── CREATE new waiting room ─────────────────────────────────────────────
  const roomId = generateRoomId();
  const sessionId = uuidv4();

  await db.query(
    'INSERT INTO game_sessions (id, room_id, mode, status, is_ranked, bet_amount) VALUES (?, ?, ?, ?, ?, ?)',
    [sessionId, roomId, mode, 'waiting', isRankedBool, betAmountInt]
  );
  await db.query(
    'INSERT INTO game_players (session_id, user_id, position) VALUES (?, ?, 0)',
    [sessionId, userId]
  );

  waitingRooms.set(roomId, {
    sessionId,
    mode,
    maxPlayers,
    players: [userId],
    createdAt: Date.now(),
    isRanked: isRankedBool,
    betAmount: betAmountInt
  });

  // Fetch creator info
  const [creatorRows] = await db.query(
    'SELECT username, active_character, active_skin FROM users WHERE id = ?',
    [userId]
  );
  const creator = creatorRows[0];
  const players = [{
    userId,
    username: creator ? creator.username : 'Mencari...',
    activeCharacter: creator ? creator.active_character : 'bocah_pemula',
    skin: creator ? (creator.active_skin || 'classic') : 'classic'
  }];

  return {
    status: 202,
    data: {
      roomId,
      sessionId,
      status: 'waiting',
      opponentType: 'pvp',
      players,
      currentPlayers: 1,
      maxPlayers,
      message: 'Mencari lawan, harap tunggu...'
    }
  };
}

/**
 * getStatus - Checks room status (used by client polling)
 */
async function getStatus(roomId) {
  const waiting = waitingRooms.get(roomId);
  if (waiting) {
    const [userRows] = await db.readQuery(
      'SELECT id, username, active_character, active_skin FROM users WHERE id IN (?)',
      [waiting.players]
    );
    const players = waiting.players.map(id => {
      const u = userRows.find(row => row.id === id);
      return {
        userId: id,
        username: u ? u.username : 'Mencari...',
        activeCharacter: u ? u.active_character : 'bocah_pemula',
        skin: u ? (u.active_skin || 'classic') : 'classic'
      };
    });

    return {
      status: 200,
      data: {
        roomId,
        status: 'waiting',
        currentPlayers: waiting.players.length,
        maxPlayers: waiting.maxPlayers,
        players,
        isRanked: waiting.isRanked,
        betAmount: waiting.betAmount || 0,
        waitingSeconds: Math.floor((Date.now() - waiting.createdAt) / 1000)
      }
    };
  }

  const [sessions] = await db.readQuery(
    'SELECT id, status, is_ranked, bet_amount FROM game_sessions WHERE room_id = ?',
    [roomId]
  );
  if (sessions.length === 0) return { status: 404, error: 'ROOM_NOT_FOUND' };
  const session = sessions[0];

  const [playerRows] = await db.readQuery(
    'SELECT gp.user_id, gp.position, u.username, u.active_character, u.active_skin FROM game_players gp LEFT JOIN users u ON u.id = gp.user_id WHERE gp.session_id = ? ORDER BY gp.position ASC',
    [session.id]
  );

  const players = playerRows.map(p => ({
    userId: p.user_id,
    position: p.position,
    username: p.username || 'Player',
    activeCharacter: p.active_character || 'bocah_pemula',
    skin: p.active_skin || 'classic'
  }));

  return {
    status: 200,
    data: {
      roomId,
      status: session.status,
      players,
      isRanked: !!session.is_ranked,
      betAmount: session.bet_amount || 0
    }
  };
}

/**
 * cancelSearch - Removes room from waiting list and marks session finished
 */
async function cancelSearch(roomId, userId) {
  const waiting = waitingRooms.get(roomId);
  if (!waiting) return { status: 404, error: 'ROOM_NOT_FOUND' };

  // Remove the player; if no players left, delete the room entirely
  waiting.players = waiting.players.filter(id => id !== userId);

  if (waiting.players.length === 0) {
    waitingRooms.delete(roomId);
    await db.query(
      'UPDATE game_sessions SET status = "finished" WHERE room_id = ?',
      [roomId]
    );
  }

  return { status: 200, data: { success: true } };
}

module.exports = { createSession, getStatus, cancelSearch, setIO };
