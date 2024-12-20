const socketHandler = (io) => {
  const gameRooms = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle room creation
    socket.on('createRoom', ({ username }) => {
      const roomId = generateRoomId();
      const player = {
        id: socket.id,
        username,
        color: 'white'
      };

      // Create new room
      gameRooms.set(roomId, {
        players: [player],
        gameState: null
      });

      // Join the room
      socket.join(roomId);
      
      console.log('Room created:', { roomId, player });
      console.log('Current rooms:', Array.from(gameRooms.keys()));
      
      // Emit back to the creator
      socket.emit('roomCreated', { 
        roomId, 
        players: [player],
        currentPlayer: player
      });
    });

    // Handle room joining
    socket.on('joinRoom', ({ roomId, username }) => {
      console.log('Join attempt:', { roomId, username });
      console.log('Available rooms:', Array.from(gameRooms.keys()));
      
      const room = gameRooms.get(roomId);
      
      if (!room) {
        console.log('Room not found:', roomId);
        socket.emit('joinError', { message: `Room ${roomId} not found. Please check the room ID.` });
        return;
      }

      if (room.players.length >= 2) {
        console.log('Room full:', roomId, 'Current players:', room.players);
        socket.emit('joinError', { message: 'Room is full' });
        return;
      }

      const newPlayer = {
        id: socket.id,
        username,
        color: 'black'
      };

      // Add player to room
      room.players.push(newPlayer);
      socket.join(roomId);

      console.log('Player joined successfully:', {
        roomId,
        players: room.players,
        joiningPlayer: newPlayer
      });

      // Notify all players in the room
      io.to(roomId).emit('gameStart', {
        players: room.players,
        roomId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Find and cleanup any rooms this player was in
      for (const [roomId, room] of gameRooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          if (room.players.length === 0) {
            console.log('Removing empty room:', roomId);
            gameRooms.delete(roomId);
          } else {
            console.log('Notifying remaining players in room:', roomId);
            io.to(roomId).emit('playerDisconnected');
          }
        }
      }
    });

    // Debug endpoint to list all rooms
    socket.on('listRooms', () => {
      const rooms = Array.from(gameRooms.entries()).map(([id, room]) => ({
        id,
        players: room.players
      }));
      socket.emit('roomsList', rooms);
    });

    // Handle move
    socket.on('move', ({ roomId, move }) => {
      const room = gameRooms.get(roomId);
      if (room) {
        // Update game state if needed
        room.gameState = {
          ...room.gameState,
          lastMove: move
        };
        
        // Broadcast move to opponent
        socket.to(roomId).emit('opponentMove', move);
      }
    });
  });
};

// Helper function to generate room IDs
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

module.exports = socketHandler; 