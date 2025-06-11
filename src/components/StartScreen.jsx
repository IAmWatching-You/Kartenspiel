import { useState } from "react";

export default function StartScreen({ onStart }) {
  const [showNameInputs, setShowNameInputs] = useState(false);
  const [showBotNameInput, setShowBotNameInput] = useState(false);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [botMode, setBotMode] = useState(null);

  const handleLocalStart = () => {
    setShowNameInputs(true);
    setShowBotNameInput(false);
    setBotMode(null);
    // Namen zurücksetzen beim Moduswechsel
    setPlayer1("");
    setPlayer2("");
  };

  const handleBotStart = (mode) => {
    setShowBotNameInput(true);
    setShowNameInputs(false);
    setBotMode(mode);
    // Namen zurücksetzen beim Moduswechsel
    setPlayer1("");
    setPlayer2("Bot");
  };

  const handleStartGame = () => {
    if (!onStart) return;
    
    if (showNameInputs && player1.trim() && player2.trim()) {
      onStart({ 
        mode: "local", 
        player1: player1.trim(), 
        player2: player2.trim() 
      });
    } else if (showBotNameInput && player1.trim() && botMode) {
      onStart({ 
        mode: botMode, 
        player1: player1.trim(), 
        player2: "Bot" 
      });
    }
  };

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>Kartenspiel</h1>
        <p>Wähle deinen Spielmodus:</p>
        <div className="button-group">
          <button onClick={() => handleBotStart("bot-easy")}>Gegen Bot (normal)</button>
          <button onClick={() => handleBotStart("bot-hard")}>Gegen Bot (schwer)</button>
          <button onClick={handleLocalStart}>2 Spieler lokal</button>
        </div>
        
        {showBotNameInput && (
          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Dein Name"
              value={player1}
              onChange={e => setPlayer1(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <input
              type="text"
              value="Bot"
              disabled
              style={{ marginRight: 8, background: '#eee' }}
            />
            <button 
              onClick={handleStartGame} 
              disabled={!player1.trim()}
              style={{ 
                padding: '8px 16px',
                backgroundColor: player1.trim() ? '#4CAF50' : '#ccc'
              }}
            >
              Spiel starten
            </button>
          </div>
        )}

        {showNameInputs && (
          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Name Spieler 1"
              value={player1}
              onChange={e => setPlayer1(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <input
              type="text"
              placeholder="Name Spieler 2"
              value={player2}
              onChange={e => setPlayer2(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <button 
              onClick={handleStartGame} 
              disabled={!player1.trim() || !player2.trim()}
              style={{ 
                padding: '8px 16px',
                backgroundColor: (player1.trim() && player2.trim()) ? '#4CAF50' : '#ccc'
              }}
            >
              Spiel starten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
