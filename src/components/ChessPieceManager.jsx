// Helper functions to validate moves for each piece type
const isValidPawnMove = (from, to, color, isCapture, board) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  
  // Convert file (letter) to number (0-7)
  const fileChange = toFile.charCodeAt(0) - fromFile.charCodeAt(0);
  const rankChange = color === 'white' 
    ? Number(toRank) - Number(fromRank)
    : Number(fromRank) - Number(toRank);

  // Regular move (forward one square)
  if (fileChange === 0 && rankChange === 1 && !isCapture) {
    return true;
  }

  // First move (can move two squares)
  const isFirstMove = (color === 'white' && fromRank === '2') || 
                     (color === 'black' && fromRank === '7');
  if (fileChange === 0 && rankChange === 2 && isFirstMove && !isCapture) {
    // Check if path is clear
    const middleRank = color === 'white' ? Number(fromRank) + 1 : Number(fromRank) - 1;
    const middleSquare = `${fromFile}${middleRank}`;
    if (board[middleSquare]) return false;
    return true;
  }

  // Capture move (diagonal)
  if (Math.abs(fileChange) === 1 && rankChange === 1) {
    // For diagonal moves, we need an enemy piece to capture
    if (isCapture) {
      const targetPiece = board[to];
      // Check if there's an enemy piece to capture
      return targetPiece && targetPiece.color !== color;
    }
    return false;
  }

  return false;
};

const isPathClear = (from, to, board) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  
  const fileStep = Math.sign(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
  const rankStep = Math.sign(Number(toRank) - Number(fromRank));
  
  let currentFile = fromFile.charCodeAt(0) + fileStep;
  let currentRank = Number(fromRank) + rankStep;
  
  // Check all squares between from and to (exclusive)
  while (
    (fileStep !== 0 && currentFile !== toFile.charCodeAt(0)) || 
    (rankStep !== 0 && currentRank !== Number(toRank))
  ) {
    const square = `${String.fromCharCode(currentFile)}${currentRank}`;
    if (board[square]) {
      return false; // Path is blocked
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }
  
  return true;
};

const isValidRookMove = (from, to, isCapture, board) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  
  // Rook moves either horizontally or vertically
  if (fromFile === toFile || fromRank === toRank) {
    return isPathClear(from, to, board);
  }
  return false;
};

const isValidKnightMove = (from, to, isCapture) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  
  const fileChange = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
  const rankChange = Math.abs(Number(toRank) - Number(fromRank));
  
  // Knight moves in L-shape: 2 squares in one direction and 1 in the other
  return (fileChange === 2 && rankChange === 1) || (fileChange === 1 && rankChange === 2);
};

const isValidBishopMove = (from, to, isCapture, board) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  
  const fileChange = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
  const rankChange = Math.abs(Number(toRank) - Number(fromRank));
  
  // Bishop moves diagonally (equal change in rank and file)
  if (fileChange === rankChange) {
    return isPathClear(from, to, board);
  }
  return false;
};

const isValidQueenMove = (from, to, isCapture, board) => {
  // Queen combines Rook and Bishop movements
  return isValidRookMove(from, to, isCapture, board) || 
         isValidBishopMove(from, to, isCapture, board);
};

const isValidKingMove = (from, to, isCapture) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  
  const fileChange = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
  const rankChange = Math.abs(Number(toRank) - Number(fromRank));
  
  // King moves one square in any direction
  return fileChange <= 1 && rankChange <= 1;
};

export const isValidMove = (piece, from, to, board) => {
  // Check if target square has a piece
  const targetPiece = board[to];
  
  // Don't allow capturing own pieces
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }

  const isCapture = targetPiece !== undefined;

  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(from, to, piece.color, isCapture, board);
    case 'rook':
      return isValidRookMove(from, to, isCapture, board);
    case 'night':
      return isValidKnightMove(from, to, isCapture);  // Knights can jump, no board needed
    case 'bishop':
      return isValidBishopMove(from, to, isCapture, board);
    case 'queen':
      return isValidQueenMove(from, to, isCapture, board);
    case 'king':
      return isValidKingMove(from, to, isCapture);  // Kings move one square, no path check needed
    default:
      return false;
  }
}; 