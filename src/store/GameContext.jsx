import { createContext, useContext, useReducer } from "react";
import { isInCheck, isInCheckmate } from "../utils/checkDetection";

const GameContext = createContext();

const initialState = {
  positions: {
    a1: { type: "rook", color: "white" },
    b1: { type: "night", color: "white" },
    c1: { type: "bishop", color: "white" },
    d1: { type: "queen", color: "white" },
    e1: { type: "king", color: "white" },
    f1: { type: "bishop", color: "white" },
    g1: { type: "night", color: "white" },
    h1: { type: "rook", color: "white" },
    a2: { type: "pawn", color: "white" },
    b2: { type: "pawn", color: "white" },
    c2: { type: "pawn", color: "white" },
    d2: { type: "pawn", color: "white" },
    e2: { type: "pawn", color: "white" },
    f2: { type: "pawn", color: "white" },
    g2: { type: "pawn", color: "white" },
    h2: { type: "pawn", color: "white" },
    a7: { type: "pawn", color: "black" },
    b7: { type: "pawn", color: "black" },
    c7: { type: "pawn", color: "black" },
    d7: { type: "pawn", color: "black" },
    e7: { type: "pawn", color: "black" },
    f7: { type: "pawn", color: "black" },
    g7: { type: "pawn", color: "black" },
    h7: { type: "pawn", color: "black" },
    a8: { type: "rook", color: "black" },
    b8: { type: "night", color: "black" },
    c8: { type: "bishop", color: "black" },
    d8: { type: "queen", color: "black" },
    e8: { type: "king", color: "black" },
    f8: { type: "bishop", color: "black" },
    g8: { type: "night", color: "black" },
    h8: { type: "rook", color: "black" },
  },
  currentTurn: "white",
  moveHistory: [],
  gameStatus: "active", // active, check, checkmate, stalemate
  check: null, // null, 'white', or 'black'
  checkmate: null, // null, 'white', or 'black'
};

// 3. We create rules for updating our information (like a manager)
const gameReducer = (state, action) => {
  // When someone wants to make a change, what should we do?
  switch (action.type) {
    // If someone wants to move a piece
    case "MOVE_PIECE":
      { const newState = {
        ...state,
        positions: action.newPositions,
        currentTurn: state.currentTurn === "white" ? "black" : "white",
        moveHistory: [
          ...state.moveHistory,
          {
            from: action.from,
            to: action.to,
            piece: action.piece,
          },
        ],
      };

      // Check for check/checkmate after move
      const opponentColor = state.currentTurn === "white" ? "black" : "white";
      if (isInCheck(opponentColor, action.newPositions)) {
        newState.check = opponentColor;
        if (isInCheckmate(opponentColor, action.newPositions)) {
          newState.checkmate = opponentColor;
          newState.gameStatus = "checkmate";
        }
      } else {
        newState.check = null;
      }

      return newState; }
    // If someone wants to update game status
    case "SET_GAME_STATUS":
      return {
        ...state,
        gameStatus: action.status,
      };

    default:
      return state;
  }
};
// 4. Create a provider (like a manager who handles all updates)
export const GameProvider = ({ children }) => {
  // useReducer gives us current state and a way to update it
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    // Make state and dispatch available to all children components
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// 5. Create a hook to easily access our state and dispatch
export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
};
