import { pieceImages } from '../utils/pieceImages';
import '../styles/ChessPiece.css';

const ChessPiece = ({ type, color, position, isSelected }) => {
  return (
    <img
      src={pieceImages[color][type]}
      alt={`${color} ${type}`}
      className={`chess-piece ${isSelected ? 'selected' : ''}`}
      data-position={position}
    />
  );
};

export default ChessPiece;