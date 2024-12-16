import { useState } from 'react';
import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';
import TurnIndicator from './TurnIndicator';
import { isValidMove, calculatePossibleMoves } from './ChessPieceManager';

const initialPositions = {
  a1: { type: 'rook', color: 'white' },
  b1: { type: 'night', color: 'white' },
  c1: { type: 'bishop', color: 'white' },
  d1: { type: 'queen', color: 'white' },
  e1: { type: 'king', color: 'white' },
  f1: { type: 'bishop', color: 'white' },
  g1: { type: 'night', color: 'white' },
  h1: { type: 'rook', color: 'white' },
  a2: { type: 'pawn', color: 'white' },
  b2: { type: 'pawn', color: 'white' },
  c2: { type: 'pawn', color: 'white' },
  d2: { type: 'pawn', color: 'white' },
  e2: { type: 'pawn', color: 'white' },
  f2: { type: 'pawn', color: 'white' },
  g2: { type: 'pawn', color: 'white' },
  h2: { type: 'pawn', color: 'white' },
  a7: { type: 'pawn', color: 'black' },
  b7: { type: 'pawn', color: 'black' },
  c7: { type: 'pawn', color: 'black' },
  d7: { type: 'pawn', color: 'black' },
  e7: { type: 'pawn', color: 'black' },
  f7: { type: 'pawn', color: 'black' },
  g7: { type: 'pawn', color: 'black' },
  h7: { type: 'pawn', color: 'black' },
  a8: { type: 'rook', color: 'black' },
  b8: { type: 'night', color: 'black' },
  c8: { type: 'bishop', color: 'black' },
  d8: { type: 'queen', color: 'black' },
  e8: { type: 'king', color: 'black' },
  f8: { type: 'bishop', color: 'black' },
  g8: { type: 'night', color: 'black' },
  h8: { type: 'rook', color: 'black' },
};

const ChessBoard = () => {
  const [positions, setPositions] = useState(initialPositions);
  const [currentTurn, setCurrentTurn] = useState('white');
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

            // Wait for animation to complete before updating state
            setTimeout(() => {
              piece.classList.remove('moving');
              setPositions(prev => {
                const newPositions = { ...prev };
                delete newPositions[selectedPiece.position];
                newPositions[position] = {
                  type: selectedPiece.type,
                  color: selectedPiece.color
                };
                return newPositions;
              });
              setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
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
        console.log('Selecting piece:', piece);
        setSelectedPiece({ ...piece, position });
        
        // Calculate possible moves for this piece
        const moves = calculatePossibleMoves(piece, position, positions);
        console.log('Calculated moves:', moves);
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