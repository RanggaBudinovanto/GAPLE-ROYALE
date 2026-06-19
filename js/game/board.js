export function createBoard() {
  return {
    chain: [],
    left: null,
    right: null,
    centerIndex: 0
  };
}

export function playCard(board, card, side) {
  const [a, b] = card;

  if (board.chain.length === 0) {
    board.chain.push(card);
    board.left = a;
    board.right = b;
    board.centerIndex = 0;
    return board;
  }

  if (side === 'left') {
    if (b === board.left) {
      board.chain.unshift([a, b]);
      board.left = a;
      board.centerIndex++;
    } else if (a === board.left) {
      board.chain.unshift([b, a]);
      board.left = b;
      board.centerIndex++;
    }
  } else if (side === 'right') {
    if (a === board.right) {
      board.chain.push([a, b]);
      board.right = b;
    } else if (b === board.right) {
      board.chain.push([b, a]);
      board.right = a;
    }
  } else if (side === 'first') {
    board.chain.push(card);
    board.left = a;
    board.right = b;
    board.centerIndex = 0;
  }

  return board;
}

export function canPlayOnSide(card, board, side) {
  const [a, b] = card;
  if (side === 'left') return a === board.left || b === board.left;
  if (side === 'right') return a === board.right || b === board.right;
  return false;
}

export function getBoardState(board) {
  return {
    chain: [...board.chain],
    left: board.left,
    right: board.right,
    centerIndex: board.centerIndex,
    length: board.chain.length
  };
}
