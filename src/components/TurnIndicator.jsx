import '../styles/TurnIndicator.css';

const TurnIndicator = ({ currentTurn }) => {
  return (
    <div className="turn-indicator">
      <div className={`player ${currentTurn === 'white' ? 'active' : ''}`}>
        White
      </div>
      <div className={`player ${currentTurn === 'black' ? 'active' : ''}`}>
        Black
      </div>
    </div>
  );
};

export default TurnIndicator; 