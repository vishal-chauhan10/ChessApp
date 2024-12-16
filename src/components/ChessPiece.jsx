import '../styles/ChessPiece.css';

const ChessPiece = ({ type, color, position, isSelected }) => {
  const pieceId = `${color[0]}${type[0]}`;
  const pieceImage = `/src/assets/pieces/${pieceId}.png`;

  return (
    <div className={`chess-piece ${isSelected ? 'selected' : ''}`} data-position={position}>
      <img src={pieceImage} alt={`${color} ${type}`} />
    </div>
  );
};

export default ChessPiece;