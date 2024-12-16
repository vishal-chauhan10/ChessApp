import React from 'react';
import ChessBoard from './components/ChessBoard';
import './App.css';
import { GameProvider } from './store/GameContext';

function App() {
  return (
    <GameProvider>
      <ChessBoard />
    </GameProvider>
  );
}

export default App; 