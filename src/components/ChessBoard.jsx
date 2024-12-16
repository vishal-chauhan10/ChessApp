import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';

const initialPositions = {
  // ...existing code...
};

const ChessBoard = () => {
  const renderSquare = (position, isDark, piece) => (
    <div key={position} className={`square ${isDark ? 'dark' : 'light'}`}>
      {piece && <ChessPiece type={piece.type} color={piece.color} position={position} />}
    </div>
  );

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const position = `${String.fromCharCode(97 + j)}${8 - i}`;
        const isDark = (i + j) % 2 === 1;
        const piece = initialPositions[position];
        board.push(renderSquare(position, isDark, piece));
      }
    }
    return board;
  };

  return <div className="chess-board">{renderBoard()}</div>;
};

export default ChessBoard;