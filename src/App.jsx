import React from 'react';
import ChessBoard from './components/ChessBoard';
import './App.css';
import { GameProvider } from './store/GameContext';
import GameStart from './components/GameStart';
import GameEnd from './components/GameEnd';
import { useGameState } from './store/GameContext';

const GameWrapper = () => {
  const { state, dispatch } = useGameState();
  const { gameStarted, winner, scores } = state;

  const handleGameStart = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleNewGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  if (!gameStarted) {
    return <GameStart onGameStart={handleGameStart} />;
  }

  return (
    <>
      <ChessBoard />
      {winner && (
        <GameEnd 
          winner={winner} 
          scores={scores} 
          onNewGame={handleNewGame} 
        />
      )}
    </>
  );
};

function App() {
  return (
    <GameProvider>
      <GameWrapper />
    </GameProvider>
  );
}

export default App; 