import '../styles/GameEnd.css';

const GameEnd = ({ winner, scores, onNewGame }) => {
  return (
    <div className="game-end-overlay">
      <div className="game-end">
        <h2>{winner.toUpperCase()} Wins!</h2>
        <div className="scores">
          <div className={`score ${winner === 'white' ? 'winner' : ''}`}>
            <span className="player">White</span>
            <span className="points">{scores.white} points</span>
          </div>
          <div className={`score ${winner === 'black' ? 'winner' : ''}`}>
            <span className="player">Black</span>
            <span className="points">{scores.black} points</span>
          </div>
        </div>
        <button onClick={onNewGame} className="new-game-button">
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameEnd; 