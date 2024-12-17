import '../styles/GameStart.css';

const GameStart = ({ onGameStart }) => {
  return (
    <div className="game-start">
      <h1>Chess Game</h1>
      <button onClick={onGameStart} className="start-button">
        Start New Game
      </button>
    </div>
  );
};

export default GameStart; 