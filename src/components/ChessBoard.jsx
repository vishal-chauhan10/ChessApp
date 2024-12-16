import { useState } from 'react';
import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';
import TurnIndicator from './TurnIndicator';
import { isValidMove, calculatePossibleMoves } from './ChessPieceManager';
import { useGameState } from '../store/GameContext';

const ChessBoard = () => {
  const { state, dispatch } = useGameState();
  const { positions, currentTurn } = state;
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  const handleSquareClick = (position) => {
    if (selectedPiece) {
      if (possibleMoves.includes(position)) {
        const piece = document.querySelector(
          `.chess-piece[data-position="${selectedPiece.position}"]`
        );
        
        if (piece) {
          // Get the source and target squares
          const fromSquare = document.querySelector(
            `.square[data-position="${selectedPiece.position}"]`
          );
          const toSquare = document.querySelector(
            `.square[data-position="${position}"]`
          );

          if (fromSquare && toSquare) {
            // Calculate the difference in positions
            const fromRect = fromSquare.getBoundingClientRect();
            const toRect = toSquare.getBoundingClientRect();
            const xDiff = toRect.left - fromRect.left;
            const yDiff = toRect.top - fromRect.top;

            // Set the CSS variables for the animation
            piece.style.setProperty('--targetX', `${xDiff}px`);
            piece.style.setProperty('--targetY', `${yDiff}px`);
            
            // Add the moving class to trigger animation
            piece.classList.add('moving');

            // Create new positions object
            const newPositions = { ...positions };
            delete newPositions[selectedPiece.position];
            newPositions[position] = {
              type: selectedPiece.type,
              color: selectedPiece.color
            };

            // Wait for animation to complete before updating state
            setTimeout(() => {
              piece.classList.remove('moving');
              dispatch({
                type: 'MOVE_PIECE',
                newPositions: newPositions,
                from: selectedPiece.position,
                to: position,
                piece: selectedPiece
              });
            });
          }
        }
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else {
      // If clicking on a piece
      const piece = positions[position];
      if (piece && piece.color === currentTurn) {
        setSelectedPiece({ ...piece, position });
        
        // Calculate possible moves for this piece
        const moves = calculatePossibleMoves(piece, position, positions);
        setPossibleMoves(moves);
      }
    }
  };

  const renderSquare = (position, isDark, piece) => (
    <div 
      key={position} 
      data-position={position}
      className={`square ${isDark ? 'dark' : 'light'} ${
        possibleMoves.includes(position) ? 
          positions[position] ? 'highlighted capture' : 'highlighted' 
          : ''
      }`}
      onClick={() => handleSquareClick(position)}
    >
      {piece && <ChessPiece 
        type={piece.type} 
        color={piece.color} 
        position={position}
        isSelected={selectedPiece?.position === position}
        data-position={position}
      />}
    </div>
  );

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const position = `${String.fromCharCode(97 + j)}${8 - i}`;
        const isDark = (i + j) % 2 === 1;
        const piece = positions[position];
        board.push(renderSquare(position, isDark, piece));
      }
    }
    return board;
  };

  return (
    <div className="chess-container">
      <TurnIndicator currentTurn={currentTurn} />
      <div className="chess-board">{renderBoard()}</div>
    </div>
  );
};

export default ChessBoard;