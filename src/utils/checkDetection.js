import { calculatePossibleMoves } from '../components/ChessPieceManager';

// Helper function to find a king's position
const findKing = (positions, color) => {
  for (const [square, piece] of Object.entries(positions)) {
    if (piece.type === 'king' && piece.color === color) {
      return square;
    }
  }
  return null;
};

// Check if a specific square is under attack
export const isSquareUnderAttack = (square, attackerColor, positions) => {
  // Create a temporary piece to check all possible moves
  const tempPiece = { color: attackerColor };
  
  // Check attacks from each type of piece
  for (const pieceType of ['pawn', 'night', 'bishop', 'rook', 'queen', 'king']) {
    tempPiece.type = pieceType;
    
    // Check all squares on the board
    for (const [fromSquare, piece] of Object.entries(positions)) {
      if (piece.color === attackerColor) {
        const moves = calculatePossibleMoves(piece, fromSquare, positions);
        if (moves.includes(square)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Check if a player is in check
export const isInCheck = (color, positions) => {
  const kingPosition = findKing(positions, color);
  if (!kingPosition) return false;
  
  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(kingPosition, opponentColor, positions);
};

// Check if a player is in checkmate
export const isInCheckmate = (color, positions) => {
  // First, verify if the player is in check
  if (!isInCheck(color, positions)) return false;
  
  // Try every possible move for every piece
  for (const [fromSquare, piece] of Object.entries(positions)) {
    if (piece.color === color) {
      const moves = calculatePossibleMoves(piece, fromSquare, positions);
      
      // Try each move to see if it gets out of check
      for (const toSquare of moves) {
        // Create a temporary board position
        const tempPositions = { ...positions };
        delete tempPositions[fromSquare];
        tempPositions[toSquare] = piece;
        
        // If this move gets us out of check, it's not checkmate
        if (!isInCheck(color, tempPositions)) {
          return false;
        }
      }
    }
  }
  
  // If no moves get us out of check, it's checkmate
  return true;
}; 