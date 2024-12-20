import { useState } from 'react';
import '../styles/GameStart.css';

const GameStart = ({ onGameStart }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  const handleStart = () => {
    onGameStart({
      player1: {
        name: player1Name,
        color: 'white'
      },
      player2: {
        name: player2Name,
        color: 'black'
      }
    });
  };

  return (
    <div className="game-start">
      <h1>Chess Game</h1>
      
      <div className="game-options">
        <div className="option-group">
          <h3>White Player</h3>
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Enter name"
            maxLength={20}
          />
        </div>

        <div className="option-group">
          <h3>Black Player</h3>
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder="Enter name"
            maxLength={20}
          />
        </div>
      </div>

      <button onClick={handleStart} className="start-button">
        Start Game
      </button>
    </div>
  );
};

export default GameStart; 