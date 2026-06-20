const db = require('../models/db');
const { cacheGet, cacheSet, TTL } = require('../config/redis');

async function getLeaderboard(type = 'global', page = 1, limit = 20) {
  const cacheKey = `leaderboard:${type}:${page}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return { status: 200, data: { ...cached, cached: true, cacheExpiry: Date.now() + TTL * 1000 } };
  }

  let dateFilter = '';
  const params = [];

  if (type === 'weekly') {
    dateFilter = 'AND gs.finished_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
  }

  const [countRows] = await db.readQuery(`SELECT COUNT(DISTINCT u.id) as total FROM users u`);
  const total = countRows[0]?.total || 0;

  const offset = (page - 1) * limit;

  const [rows] = await db.readQuery(
    `SELECT u.id as userId, u.username, u.active_character as activeCharacter,
      COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) as wins,
      COUNT(gs.id) as totalGames,
      ROUND(COALESCE(COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) / NULLIF(COUNT(gs.id), 0) * 100, 0), 1) as winRate
     FROM users u
     LEFT JOIN game_players gp ON u.id = gp.user_id
     LEFT JOIN game_sessions gs ON gp.session_id = gs.id AND gs.status = 'finished' ${dateFilter}
     GROUP BY u.id
     ORDER BY wins DESC, winRate DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const data = rows.map((r, i) => ({
    rank: offset + i + 1,
    userId: r.userId, username: r.username, activeCharacter: r.activeCharacter,
    wins: r.wins, totalGames: r.totalGames, winRate: r.winRate
  }));

  const result = { type, page, limit, total, data };
  await cacheSet(cacheKey, result);

  return { status: 200, data: { ...result, cached: false, cacheExpiry: Date.now() + TTL * 1000 } };
}

async function getMyRank(userId) {
  const [rows] = await db.readQuery(
    `SELECT ranked.rank, ranked.wins, ranked.totalGames, ranked.winRate FROM (
      SELECT u.id,
        COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) as wins,
        COUNT(gs.id) as totalGames,
        ROUND(COALESCE(COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) / NULLIF(COUNT(gs.id), 0) * 100, 0), 1) as winRate,
        RANK() OVER (ORDER BY COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) DESC) as \`rank\`
      FROM users u
      LEFT JOIN game_players gp ON u.id = gp.user_id
      LEFT JOIN game_sessions gs ON gp.session_id = gs.id AND gs.status = 'finished'
      GROUP BY u.id
    ) ranked WHERE ranked.id = ?`,
    [userId]
  );

  if (rows.length === 0) return { status: 200, data: { rank: 0, wins: 0, totalGames: 0, winRate: 0 } };
  return { status: 200, data: rows[0] };
}

module.exports = { getLeaderboard, getMyRank };
