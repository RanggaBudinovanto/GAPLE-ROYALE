const db = require('../models/db');

const ITEMS_CATALOG = {
  characters: [
    { id: 'bocah_pemula', name: 'Bocah Pemula', price: 0, type: 'character' },
    { id: 'bocah_warnet', name: 'Bocah Warnet', price: 1000, type: 'character' },
    { id: 'magang_domino', name: 'Magang Domino', price: 1500, type: 'character' },
    { id: 'satpam_meja', name: 'Satpam Meja', price: 2000, type: 'character' },
    { id: 'kapten_kartu', name: 'Kapten Kartu', price: 3000, type: 'character' },
    { id: 'pawang_domino', name: 'Pawang Domino', price: 4000, type: 'character' },
    { id: 'raja_domino', name: 'Raja Domino', price: 5000, type: 'character' },
    { id: 'si_paling_gaple', name: 'Si Paling Gaple', price: 6000, type: 'character' },
    { id: 'ratu_casino', name: 'Ratu Casino', price: 7500, type: 'character' },
    { id: 'si_hoki', name: 'Si Hoki', price: 8000, type: 'character' },
    { id: 'bandar_darat', name: 'Bandar Darat', price: 10000, type: 'character' },
    { id: 'hacker_gaple', name: 'Hacker Gaple', price: 12000, type: 'character' },
    { id: 'juragan_meja', name: 'Juragan Meja', price: 15000, type: 'character' },
    { id: 'eyang_hoki', name: 'Eyang Hoki', price: 18000, type: 'character' },
    { id: 'master_zen', name: 'Master Zen', price: 22000, type: 'character' },
    { id: 'sang_bluffer', name: 'Sang Bluffer', price: 25000, type: 'character' },
    { id: 'legenda_royale', name: 'Legenda Royale', price: 30000, type: 'character' },
    { id: 'rangga_b', name: 'Rangga B', price: 35000, type: 'character' },
    { id: 'kucing_hoki', name: 'Kucing Hoki', price: 5000, type: 'character' },
    { id: 'anjing_royal', name: 'Anjing Royal', price: 5000, type: 'character' },
    { id: 'iron_gaple', name: 'Iron Gaple', price: 20000, type: 'character' },
    { id: 'spider_domino', name: 'Spider Domino', price: 20000, type: 'character' },
    { id: 'kapten_royale', name: 'Kapten Royale', price: 22000, type: 'character' },
    { id: 'thor_meja', name: 'Thor Meja', price: 25000, type: 'character' },
    { id: 'hulk_smash', name: 'Hulk Smash', price: 28000, type: 'character' }
  ],
  skins: [
    { id: 'classic', name: 'Classic Ivory', price: 0, type: 'skin' },
    { id: 'candy_pop', name: 'Candy Pop', price: 2500, type: 'skin' },
    { id: 'ocean_blue', name: 'Ocean Blue', price: 3000, type: 'skin' },
    { id: 'sakura_blossom', name: 'Sakura Pink', price: 3500, type: 'skin' },
    { id: 'ruby_red', name: 'Ruby Red', price: 4000, type: 'skin' },
    { id: 'volcano', name: 'Volcano Ash', price: 4500, type: 'skin' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', price: 5000, type: 'skin' },
    { id: 'marble_white', name: 'Carrara Marble', price: 5500, type: 'skin' },
    { id: 'midnight', name: 'Midnight Black', price: 6000, type: 'skin' },
    { id: 'carbon_fiber', name: 'Carbon Fiber', price: 8000, type: 'skin' },
    { id: 'emerald', name: 'Emerald Felt', price: 9000, type: 'skin' },
    { id: 'rainbow_unicorn', name: 'Rainbow Unicorn', price: 10000, type: 'skin' },
    { id: 'royal_gold', name: 'Royal Gold', price: 12000, type: 'skin' },
    { id: 'golden_luxury', name: 'Golden Luxury', price: 15000, type: 'skin' },
    { id: 'neon_glow', name: 'Neon Glow', price: 18000, type: 'skin' },
    { id: 'fire_blaze', name: 'Fire Blaze', price: 20000, type: 'skin' },
    { id: 'ice_frost', name: 'Ice Frost', price: 20000, type: 'skin' },
    { id: 'galaxy_star', name: 'Galaxy Star', price: 25000, type: 'skin' },
    { id: 'rainbow_shift', name: 'Rainbow Shift', price: 30000, type: 'skin' }
  ],
  powerups: [
    { id: 'shuffle', name: 'Shuffle', price: 50, maxStock: 99, type: 'powerup' },
    { id: 'peek', name: 'Peek', price: 80, maxStock: 99, type: 'powerup' },
    { id: 'block', name: 'Block', price: 100, maxStock: 99, type: 'powerup' },
    { id: 'double_coin', name: 'Double Coin', price: 120, maxStock: 99, type: 'powerup' }
  ]
};

const DAILY_REWARDS = [100, 150, 200, 300, 300, 400, 500];

const ACHIEVEMENTS = [
  { id: 'first_win', name: 'Kemenangan Pertama', desc: 'Menangkan game pertamamu', reward: 100, check: s => s.wins >= 1 },
  { id: 'domino_master', name: 'Domino Master', desc: 'Menangkan 10 game', reward: 500, check: s => s.wins >= 10 },
  { id: 'coin_collector', name: 'Kolektor Koin', desc: 'Kumpulkan 5.000 coin', reward: 300, check: s => s.totalCoinEarned >= 5000 },
  { id: 'power_user', name: 'Power User', desc: 'Gunakan power-up 20 kali', reward: 250, check: s => s.powerupsUsed >= 20 },
  { id: 'social_butterfly', name: 'Sosialita Meja', desc: 'Kirim 50 pesan chat', reward: 150, check: s => s.chatMessages >= 50 },
  { id: 'gaple_king', name: 'Raja Gaple', desc: 'Menangkan dengan situasi Gaple', reward: 400, check: () => false },
  { id: 'collector', name: 'Kolektor', desc: 'Miliki semua karakter', reward: 1000, check: (s, inv) => ITEMS_CATALOG.characters.every(c => inv.includes(c.id)) },
  { id: 'veteran', name: 'Veteran', desc: 'Main 50 game', reward: 600, check: s => s.totalGames >= 50 }
];

const DAILY_MISSIONS = [
  { id: 'play_3_rounds', name: 'Main 3 Ronde', desc: 'Selesaikan 3 game hari ini', target: 3, reward: 150 },
  { id: 'win_1_game', name: 'Menangkan 1 Game', desc: 'Menangkan 1 game hari ini', target: 1, reward: 300 },
  { id: 'chat_5_messages', name: 'Chat 5 Pesan', desc: 'Kirim 5 pesan chat dalam game', target: 5, reward: 100 }
];

async function getUser(userId) {
  const [rows] = await db.readQuery('SELECT * FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) return { status: 404, error: 'USER_NOT_FOUND' };

  const u = rows[0];
  const [achRows] = await db.readQuery('SELECT achievement_id, unlocked_at FROM achievements WHERE user_id = ?', [userId]);
  const stats = await getStats(userId);

  return {
    status: 200,
    data: {
      user: {
        id: u.id, username: u.username, activeCharacter: u.active_character,
        createdAt: u.created_at, stats: stats.data?.stats, achievements: achRows
      }
    }
  };
}

async function getInventory(userId) {
  const [rows] = await db.readQuery(
    'SELECT item_id, item_type, quantity FROM user_inventory WHERE user_id = ?', [userId]
  );
  return { status: 200, data: { inventory: rows.map(r => ({ itemId: r.item_id, itemType: r.item_type, quantity: r.quantity })) } };
}

async function purchaseItem(userId, itemId, itemType, quantity = 1) {
  const allItems = [...ITEMS_CATALOG.characters, ...ITEMS_CATALOG.skins, ...ITEMS_CATALOG.powerups];
  const item = allItems.find(i => i.id === itemId && i.type === itemType);
  if (!item) return { status: 400, error: 'ITEM_NOT_FOUND', message: 'Item tidak ditemukan' };

  const conn = await db.primary.getConnection();
  try {
    await conn.beginTransaction();

    const [userRows] = await conn.execute('SELECT coin FROM users WHERE id = ? FOR UPDATE', [userId]);
    if (userRows.length === 0) { await conn.rollback(); return { status: 404, error: 'USER_NOT_FOUND' }; }

    const userCoin = userRows[0].coin;

    if (itemType !== 'powerup') {
      const [existing] = await conn.execute('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ?', [userId, itemId]);
      if (existing.length > 0) { await conn.rollback(); return { status: 400, error: 'ALREADY_OWNED', message: 'Item sudah dimiliki' }; }
      quantity = 1;
    } else {
      const [existing] = await conn.execute('SELECT quantity FROM user_inventory WHERE user_id = ? AND item_id = ?', [userId, itemId]);
      const current = existing.length > 0 ? existing[0].quantity : 0;
      if (current + quantity > item.maxStock) { await conn.rollback(); return { status: 400, error: 'MAX_STOCK_REACHED', message: `Stok power-up sudah maksimum (${item.maxStock})` }; }
    }

    const totalCost = item.price * quantity;
    if (userCoin < totalCost) {
      await conn.rollback();
      return { status: 402, error: 'INSUFFICIENT_COIN', message: 'Coin tidak cukup', required: totalCost, current: userCoin, shortfall: totalCost - userCoin };
    }

    await conn.execute('UPDATE users SET coin = coin - ? WHERE id = ?', [totalCost, userId]);

    if (itemType === 'powerup') {
      await conn.execute(
        'INSERT INTO user_inventory (user_id, item_id, item_type, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
        [userId, itemId, itemType, quantity, quantity]
      );
    } else {
      await conn.execute('INSERT INTO user_inventory (user_id, item_id, item_type, quantity) VALUES (?, ?, ?, 1)', [userId, itemId, itemType]);
    }

    await conn.execute(
      'INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "spend", ?, ?, ?)',
      [userId, totalCost, `Beli ${item.name} x${quantity}`, userCoin - totalCost]
    );

    await conn.commit();
    return { status: 200, data: { success: true, newBalance: userCoin - totalCost, purchasedItem: { itemId, itemType, quantity } } };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateProfile(userId, username, password) {
  if (username) {
    if (username.length < 3 || username.length > 20) return { status: 400, error: 'VALIDATION_ERROR', message: 'Username harus 3-20 karakter' };
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return { status: 400, error: 'VALIDATION_ERROR', message: 'Username hanya boleh huruf, angka, dan underscore' };
    const [existing] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
    if (existing.length > 0) return { status: 400, error: 'USERNAME_TAKEN', message: 'Username sudah digunakan' };
    await db.query('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
  }
  if (password) {
    if (password.length < 6) return { status: 400, error: 'VALIDATION_ERROR', message: 'Password minimal 6 karakter' };
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);
  }
  const [rows] = await db.query('SELECT id, username, email, coin, active_character, active_skin FROM users WHERE id = ?', [userId]);
  return { status: 200, data: { success: true, user: rows[0] } };
}

async function setActiveCharacter(userId, characterId) {
  const [inv] = await db.query('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ? AND item_type = "character"', [userId, characterId]);
  if (inv.length === 0) return { status: 403, error: 'ITEM_NOT_OWNED', message: 'Karakter belum dimiliki' };
  await db.query('UPDATE users SET active_character = ? WHERE id = ?', [characterId, userId]);
  return { status: 200, data: { success: true, activeCharacter: characterId } };
}

async function setActiveSkin(userId, skinId) {
  const [inv] = await db.query('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ? AND item_type = "skin"', [userId, skinId]);
  if (inv.length === 0) return { status: 403, error: 'ITEM_NOT_OWNED', message: 'Skin belum dimiliki' };
  await db.query('UPDATE users SET active_skin = ? WHERE id = ?', [skinId, userId]);
  return { status: 200, data: { success: true, activeSkin: skinId } };
}

async function getStats(userId) {
  const [games] = await db.readQuery(
    `SELECT COUNT(*) as totalGames,
      SUM(CASE WHEN gs.winner_id = ? THEN 1 ELSE 0 END) as wins
     FROM game_players gp JOIN game_sessions gs ON gp.session_id = gs.id
     WHERE gp.user_id = ? AND gs.status = 'finished'`,
    [userId, userId]
  );
  const [txn] = await db.readQuery('SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE user_id = ? AND type = "earn"', [userId]);
  const [recent] = await db.readQuery(
    `SELECT gs.id as sessionId, gs.mode, gs.winner_id, gp.final_score as coinEarned, gs.finished_at as playedAt
     FROM game_players gp JOIN game_sessions gs ON gp.session_id = gs.id
     WHERE gp.user_id = ? AND gs.status = 'finished' ORDER BY gs.finished_at DESC LIMIT 10`,
    [userId]
  );

  const totalGames = games[0]?.totalGames || 0;
  const wins = games[0]?.wins || 0;
  const losses = totalGames - wins;

  return {
    status: 200,
    data: {
      stats: {
        wins, losses, totalGames,
        winRate: totalGames > 0 ? Math.round(wins / totalGames * 1000) / 10 : 0,
        totalCoinEarned: txn[0]?.total || 0,
        longestStreak: 0,
        recentGames: recent.map(r => ({
          sessionId: r.sessionId, mode: r.mode,
          result: r.winner_id === userId ? 'win' : 'lose',
          coinEarned: r.coinEarned, playedAt: r.playedAt
        }))
      }
    }
  };
}

async function claimDailyLogin(userId) {
  const [rows] = await db.query('SELECT last_login, login_streak, coin FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) return { status: 404, error: 'USER_NOT_FOUND' };

  const user = rows[0];
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = user.last_login ? new Date(user.last_login).toISOString().split('T')[0] : null;

  if (lastLogin === today) return { status: 400, error: 'ALREADY_CLAIMED', message: 'Bonus hari ini sudah diklaim' };

  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const streak = lastLogin === yesterdayStr ? Math.min(user.login_streak + 1, 7) : 1;
  const reward = DAILY_REWARDS[streak - 1];

  await db.query('UPDATE users SET last_login = NOW(), login_streak = ?, coin = coin + ? WHERE id = ?', [streak, reward, userId]);
  await db.query('INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "earn", ?, "Daily Login Bonus", ?)', [userId, reward, user.coin + reward]);

  return { status: 200, data: { success: true, day: streak, coinReward: reward, newBalance: user.coin + reward, loginStreak: streak } };
}

async function getDailyMissions(userId) {
  const today = new Date().toISOString().split('T')[0];
  const [existing] = await db.query('SELECT * FROM daily_missions WHERE user_id = ? AND mission_date = ?', [userId, today]);

  if (existing.length === 0) {
    for (const m of DAILY_MISSIONS) {
      await db.query(
        'INSERT INTO daily_missions (user_id, mission_date, mission_id, progress, target) VALUES (?, ?, ?, 0, ?)',
        [userId, today, m.id, m.target]
      );
    }
    return { status: 200, data: { date: today, missions: DAILY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false, claimed: false })) } };
  }

  const missions = DAILY_MISSIONS.map(m => {
    const row = existing.find(e => e.mission_id === m.id);
    return { ...m, progress: row?.progress || 0, completed: !!row?.completed, claimed: !!row?.claimed };
  });

  return { status: 200, data: { date: today, missions } };
}

async function claimMissionReward(userId, missionId) {
  const today = new Date().toISOString().split('T')[0];
  const [rows] = await db.query('SELECT * FROM daily_missions WHERE user_id = ? AND mission_date = ? AND mission_id = ?', [userId, today, missionId]);

  if (rows.length === 0) return { status: 404, error: 'NOT_FOUND' };
  if (!rows[0].completed) return { status: 400, error: 'MISSION_NOT_COMPLETED', message: 'Misi belum selesai' };
  if (rows[0].claimed) return { status: 400, error: 'ALREADY_CLAIMED', message: 'Reward sudah diklaim' };

  const mission = DAILY_MISSIONS.find(m => m.id === missionId);
  if (!mission) return { status: 404, error: 'NOT_FOUND' };

  await db.query('UPDATE daily_missions SET claimed = TRUE WHERE user_id = ? AND mission_date = ? AND mission_id = ?', [userId, today, missionId]);
  await db.query('UPDATE users SET coin = coin + ? WHERE id = ?', [mission.reward, userId]);

  const [user] = await db.query('SELECT coin FROM users WHERE id = ?', [userId]);
  await db.query('INSERT INTO transactions (user_id, type, amount, reason, balance_after) VALUES (?, "earn", ?, ?, ?)', [userId, mission.reward, `Misi: ${mission.name}`, user[0].coin]);

  return { status: 200, data: { success: true, coinReward: mission.reward, newBalance: user[0].coin } };
}

async function updateMissionProgress(userId, missionId, amount = 1) {
  const today = new Date().toISOString().split('T')[0];
  await db.query(
    `UPDATE daily_missions SET progress = LEAST(progress + ?, target),
     completed = (LEAST(progress + ?, target) >= target)
     WHERE user_id = ? AND mission_date = ? AND mission_id = ?`,
    [amount, amount, userId, today, missionId]
  );
}

module.exports = {
  getUser, getInventory, purchaseItem, setActiveCharacter, setActiveSkin,
  getStats, claimDailyLogin, getDailyMissions, claimMissionReward, updateMissionProgress,
  updateProfile, ITEMS_CATALOG, ACHIEVEMENTS, DAILY_MISSIONS
};
