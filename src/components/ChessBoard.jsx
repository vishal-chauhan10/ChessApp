import { useState } from 'react';
import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';
import { isValidMove } from './ChessPieceManager';

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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    
    try {
      const { type, color, sourcePosition } = JSON.parse(e.dataTransfer.getData('piece'));
      
      // Don't do anything if dropping on the same square
      if (sourcePosition === targetPosition) return;

      // Check if it's the correct player's turn
      if (color !== currentTurn) {
        console.log("Not your turn!");
        return;
      }

      // Check if the move is valid
      const piece = { type, color };
      if (!isValidMove(piece, sourcePosition, targetPosition, positions)) {
        console.log("Invalid move!");
        return;
      }

      setPositions(prevPositions => {
        const newPositions = { ...prevPositions };
        delete newPositions[sourcePosition];
        newPositions[targetPosition] = { type, color };
        return newPositions;
      });

      // Switch turns
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
    } catch (error) {
      console.error('Error handling piece drop:', error);
    }
  };

  const renderSquare = (position, isDark, piece) => (
    <div 
      key={position} 
      className={`square ${isDark ? 'dark' : 'light'}`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, position)}
    >
      {piece && <ChessPiece 
        type={piece.type} 
        color={piece.color} 
        position={position}  // Pass the position to ChessPiece
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

  return <div className="chess-board">{renderBoard()}</div>;
};

export default ChessBoard;