import { useEffect, useState } from "react";
import { GameManager } from "../logic/GameManager";
import Card from "./Card";


export default function GameBoard({ mode, player1Name = "Player 1", player2Name = "Player 2" }) {
  const [game, setGame] = useState(() => new GameManager(mode));
  const [updateFlag, setUpdateFlag] = useState(false); // UI-Update trigger
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [message, setMessage] = useState("");

  const triggerUpdate = () => setUpdateFlag(prev => !prev);

  const playSelectedCard = () => {
    setMessage("");
    if (selectedCardIndex === null) {
      setMessage("Bitte wähle zuerst eine Karte aus.");
      return;
    }
    const success = game.playCard(selectedCardIndex);
    if (success) {
      setSelectedCardIndex(null);
      if (mode.startsWith("bot") && game.currentPlayer === "player2") {
        setTimeout(() => {
          game.botPlay(game.hands.player1);
          triggerUpdate();
        }, 500);
      }
    } else {
      setMessage("Diese Karte kann nicht gespielt werden.");
    }
    triggerUpdate();
  };

  const drawCard = () => {
    setMessage("");
    if (game.deck.length === 0) {
      setMessage("Der Nachziehstapel ist leer.");
      return;
    }
    if (game.hands[game.currentPlayer].length >= 5) {
      setMessage("Du hast bereits 5 Karten auf der Hand.");
      return;
    }
    game.drawCard();
    if (mode.startsWith("bot") && game.currentPlayer === "player2") {
      setTimeout(() => {
        game.botPlay(game.hands.player1);
        triggerUpdate();
      }, 500);
    }
    triggerUpdate();
  };

  const restartGame = () => {
    const newGame = new GameManager(mode);
    setGame(newGame);
    setSelectedCardIndex(null);
    setMessage("");
    triggerUpdate();
  };

  useEffect(() => {
    if (mode.startsWith("bot") && game.currentPlayer === "player2") {
      game.botPlay(game.hands.player1);
      triggerUpdate();
    }
  }, []);

  const hand = game.hands[game.currentPlayer];
  const isHumanTurn = mode === "local" || (mode.startsWith("bot") && game.currentPlayer === "player1");
  const getPlayerName = (key) => {
    if (mode === "local") {
      return key === "player1" ? player1Name : player2Name;
    }
    return key === "player1" ? "Player 1" : "Player 2";
  };
  const getWinnerText = () => {
    if (game.winner === "draw") {
      return "Unentschieden! Beide bekommen einen Punkt.";
    }
    return `${getPlayerName(game.winner)} hat das Spiel gewonnen!`;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Modus: {mode}</h2>
      <p>Aktueller Spieler: {getPlayerName(game.currentPlayer)}</p>
      <p>Ablagekarte:</p>
      <Card card={game.topCard} />
      <h3>Deine Hand:</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {hand.map((card, i) => (
          <div
            key={i}
            onClick={() => isHumanTurn && setSelectedCardIndex(i)}
            style={{
              cursor: isHumanTurn ? "pointer" : "default",
              border: selectedCardIndex === i ? "2px solid blue" : "none",
            }}
          >
            <Card card={card} />
          </div>
        ))}
      </div>

      {message && (
        <div style={{ color: "red", marginTop: "1rem" }}>{message}</div>
      )}

      {isHumanTurn && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={playSelectedCard}>Karte spielen</button>
          <button onClick={drawCard}>Karte ziehen</button>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <p>Spielstand:</p>
        <p>{getPlayerName("player1")}: {game.rounds.player1} | {getPlayerName("player2")}: {game.rounds.player2}</p>
        {game.winner && (
          <>
            <h3>{getWinnerText()}</h3>
            <button onClick={restartGame}>Neues Spiel</button>
          </>
        )}
      </div>
    </div>
  );
}
