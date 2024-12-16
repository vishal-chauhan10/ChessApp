import '../styles/ChessPiece.css';

const ChessPiece = ({ type, color }) => {
  // This line creates the image filename
  const pieceId = `${color[0]}${type[0]}`; // Takes first letter of color and type
  
  // Examples of how pieceId is created:
  // For a white king:   color[0] = 'w', type[0] = 'k' => 'wk'
  // For a black pawn:   color[0] = 'b', type[0] = 'p' => 'bp'
  // For a white queen:  color[0] = 'w', type[0] = 'q' => 'wq'
  
  const pieceImage = `/src/assets/pieces/${pieceId}.png`;

  return (
    <div className="chess-piece">
      <img src={pieceImage} alt={`${color} ${type}`} />
    </div>
  );
};

export default ChessPiece;