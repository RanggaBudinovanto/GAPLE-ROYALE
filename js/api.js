import { getItem, setItem, findUserById, getAllUsers } from './utils/storage.js';
import { getToday } from './utils/format.js';
import state from './state.js';
import { apiCall } from './config.js';

const ITEMS_CATALOG = {
  characters: [
    { id: 'bocah_pemula', name: 'Bocah Pemula', price: 0, skill: 'Tanpa bonus (Pemula)', type: 'character' },
    { id: 'bocah_warnet', name: 'Bocah Warnet', price: 1000, skill: 'Bonus coin +3% tiap menang', type: 'character' },
    { id: 'magang_domino', name: 'Magang Domino', price: 1500, skill: 'Bonus coin +5% tiap menang', type: 'character' },
    { id: 'satpam_meja', name: 'Satpam Meja', price: 2000, skill: 'Bonus coin +6% tiap menang', type: 'character' },
    { id: 'kapten_kartu', name: 'Kapten Kartu', price: 3000, skill: 'Bonus coin +10% tiap menang', type: 'character' },
    { id: 'pawang_domino', name: 'Pawang Domino', price: 4000, skill: 'Bonus coin +8% tiap menang', type: 'character' },
    { id: 'raja_domino', name: 'Raja Domino', price: 5000, skill: 'Bonus coin +15% tiap menang', type: 'character' },
    { id: 'si_paling_gaple', name: 'Si Paling Gaple', price: 6000, skill: 'Bonus coin +12% tiap menang', type: 'character' },
    { id: 'ratu_casino', name: 'Ratu Casino', price: 7500, skill: 'Bonus coin +15% tiap menang', type: 'character' },
    { id: 'si_hoki', name: 'Si Hoki', price: 8000, skill: 'Lihat 1 kartu lawan per game (sekali)', type: 'character' },
    { id: 'bandar_darat', name: 'Bandar Darat', price: 10000, skill: 'Bonus coin +18% tiap menang', type: 'character' },
    { id: 'hacker_gaple', name: 'Hacker Gaple', price: 12000, skill: 'Bonus coin +20% tiap menang', type: 'character' },
    { id: 'juragan_meja', name: 'Juragan Meja', price: 15000, skill: 'Undo 1 langkah per game', type: 'character' },
    { id: 'eyang_hoki', name: 'Eyang Hoki', price: 18000, skill: 'Bonus coin +22% tiap menang', type: 'character' },
    { id: 'master_zen', name: 'Master Zen', price: 22000, skill: 'Bonus coin +25% tiap menang', type: 'character' },
    { id: 'sang_bluffer', name: 'Sang Bluffer', price: 25000, skill: 'Skip tanpa penalty 1x per game', type: 'character' },
    { id: 'legenda_royale', name: 'Legenda Royale', price: 30000, skill: 'Bonus coin +30% tiap menang', type: 'character' }
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
    { id: 'golden_luxury', name: 'Golden Luxury', price: 15000, type: 'skin' }
  ],
  powerups: [
    { id: 'shuffle', name: 'Shuffle', price: 50, icon: '🔀', desc: 'Acak ulang kartu di tangan (1x per game)', maxStock: 99, type: 'powerup' },
    { id: 'peek', name: 'Peek', price: 80, icon: '👁️', desc: 'Intip 1 kartu acak lawan (1x per game)', maxStock: 99, type: 'powerup' },
    { id: 'block', name: 'Block', price: 100, icon: '🚫', desc: 'Paksa lawan skip 1 giliran berikutnya', maxStock: 99, type: 'powerup' },
    { id: 'double_coin', name: 'Double Coin', price: 120, icon: '💰', desc: 'Coin yang didapat ronde ini ×2', maxStock: 99, type: 'powerup' }
  ]
};

const DAILY_REWARDS = [100, 150, 200, 300, 300, 400, 500];

const ACHIEVEMENTS = [
  { id: 'first_win', name: 'Kemenangan Pertama', desc: 'Menangkan game pertamamu', reward: 100 },
  { id: 'domino_master', name: 'Domino Master', desc: 'Menangkan 10 game', reward: 500 },
  { id: 'coin_collector', name: 'Kolektor Koin', desc: 'Kumpulkan 5.000 coin', reward: 300 },
  { id: 'power_user', name: 'Power User', desc: 'Gunakan power-up 20 kali', reward: 250 },
  { id: 'social_butterfly', name: 'Sosialita Meja', desc: 'Kirim 50 pesan chat', reward: 150 },
  { id: 'gaple_king', name: 'Raja Gaple', desc: 'Menangkan dengan situasi Gaple', reward: 400 },
  { id: 'collector', name: 'Kolektor', desc: 'Miliki semua karakter', reward: 1000 },
  { id: 'veteran', name: 'Veteran', desc: 'Main 50 game', reward: 600 }
];

const COIN_REWARDS = {
  win_duel: 200,
  win_4player: 300,
  lose: 50,
  base_per_game: 30,
  streak_bonus: 20
};

const DAILY_MISSIONS_TEMPLATE = [
  { id: 'play_3_rounds', name: 'Main 3 Ronde', desc: 'Selesaikan 3 game hari ini', target: 3, reward: 150 },
  { id: 'win_1_game', name: 'Menangkan 1 Game', desc: 'Menangkan 1 game hari ini', target: 1, reward: 300 },
  { id: 'chat_5_messages', name: 'Chat 5 Pesan', desc: 'Kirim 5 pesan chat dalam game', target: 5, reward: 100 }
];

export function getCatalog() { return ITEMS_CATALOG; }
export function getAchievementsList() { return ACHIEVEMENTS; }
export function getCoinRewards() { return COIN_REWARDS; }

export function purchaseItem(itemId, itemType, quantity = 1) {
  const user = state.user;
  if (!user) return { error: 'UNAUTHORIZED' };

  let catalog;
  if (itemType === 'character') catalog = ITEMS_CATALOG.characters;
  else if (itemType === 'skin') catalog = ITEMS_CATALOG.skins;
  else if (itemType === 'powerup') catalog = ITEMS_CATALOG.powerups;
  else return { error: 'ITEM_NOT_FOUND', message: 'Tipe item tidak valid' };

  const item = catalog.find(i => i.id === itemId);
  if (!item) return { error: 'ITEM_NOT_FOUND', message: 'Item tidak ditemukan' };

  if (itemType !== 'powerup') {
    if (user.inventory.includes(itemId)) {
      return { error: 'ALREADY_OWNED', message: 'Item sudah dimiliki' };
    }
    quantity = 1;
  } else {
    const current = user.powerups[itemId] || 0;
    if (current + quantity > item.maxStock) {
      return { error: 'MAX_STOCK_REACHED', message: `Stok power-up sudah maksimum (${item.maxStock})` };
    }
  }

  const totalCost = item.price * quantity;
  if (user.coin < totalCost) {
    return {
      error: 'INSUFFICIENT_COIN',
      message: 'Coin tidak cukup',
      required: totalCost,
      current: user.coin,
      shortfall: totalCost - user.coin
    };
  }

  user.coin -= totalCost;
  if (itemType === 'powerup') {
    user.powerups[itemId] = (user.powerups[itemId] || 0) + quantity;
  } else {
    user.inventory.push(itemId);
  }

  state.set('coin', user.coin);
  state.set('inventory', [...user.inventory]);
  state.persistUser();

  checkAchievements();

  // Call backend API if logged in
  const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
  if (backendToken) {
    apiCall('POST', `/users/${user.id}/inventory/purchase`, { itemId, itemType, quantity }).then(res => {
      if (res.error) {
        console.warn('Backend purchase sync failed:', res.message);
      } else if (res.data && res.data.newBalance !== undefined) {
        user.coin = res.data.newBalance;
        state.set('coin', user.coin);
        state.persistUser();
      }
    });
  }

  return { success: true, newBalance: user.coin };
}

export function activateCharacter(characterId) {
  const user = state.user;
  if (!user) return { error: 'UNAUTHORIZED' };
  if (!user.inventory.includes(characterId)) return { error: 'ITEM_NOT_OWNED' };
  user.activeCharacter = characterId;
  state.persistUser();

  // Call backend API if logged in
  const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
  if (backendToken) {
    apiCall('PUT', `/users/${user.id}/character`, { characterId }).then(res => {
      if (res.error) console.warn('Backend character activation sync failed:', res.message);
    });
  }

  return { success: true };
}

export function activateSkin(skinId) {
  const user = state.user;
  if (!user) return { error: 'UNAUTHORIZED' };
  if (!user.inventory.includes(skinId)) return { error: 'ITEM_NOT_OWNED' };
  user.activeSkin = skinId;
  state.persistUser();

  // Call backend API if logged in
  const backendToken = sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
  if (backendToken) {
    apiCall('PUT', `/users/${user.id}/skin`, { skinId }).then(res => {
      if (res.error) console.warn('Backend skin activation sync failed:', res.message);
    });
  }

  return { success: true };
}

export function claimDailyLogin() {
  const user = state.user;
  if (!user) return { error: 'UNAUTHORIZED' };

  const today = getToday();
  if (user.lastLogin === today) {
    return { error: 'ALREADY_CLAIMED', message: 'Bonus hari ini sudah diklaim' };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (user.lastLogin === yesterdayStr) {
    user.loginStreak = Math.min(user.loginStreak + 1, 7);
  } else {
    user.loginStreak = 1;
  }

  const day = user.loginStreak;
  const reward = DAILY_REWARDS[day - 1] || DAILY_REWARDS[6];

  user.lastLogin = today;
  user.coin += reward;
  user.stats.totalCoinEarned += reward;
  state.set('coin', user.coin);
  state.persistUser();

  return { success: true, day, coinReward: reward, newBalance: user.coin, loginStreak: user.loginStreak };
}

export function getDailyMissions() {
  const user = state.user;
  if (!user) return [];

  const today = getToday();
  if (!user.dailyMissions || user.dailyMissions.date !== today) {
    user.dailyMissions = {
      date: today,
      missions: DAILY_MISSIONS_TEMPLATE.map(m => ({
        ...m,
        progress: 0,
        completed: false,
        claimed: false
      }))
    };
    state.persistUser();
  }

  return user.dailyMissions.missions;
}

export function updateMissionProgress(missionId, amount = 1) {
  const user = state.user;
  if (!user || !user.dailyMissions) return;

  const mission = user.dailyMissions.missions.find(m => m.id === missionId);
  if (!mission || mission.completed) return;

  mission.progress = Math.min(mission.progress + amount, mission.target);
  if (mission.progress >= mission.target) {
    mission.completed = true;
  }
  state.persistUser();
}

export function claimMissionReward(missionId) {
  const user = state.user;
  if (!user || !user.dailyMissions) return { error: 'NOT_FOUND' };

  const mission = user.dailyMissions.missions.find(m => m.id === missionId);
  if (!mission) return { error: 'NOT_FOUND' };
  if (!mission.completed) return { error: 'MISSION_NOT_COMPLETED', message: 'Misi belum selesai' };
  if (mission.claimed) return { error: 'ALREADY_CLAIMED', message: 'Reward sudah diklaim' };

  mission.claimed = true;
  user.coin += mission.reward;
  user.stats.totalCoinEarned += mission.reward;
  state.set('coin', user.coin);
  state.persistUser();

  return { success: true, coinReward: mission.reward, newBalance: user.coin };
}

export function getLeaderboard(type = 'global') {
  const CACHE_TTL = 5 * 60 * 1000;
  const cacheKey = `lb_cache_${type}`;
  const cached = getItem(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { data: cached.data, cached: true, cacheExpiry: cached.timestamp + CACHE_TTL };
  }

  const users = getAllUsers();
  const data = users.map(u => ({
    userId: u.id,
    username: u.username,
    activeCharacter: u.activeCharacter,
    wins: u.stats.wins,
    totalGames: u.stats.totalGames,
    winRate: u.stats.totalGames > 0 ? Math.round((u.stats.wins / u.stats.totalGames) * 1000) / 10 : 0,
    totalCoin: u.stats.totalCoinEarned
  }))
  .sort((a, b) => b.wins - a.wins)
  .map((entry, i) => ({ ...entry, rank: i + 1 }));

  setItem(cacheKey, { data, timestamp: Date.now() });
  return { data, cached: false, cacheExpiry: Date.now() + CACHE_TTL };
}

export function checkAchievements() {
  const user = state.user;
  if (!user) return [];

  const newlyUnlocked = [];
  const checks = [
    { id: 'first_win', condition: () => user.stats.wins >= 1 },
    { id: 'domino_master', condition: () => user.stats.wins >= 10 },
    { id: 'coin_collector', condition: () => user.stats.totalCoinEarned >= 5000 },
    { id: 'power_user', condition: () => user.stats.powerupsUsed >= 20 },
    { id: 'social_butterfly', condition: () => user.stats.chatMessagesSent >= 50 },
    { id: 'collector', condition: () => ITEMS_CATALOG.characters.every(c => user.inventory.includes(c.id)) },
    { id: 'veteran', condition: () => user.stats.totalGames >= 50 }
  ];

  checks.forEach(({ id, condition }) => {
    if (!user.achievements.find(a => a.id === id) && condition()) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      user.achievements.push({ id, unlockedAt: new Date().toISOString() });
      user.coin += achievement.reward;
      user.stats.totalCoinEarned += achievement.reward;
      newlyUnlocked.push(achievement);
    }
  });

  if (newlyUnlocked.length > 0) {
    state.set('coin', user.coin);
    state.persistUser();
  }

  return newlyUnlocked;
}

export function generateBotPlayers(count, mode) {
  const botNames = ['Bot Surya', 'Bot Dewi', 'Bot Andi', 'Bot Rini', 'Bot Joko', 'Bot Sari'];
  const botChars = ['raja_domino', 'si_hoki', 'juragan_meja', 'sang_bluffer'];
  const botSkins = ['classic', 'candy_pop', 'ocean_blue', 'sakura_blossom', 'ruby_red', 'volcano', 'cyberpunk', 'marble_white', 'midnight', 'carbon_fiber', 'emerald', 'rainbow_unicorn', 'royal_gold', 'golden_luxury'];
  const bots = [];
  for (let i = 0; i < count; i++) {
    bots.push({
      id: `bot_${i}`,
      username: botNames[i % botNames.length],
      activeCharacter: botChars[i % botChars.length],
      skin: botSkins[i % botSkins.length],
      isBot: true
    });
  }
  return bots;
}
