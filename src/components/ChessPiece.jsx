import '../styles/ChessPiece.css';

const ChessPiece = ({ type, color, position }) => {
  const pieceId = `${color[0]}${type[0]}`;
  const pieceImage = `/src/assets/pieces/${pieceId}.png`;

  const handleDragStart = (e) => {
    // Store both piece info and its current position
    //dataTransfer.setData() --> This is part of HTML5's Drag and Drop API.
    e.dataTransfer.setData('piece', JSON.stringify({ 
      type,      // e.g., 'pawn', 'rook', etc.
      color,     // 'white' or 'black'
      sourcePosition: position  // e.g., 'e2', 'a1', etc.
  }));
  };

  return (
    <div 
      className="chess-piece"
      draggable="true"
      onDragStart={handleDragStart}
    >
      <img src={pieceImage} alt={`${color} ${type}`} />
    </div>
  );
};

export default ChessPiece;