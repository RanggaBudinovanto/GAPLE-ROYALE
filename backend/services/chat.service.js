const db = require('../models/db');

async function saveMessage(sessionId, userId, username, content) {
  await db.query(
    'INSERT INTO chat_messages (session_id, user_id, message) VALUES (?, ?, ?)',
    [sessionId, userId, content.substring(0, 500)]
  );
  return { userId, username, content, timestamp: new Date().toISOString() };
}

async function getHistory(sessionId) {
  const [rows] = await db.readQuery(
    `SELECT cm.user_id, u.username, cm.message as content, cm.created_at as timestamp
     FROM chat_messages cm
     LEFT JOIN users u ON cm.user_id = u.id
     WHERE cm.session_id = ?
     ORDER BY cm.created_at ASC
     LIMIT 50`,
    [sessionId]
  );
  return {
    status: 200,
    data: {
      sessionId,
      messages: rows.map(r => ({
        userId: r.user_id,
        username: r.username || r.user_id,
        content: r.content,
        timestamp: r.timestamp
      }))
    }
  };
}

const BOT_MESSAGES = [
  'Ayo lanjut! 💪', 'Giliran ku nih 🎲', 'Hmm, kartu bagus...',
  'Kena blokir deh 😅', 'Pass dulu ya...', 'Siap menang! 🔥',
  'Mantap banget kartu ini!', 'Tenang aja, masih bisa 😎',
  'Wah susah nih...', 'Ayo main lagi! 🃏', 'Seru banget! 🎰', 'Domino time! 👑'
];

function getBotReply() {
  return BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
}

module.exports = { saveMessage, getHistory, getBotReply };
