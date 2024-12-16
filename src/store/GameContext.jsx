import { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  positions: {
 a1: { type: 'rook', color: 'white' },
  b1: { type: 'night', color: 'white' },
  c1: { type: 'bishop', color: 'white' },
  d1: { type: 'queen', color: 'white' },
  e1: { type: 'king', color: 'white' },
  f1: { type: 'bishop', color: 'white' },
  g1: { type: 'night', color: 'white' },
  h1: { type: 'rook', color: 'white' },
  a2: { type: 'pawn', color: 'white' },
  b2: { type: 'pawn', color: 'white' },
  c2: { type: 'pawn', color: 'white' },
  d2: { type: 'pawn', color: 'white' },
  e2: { type: 'pawn', color: 'white' },
  f2: { type: 'pawn', color: 'white' },
  g2: { type: 'pawn', color: 'white' },
  h2: { type: 'pawn', color: 'white' },
  a7: { type: 'pawn', color: 'black' },
  b7: { type: 'pawn', color: 'black' },
  c7: { type: 'pawn', color: 'black' },
  d7: { type: 'pawn', color: 'black' },
  e7: { type: 'pawn', color: 'black' },
  f7: { type: 'pawn', color: 'black' },
  g7: { type: 'pawn', color: 'black' },
  h7: { type: 'pawn', color: 'black' },
  a8: { type: 'rook', color: 'black' },
  b8: { type: 'night', color: 'black' },
  c8: { type: 'bishop', color: 'black' },
  d8: { type: 'queen', color: 'black' },
  e8: { type: 'king', color: 'black' },
  f8: { type: 'bishop', color: 'black' },
  g8: { type: 'night', color: 'black' },
  h8: { type: 'rook', color: 'black' },
  },
  currentTurn: 'white',
  moveHistory: [],
  gameStatus: 'active', // active, check, checkmate, stalemate
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE_PIECE':
      return {
        ...state,
        positions: action.newPositions,
        currentTurn: state.currentTurn === 'white' ? 'black' : 'white',
        moveHistory: [...state.moveHistory, {
          from: action.from,
          to: action.to,
          piece: action.piece
        }]
      };
    
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.status
      };
      
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}; 