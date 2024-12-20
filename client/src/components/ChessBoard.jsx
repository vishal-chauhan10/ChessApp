import { useState } from 'react';
import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';
import TurnIndicator from './TurnIndicator';
import { calculatePossibleMoves } from './ChessPieceManager';
import { useGameState } from '../store/GameContext';
import GameInfo from './GameInfo';
import { useMultiplayer } from '../store/MultiplayerContext';

const ChessBoard = () => {
  const { state: gameState, dispatch } = useGameState();
  const { state: multiplayerState, makeMove } = useMultiplayer();
  const { positions, currentTurn, check, checkmate, winner } = gameState;
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  const handleSquareClick = (position) => {
    if (checkmate || gameState.gameStatus === 'ended') return;
    
    // Only allow moves on player's turn
    if (currentTurn !== multiplayerState.currentPlayer?.color) {
      console.log("Not your turn!", { currentTurn, playerColor: multiplayerState.currentPlayer?.color });
      return;
    }

    if (selectedPiece) {
      if (possibleMoves.includes(position)) {
        // Create new positions object
        const newPositions = { ...positions };
        const capturedPiece = positions[position];  // Get the captured piece if any
        delete newPositions[selectedPiece.position];
        newPositions[position] = {
          type: selectedPiece.type,
          color: selectedPiece.color
        };

        // Check if king is captured
        const isKingCaptured = capturedPiece?.type === 'king';

        // Animation Logic
        const piece = document.querySelector(
          `.chess-piece[data-position="${selectedPiece.position}"]`
        );
        
        if (piece) {
          // Find start and end squares
          const fromSquare = document.querySelector(
            `.square[data-position="${selectedPiece.position}"]`
          );
          const toSquare = document.querySelector(
            `.square[data-position="${position}"]`
          );

          if (fromSquare && toSquare) {
            // Calculate the difference in positions
            const fromRect = fromSquare.getBoundingClientRect();
            const toRect = toSquare.getBoundingClientRect();
            const xDiff = toRect.left - fromRect.left;
            const yDiff = toRect.top - fromRect.top;

            // Set the CSS variables for the animation
            piece.style.setProperty('--targetX', `${xDiff}px`);
            piece.style.setProperty('--targetY', `${yDiff}px`);
            
            // Add the moving class to trigger animation
            piece.classList.add('moving');

            // Wait for animation to complete before updating state
            setTimeout(() => {
              piece.classList.remove('moving');
              
              // Update local game state
              dispatch({
                type: 'MOVE_PIECE',
                newPositions,
                from: selectedPiece.position,
                to: position,
                piece: selectedPiece,
                captured: capturedPiece,
                isKingCaptured
              });

              // Send move to opponent
              makeMove({
                from: selectedPiece.position,
                to: position,
                piece: selectedPiece,
                newPositions
              });
            }, 300);
          }
        }
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else {
      const piece = positions[position];
      if (piece && piece.color === multiplayerState.currentPlayer?.color) {
        setSelectedPiece({ ...piece, position });
        const moves = calculatePossibleMoves(piece, position, positions);
        setPossibleMoves(moves);
      }
    }
  };

  const renderSquare = (position, isDark, piece) => (
    <div 
      key={position} 
      data-position={position}
      className={`square ${isDark ? 'dark' : 'light'} ${
        possibleMoves.includes(position) ? 
          positions[position] ? 'highlighted capture' : 'highlighted' 
          : ''
      }`}
      onClick={() => handleSquareClick(position)}
    >
      {piece && <ChessPiece 
        type={piece.type} 
        color={piece.color} 
        position={position}
        isSelected={selectedPiece?.position === position}
        data-position={position}
      />}
    </div>
  );

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const position = `${String.fromCharCode(97 + j)}${8 - i}`;
        const isDark = (i + j) % 2 === 1;
        const piece = positions[position];
        board.push(renderSquare(position, isDark, piece));
      }
    }
    return board;
  };

  return (
    <div className="chess-container">
      <GameInfo 
        players={gameState.players}
        scores={gameState.scores}
        currentTurn={currentTurn}
        positions={positions}
        check={check}
        checkmate={checkmate}
        winner={winner}
      />
      <div className="game-main">
        <TurnIndicator currentTurn={currentTurn} />
        {check && !checkmate && (
          <div className="check-indicator">
            {check.toUpperCase()} is in check!
          </div>
        )}
        {checkmate && (
          <div className="checkmate-indicator">
            Checkmate! {winner === 'white' ? gameState.players.player1.name : gameState.players.player2.name} wins!
          </div>
        )}
        <div className={`chess-board ${checkmate ? 'checkmate' : ''}`}>
          {renderBoard()}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;