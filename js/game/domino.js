export function generateDominoSet() {
  const set = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      set.push([i, j]);
    }
  }
  return set;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function dealCards(numPlayers) {
  const set = shuffle(generateDominoSet());
  const handSize = numPlayers === 2 ? 14 : 7;
  const hands = [];
  for (let i = 0; i < numPlayers; i++) {
    hands.push(set.slice(i * handSize, (i + 1) * handSize));
  }
  return hands;
}

export function getValidMoves(hand, boardLeft, boardRight) {
  if (boardLeft === null && boardRight === null) {
    return hand.map((card, index) => ({ card, index, sides: ['first'] }));
  }

  const moves = [];
  hand.forEach((card, index) => {
    const [a, b] = card;
    const sides = [];

    if (a === boardLeft || b === boardLeft) sides.push('left');
    if (a === boardRight || b === boardRight) sides.push('right');

    if (boardLeft === boardRight && sides.length > 1) {
      // dedupe
    }

    if (sides.length > 0) {
      moves.push({ card, index, sides });
    }
  });

  return moves;
}

export function canPlayCard(card, boardLeft, boardRight) {
  if (boardLeft === null) return true;
  const [a, b] = card;
  return a === boardLeft || b === boardLeft || a === boardRight || b === boardRight;
}

export function orientCard(card, targetValue, side) {
  const [a, b] = card;
  if (side === 'left') {
    return b === targetValue ? [a, b] : [b, a];
  } else {
    return a === targetValue ? [a, b] : [b, a];
  }
}

export function calculatePipTotal(hand) {
  return hand.reduce((sum, [a, b]) => sum + a + b, 0);
}
