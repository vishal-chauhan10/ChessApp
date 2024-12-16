import React from 'react';

const ChessPiece = ({ type, color, position }) => {
  const pieceSrc = `${process.env.PUBLIC_URL}/assets/pieces/${color[0]}${type[0]}.png`;

  return (
    <img
      src={pieceSrc}
      alt={`${color} ${type}`}
      className="chess-piece"
      draggable="true"
      style={{ gridArea: position }}
    />
  );
};

export default ChessPiece; 