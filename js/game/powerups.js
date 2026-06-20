import { shuffle } from './domino.js';
import state from '../state.js';

export function usePowerup(type, gameState) {
  const user = state.user;
  if (!user) return { error: 'NOT_LOGGED_IN' };

  const stock = user.powerups[type] || 0;
  if (stock <= 0) return { error: 'NO_STOCK', message: 'Stok power-up habis' };

  if (gameState.usedPowerups.includes(type)) {
    return { error: 'ALREADY_USED', message: 'Power-up ini sudah digunakan ronde ini' };
  }

  user.powerups[type] = stock - 1;
  user.stats.powerupsUsed++;
  state.persistUser();
  gameState.usedPowerups.push(type);

  switch (type) {
    case 'shuffle':
      return applyShuffle(gameState);
    case 'peek':
      return applyPeek(gameState);
    case 'block':
      return applyBlock(gameState);
    case 'double_coin':
      return applyDoubleCoin(gameState);
    default:
      return { error: 'UNKNOWN_POWERUP' };
  }
}

function applyShuffle(gameState) {
  const playerIdx = gameState.currentPlayerIndex;
  gameState.hands[playerIdx] = shuffle(gameState.hands[playerIdx]);
  return { success: true, type: 'shuffle', message: 'Kartu di tangan diacak ulang!' };
}

function applyPeek(gameState) {
  const opponents = gameState.players
    .map((p, i) => ({ player: p, index: i }))
    .filter((_, i) => i !== gameState.currentPlayerIndex && gameState.hands[i].length > 0);

  if (opponents.length === 0) return { error: 'NO_TARGET' };

  const target = opponents[Math.floor(Math.random() * opponents.length)];
  const hand = gameState.hands[target.index];
  const randomCard = hand[Math.floor(Math.random() * hand.length)];

  return {
    success: true,
    type: 'peek',
    targetPlayer: target.player,
    targetIndex: target.index,
    revealedCard: randomCard,
    message: `Mengintip kartu ${target.player.username}...`
  };
}

function applyBlock(gameState) {
  const nextIdx = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  gameState.blockedPlayer = nextIdx;
  return {
    success: true,
    type: 'block',
    blockedIndex: nextIdx,
    blockedPlayer: gameState.players[nextIdx],
    message: `${gameState.players[nextIdx].username} diblokir 1 giliran!`
  };
}

function applyDoubleCoin(gameState) {
  gameState.doubleCoin = true;
  return {
    success: true,
    type: 'double_coin',
    message: 'Coin yang didapat ronde ini ×2!'
  };
}

export function getAvailablePowerups() {
  const user = state.user;
  if (!user) return [];

  return ['shuffle', 'peek', 'block', 'double_coin'].map(id => ({
    id,
    stock: user.powerups[id] || 0,
    name: { shuffle: 'Shuffle', peek: 'Peek', block: 'Block', double_coin: '2× Coin' }[id],
    iconId: { shuffle: 'icon_shuffle', peek: 'icon_eye', block: 'icon_block', double_coin: 'icon_coins' }[id]
  }));
}
