import { useState } from "react";

export default function StartScreen({ onStart }) {
  const [showNameInputs, setShowNameInputs] = useState(false);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const handleLocalStart = () => {
    setShowNameInputs(true);
  };

  const handleStartGame = () => {
    if (player1.trim() && player2.trim()) {
      onStart({ mode: "local", player1, player2 });
    }
  };

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>Kartenspiel</h1>
        <p>Wähle deinen Spielmodus:</p>
        <div className="button-group">
          <button onClick={() => onStart({ mode: "bot-easy" })}>Gegen Bot (normal)</button>
          <button onClick={() => onStart({ mode: "bot-hard" })}>Gegen Bot (schwer)</button>
          <button onClick={handleLocalStart}>2 Spieler lokal</button>
        </div>
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
            <button onClick={handleStartGame} disabled={!player1.trim() || !player2.trim()}>
              Spiel starten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
