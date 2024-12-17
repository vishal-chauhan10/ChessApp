import { useState, useEffect, useMemo } from 'react';
import '../styles/GameInfo.css';
import wp from '../assets/pieces/wp.png';
import wn from '../assets/pieces/wn.png';
import wb from '../assets/pieces/wb.png';
import wr from '../assets/pieces/wr.png';
import wq from '../assets/pieces/wq.png';

const GameInfo = ({ players, scores, currentTurn, positions, check, checkmate, winner }) => {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  
  const pieceValues = {
    pawn: 1,
    night: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        const newSeconds = prevTime.seconds + 1;
        return {
          minutes: prevTime.minutes + Math.floor(newSeconds / 60),
          seconds: newSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateWinProbability = useMemo(() => {
    const pieceValues = {
      pawn: 1,
      night: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0
    };

    let whiteScore = 0;
    let blackScore = 0;

    // Calculate material advantage
    Object.values(positions).forEach(piece => {
      const value = pieceValues[piece.type];
      if (piece.color === 'white') {
        whiteScore += value;
      } else {
        blackScore += value;
      }
    });

    // Add position-based bonus (center control)
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    centerSquares.forEach(square => {
      const piece = positions[square];
      if (piece) {
        if (piece.color === 'white') {
          whiteScore += 0.5;
        } else {
          blackScore += 0.5;
        }
      }
    });

    // Add significant bonus for check
    if (check === 'black') whiteScore += 5;
    if (check === 'white') blackScore += 5;

    // If checkmate, give overwhelming advantage
    if (checkmate) {
      if (winner === 'white') {
        whiteScore += 50;
      } else {
        blackScore += 50;
      }
    }

    // Calculate probabilities
    const totalScore = whiteScore + blackScore;
    const whiteProbability = (whiteScore / totalScore) * 100;
    const blackProbability = (blackScore / totalScore) * 100;

    return {
      white: Math.round(whiteProbability),
      black: Math.round(blackProbability)
    };
  }, [positions, check, checkmate, winner]);

  return (
    <div className="game-info">
      <div className="player-info">
        <div className={`player ${currentTurn === 'white' ? 'active' : ''}`}>
          <h3>{players.player1.name}</h3>
          <div className="player-details">
            <span className="piece-color">White</span>
            <span className="score">Score: {scores.white}</span>
            <div className="win-probability">
              <div className="probability-bar">
                <div 
                  className="probability-fill"
                  style={{ width: `${calculateWinProbability.white}%` }}
                />
              </div>
              <span>{calculateWinProbability.white}% Win</span>
            </div>
          </div>
        </div>

        <div className="game-timer">
          {String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>

        <div className={`player ${currentTurn === 'black' ? 'active' : ''}`}>
          <h3>{players.player2.name}</h3>
          <div className="player-details">
            <span className="piece-color">Black</span>
            <span className="score">Score: {scores.black}</span>
            <div className="win-probability">
              <div className="probability-bar">
                <div 
                  className="probability-fill"
                  style={{ width: `${calculateWinProbability.black}%` }}
                />
              </div>
              <span>{calculateWinProbability.black}% Win</span>
            </div>
          </div>
        </div>

        <div className="piece-values">
          <h4>Piece Values</h4>
          <div className="values-grid">
            <div className="value-item">
              <img src={wp} alt="Pawn" />
              <span>1</span>
            </div>
            <div className="value-item">
              <img src={wn} alt="Knight" />
              <span>3</span>
            </div>
            <div className="value-item">
              <img src={wb} alt="Bishop" />
              <span>3</span>
            </div>
            <div className="value-item">
              <img src={wr} alt="Rook" />
              <span>5</span>
            </div>
            <div className="value-item">
              <img src={wq} alt="Queen" />
              <span>9</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo; 