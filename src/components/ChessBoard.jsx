import React from 'react';
import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';

const initialPositions = {
  a1: { type: 'rook', color: 'white' },
  b1: { type: 'knight', color: 'white' },
  c1: { type: 'bishop', color: 'white' },
  d1: { type: 'queen', color: 'white' },
  e1: { type: 'king', color: 'white' },
  f1: { type: 'bishop', color: 'white' },
  g1: { type: 'knight', color: 'white' },
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
  b8: { type: 'knight', color: 'black' },
  c8: { type: 'bishop', color: 'black' },
  d8: { type: 'queen', color: 'black' },
  e8: { type: 'king', color: 'black' },
  f8: { type: 'bishop', color: 'black' },
  g8: { type: 'knight', color: 'black' },
  h8: { type: 'rook', color: 'black' },
};

const ChessBoard = () => {
  const renderSquare = (i, j) => {
    const isDark = (i + j) % 2 === 1;
    const position = `${String.fromCharCode(97 + j)}${8 - i}`;
    const piece = initialPositions[position];

    return (
      <div key={position} className={`square ${isDark ? 'dark' : 'light'}`}>
        {piece && <ChessPiece type={piece.type} color={piece.color} position={position} />}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        board.push(renderSquare(i, j));
      }
    }
    return board;
  };

  return <div className="chess-board">{renderBoard()}</div>;
};

export default ChessBoard; 