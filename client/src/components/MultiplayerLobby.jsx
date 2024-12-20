import { useState, useEffect, useRef } from 'react';
import { useMultiplayer } from '../store/MultiplayerContext';
import '../styles/MultiplayerLobby.css';

const MultiplayerLobby = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const { state, createRoom, joinRoom } = useMultiplayer();
  const roomIdRef = useRef(null);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!username) {
      alert('Please enter a username');
      return;
    }
    createRoom(username);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!username || !roomId) {
      alert('Please enter both username and room ID');
      return;
    }
    joinRoom(roomId.trim(), username);
  };

  const copyRoomId = () => {
    if (roomIdRef.current) {
      roomIdRef.current.select();
      document.execCommand('copy');
      alert('Room ID copied to clipboard!');
    }
  };

  return (
    <div className="multiplayer-lobby">
      <h2>Chess Multiplayer</h2>
      <div className="lobby-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <div className="room-actions">
          <button 
            onClick={handleCreateRoom}
            disabled={!username}
          >
            Create Room
          </button>
          
          <div className="join-room">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button 
              onClick={handleJoinRoom}
              disabled={!username || !roomId}
            >
              Join Room
            </button>
          </div>
        </div>

        {state.error && (
          <div className="error">Error: {state.error}</div>
        )}
        
        {state.roomId && (
          <div className="room-info">
            <div className="room-id-container">
              <input
                ref={roomIdRef}
                type="text"
                value={state.roomId}
                readOnly
                className="room-id-display"
              />
              <button onClick={copyRoomId} className="copy-button">
                Copy ID
              </button>
            </div>
            <p className="instruction">Share this ID with your opponent</p>
            <div className="status-info">
              <p>Connection: {state.isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
              <p>Game status: {state.gameStatus}</p>
              {state.currentPlayer && (
                <p>You are: {state.currentPlayer.color}</p>
              )}
              <p>Players: {state.players.length}/2</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerLobby; 