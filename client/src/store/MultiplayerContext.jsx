import { createContext, useContext, useReducer, useEffect } from 'react';
import io from 'socket.io-client';

const MultiplayerContext = createContext();

const initialState = {
  socket: null,
  roomId: null,
  players: [],
  currentPlayer: null,
  opponent: null,
  isConnected: false,
  gameStatus: 'waiting', // waiting, playing, ended
  error: null,
  socketId: null,
  currentTurn: 'white'
};

function multiplayerReducer(state, action) {
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        socket: action.socket,
        isConnected: true,
        socketId: action.socket.id
      };

    case 'SET_ROOM':
      return {
        ...state,
        roomId: action.roomId,
        players: action.players,
        currentPlayer: action.players.find(p => p.id === state.socketId),
        error: null
      };

    case 'GAME_START':
      return {
        ...state,
        players: action.players,
        currentPlayer: action.players.find(p => p.id === state.socketId),
        opponent: action.players.find(p => p.id !== state.socketId),
        gameStatus: 'playing',
        currentTurn: 'white'
      };

    case 'PLAYER_DISCONNECTED':
      return {
        ...state,
        gameStatus: 'ended',
        error: 'Opponent disconnected'
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };

    case 'RESET':
      return {
        ...initialState,
        socket: state.socket,
        isConnected: state.isConnected,
        socketId: state.socketId
      };

    case 'MOVE_MADE':
      return {
        ...state,
        currentTurn: state.currentTurn === 'white' ? 'black' : 'white'
      };

    case 'OPPONENT_MOVE':
      return {
        ...state,
        currentTurn: state.currentPlayer?.color
      };

    default:
      return state;
  }
}

export function MultiplayerProvider({ children }) {
  const [state, dispatch] = useReducer(multiplayerReducer, initialState);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      dispatch({ type: 'CONNECT', socket });
    });

    socket.on('roomCreated', ({ roomId, players }) => {
      console.log('Room created:', { roomId, players });
      dispatch({ type: 'SET_ROOM', roomId, players });
    });

    socket.on('gameStart', ({ players }) => {
      console.log('Game starting:', { players });
      dispatch({ 
        type: 'GAME_START', 
        players,
        currentTurn: 'white' // Initialize first turn
      });
    });

    socket.on('joinError', ({ message }) => {
      console.log('Join error:', message);
      dispatch({ type: 'SET_ERROR', error: message });
    });

    socket.on('playerDisconnected', () => {
      console.log('Opponent disconnected');
      dispatch({ type: 'PLAYER_DISCONNECTED' });
    });

    socket.on('opponentMove', (move) => {
      console.log('Opponent move:', move);
      // Update game state
      dispatch({ type: 'OPPONENT_MOVE', move });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper functions to emit socket events
  const createRoom = (username) => {
    console.log('Creating room with username:', username);
    state.socket?.emit('createRoom', { username });
  };

  const joinRoom = (roomId, username) => {
    console.log('Joining room:', { roomId, username });
    state.socket?.emit('joinRoom', { roomId, username });
  };

  const makeMove = (move) => {
    console.log('Making move:', move);
    if (state.roomId) {
      state.socket?.emit('move', {
        roomId: state.roomId,
        move
      });
    }
  };

  const value = {
    state,
    dispatch,
    createRoom,
    joinRoom,
    makeMove
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
}

// Custom hook to use the multiplayer context
export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
}; 