import { useState } from 'react';
import '../styles/ChessBoard.css';
import ChessPiece from './ChessPiece';
import TurnIndicator from './TurnIndicator';
import { calculatePossibleMoves } from './ChessPieceManager';
import { useGameState } from '../store/GameContext';
import GameInfo from './GameInfo';

const ChessBoard = () => {
  const { state, dispatch } = useGameState();
  const { positions, currentTurn, check, checkmate, winner } = state;
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  const handleSquareClick = (position) => {
    if (checkmate || state.gameStatus === 'ended') return; // Prevent moves if game is over
    
    // SCENARIO 1: A piece is already selected
    if (selectedPiece) {
      // If clicked square is a valid move
      if (possibleMoves.includes(position)) {
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

            // Wait for animation to complete before updating state
            setTimeout(() => {
              piece.classList.remove('moving');
              dispatch({
                type: 'MOVE_PIECE',
                newPositions,
                from: selectedPiece.position,
                to: position,
                piece: selectedPiece,
                captured: capturedPiece,
                isKingCaptured
              });
            }, 300);
          }
        }
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else {
      // Only allow piece selection if game is still active
      if (state.gameStatus !== 'ended') {
        // If clicking on a piece
        const piece = positions[position];
        if (piece && piece.color === currentTurn) {
          setSelectedPiece({ ...piece, position });
          
          // Calculate possible moves for this piece
          const moves = calculatePossibleMoves(piece, position, positions);
          setPossibleMoves(moves);
        }
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
        players={state.players}
        scores={state.scores}
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
            Checkmate! {winner === 'white' ? state.players.player1.name : state.players.player2.name} wins!
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