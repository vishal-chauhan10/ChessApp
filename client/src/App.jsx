import React from 'react';
import ChessBoard from './components/ChessBoard';
import './styles/App.css';
import { GameProvider } from './store/GameContext';
import { MultiplayerProvider } from './store/MultiplayerContext';
import MultiplayerLobby from './components/MultiplayerLobby';
import { useMultiplayer } from './store/MultiplayerContext';

const GameWrapper = () => {
  const { state } = useMultiplayer();
  
  // Show lobby until game starts
  if (state.gameStatus !== 'playing') {
    return <MultiplayerLobby />;
  }

  // Show chess board when game starts
  return (
    <div className="game-container">
      <ChessBoard />
      <div className="player-info">
        {state.currentPlayer && (
          <p>You are playing as: {state.currentPlayer.color}</p>
        )}
        <p>Current turn: {state.currentTurn}</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <MultiplayerProvider>
      <GameProvider>
        <GameWrapper />
      </GameProvider>
    </MultiplayerProvider>
  );
}

export default App; 