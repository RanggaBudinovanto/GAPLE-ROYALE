import { calculatePipTotal } from './domino.js';
import { getCatalog } from '../api.js';

const COIN_REWARDS = {
  win_duel: 200,
  win_4player: 300,
  lose: 50,
  base_per_game: 30,
  streak_bonus: 20
};

export function calculateGameResult(hands, players, mode, winnerIndex, doubleCoin = false) {
  const scores = players.map((player, i) => ({
    userId: player.id,
    username: player.username,
    cardsLeft: hands[i].length,
    totalPip: calculatePipTotal(hands[i]),
    rank: 0
  }));

  scores.sort((a, b) => {
    if (a.cardsLeft !== b.cardsLeft) return a.cardsLeft - b.cardsLeft;
    return a.totalPip - b.totalPip;
  });

  scores.forEach((s, i) => s.rank = i + 1);

  return scores;
}

export function calculateCoinReward(player, isWinner, mode, streak, doubleCoin, activeCharacter, betAmount = 0, numPlayers = 2) {
  const betAmountInt = parseInt(betAmount || 0);
  if (betAmountInt > 0) {
    if (isWinner) {
      return {
        base: 0,
        winBonus: betAmountInt * numPlayers,
        streakBonus: 0,
        passiveBonus: 0,
        multiplier: 1,
        total: betAmountInt * numPlayers
      };
    } else {
      return {
        base: 0,
        winBonus: 0,
        streakBonus: 0,
        passiveBonus: 0,
        multiplier: 1,
        total: 0
      };
    }
  }

  let base = COIN_REWARDS.base_per_game;
  let winBonus = 0;
  let streakBonus = 0;
  let passiveBonus = 0;
  let multiplier = doubleCoin ? 2 : 1;

  if (isWinner) {
    winBonus = mode === 'duel' ? COIN_REWARDS.win_duel : COIN_REWARDS.win_4player;
    streakBonus = streak * COIN_REWARDS.streak_bonus;
  } else {
    base = COIN_REWARDS.lose;
  }

  const catalog = getCatalog();
  const character = catalog.characters.find(c => c.id === activeCharacter);
  if (character && isWinner && character.skill) {
    const match = character.skill.match(/\+(\d+)%/);
    if (match) {
      const pct = parseInt(match[1], 10) / 100;
      passiveBonus = Math.floor((base + winBonus + streakBonus) * pct);
    }
  }

  const total = (base + winBonus + streakBonus + passiveBonus) * multiplier;

  return {
    base,
    winBonus,
    streakBonus,
    passiveBonus,
    multiplier,
    total
  };
}

export function determineWinner(hands) {
  let winnerIdx = 0;
  let minCards = hands[0].length;
  let minPips = calculatePipTotal(hands[0]);

  for (let i = 1; i < hands.length; i++) {
    const cards = hands[i].length;
    const pips = calculatePipTotal(hands[i]);

    if (cards < minCards || (cards === minCards && pips < minPips)) {
      winnerIdx = i;
      minCards = cards;
      minPips = pips;
    }
  }

  return winnerIdx;
}
