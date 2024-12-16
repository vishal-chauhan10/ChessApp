# Chess App

A modern chess application built with React, featuring smooth animations and intuitive gameplay.

## Features

### Game Mechanics
- Complete chess piece movement validation
- Turn-based gameplay
- Legal move highlighting
- Piece capture system

### User Interface
- Interactive chessboard
- Visual move indicators
- Active player display
- Smooth piece animations

## Technical Stack
- React 18
- CSS3 Animations
- React Context for state management
- Vite for build tooling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
- Clone the repository
- git clone [your-repo-url]
- Install dependencies
- npm install
- Start development server
- npm run dev

### Usage
1. Click on a piece to see valid moves
2. Click on highlighted square to move
3. Game alternates between white and black turns

## Project Structure
├── components/ # React components
│ ├── ChessBoard.jsx # Main board component
│ ├── ChessPiece.jsx # Individual piece component
│ └── TurnIndicator.jsx # Player turn display
├── store/
│ └── GameContext.jsx # Game state management
├── styles/
│ ├── ChessBoard.css # Board styling
│ ├── ChessPiece.css # Piece styling
│ └── TurnIndicator.css # Turn display styling
└── assets/
└── pieces/ # Chess piece images


## Features in Detail

### Move Validation
- Piece-specific movement rules
- Path obstruction detection
- Capture validation
- Turn enforcement

### Visual Feedback
- Green dots for valid moves
- Red borders for capturable pieces
- Piece selection highlighting
- Smooth movement animations

### State Management
- Centralized game state using Context
- Move history tracking
- Turn management
- Game status tracking

## Future Enhancements
- Check/Checkmate detection
- Special moves (castling, en passant)
- Move history display
- Game save/load functionality
- Player statistics
- Online multiplayer support

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
MIT