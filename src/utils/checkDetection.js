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
export const isInCheck = (positions, color) => {
  // Find the king's position
  let kingPosition = null;
  for (const [position, piece] of Object.entries(positions)) {
    if (piece.type === 'king' && piece.color === color) {
      kingPosition = position;
      break;
    }
  }

  if (!kingPosition) return false;

  // Check if any opponent piece can capture the king
  for (const [position, piece] of Object.entries(positions)) {
    if (piece.color !== color) {
      const moves = calculatePossibleMoves(piece, position, positions);
      if (moves.includes(kingPosition)) {
        return true;
      }
    }
  }
  return false;
};

// Check if a player is in checkmate
export const isInCheckmate = (positions, color) => {
  if (!isInCheck(positions, color)) return false;

  // Try all possible moves for all pieces of the current color
  for (const [position, piece] of Object.entries(positions)) {
    if (piece.color === color) {
      const moves = calculatePossibleMoves(piece, position, positions);
      
      // Try each move
      for (const move of moves) {
        // Create a copy of positions with the attempted move
        const newPositions = { ...positions };
        delete newPositions[position];
        newPositions[move] = piece;

        // If this move gets us out of check, it's not checkmate
        if (!isInCheck(newPositions, color)) {
          return false;
        }
      }
    }
  }

  // If no moves get us out of check, it's checkmate
  return true;
}; 