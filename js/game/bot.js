import { getValidMoves } from './domino.js';

export function botMove(hand, boardLeft, boardRight, level = 'easy') {
  const validMoves = getValidMoves(hand, boardLeft, boardRight);

  if (validMoves.length === 0) return null;

  if (level === 'easy') {
    return botMoveEasy(validMoves);
  }
  return botMoveHard(validMoves, boardLeft, boardRight);
}

function botMoveEasy(validMoves) {
  const move = validMoves[Math.floor(Math.random() * validMoves.length)];
  const side = move.sides.length > 1
    ? move.sides[Math.floor(Math.random() * move.sides.length)]
    : move.sides[0];
  return { card: move.card, index: move.index, side };
}

function botMoveHard(validMoves, boardLeft, boardRight) {
  const scored = validMoves.map(move => {
    const [a, b] = move.card;
    let score = a + b;

    // Prefer doubles (they block more)
    if (a === b) score += 3;

    // Prefer playing on the side that matches the higher pip
    const bestSide = move.sides.reduce((best, side) => {
      const target = side === 'left' ? boardLeft : boardRight;
      return target > (best.target || -1) ? { side, target } : best;
    }, {});

    return { ...move, score, bestSide: bestSide.side || move.sides[0] };
  });

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  return { card: best.card, index: best.index, side: best.bestSide };
}

const BOT_CHAT_MESSAGES = [
  'Ayo lanjut! 💪',
  'Giliran ku nih 🎲',
  'Hmm, kartu bagus...',
  'Kena blokir deh 😅',
  'Pass dulu ya...',
  'Siap menang! 🔥',
  'Mantap banget kartu ini!',
  'Tenang aja, masih bisa 😎',
  'Wah susah nih...',
  'Ayo main lagi! 🃏',
  'Seru banget ini meja! 🎰',
  'Domino time! 👑'
];

export function getBotChatMessage() {
  return BOT_CHAT_MESSAGES[Math.floor(Math.random() * BOT_CHAT_MESSAGES.length)];
}
