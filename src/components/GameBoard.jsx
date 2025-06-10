import { useEffect, useState } from "react";
import { GameManager } from "../logic/GameManager";
import Card from "./Card";


export default function GameBoard({ mode, player1Name = "Player 1", player2Name = "Player 2" }) {
  const [game, setGame] = useState(() => new GameManager(mode));
  const [updateFlag, setUpdateFlag] = useState(false); // UI-Update trigger
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [showWinScreen, setShowWinScreen] = useState(false);

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
      if (game.winner) {
        setShowWinScreen(true);
        setTimeout(() => {
          setShowWinScreen(false);
          if (game.winner !== "draw") restartGame();
        }, 5000);
        return;
      }
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
    if (game.winner) {
      setShowWinScreen(true);
      setTimeout(() => {
        setShowWinScreen(false);
        if (game.winner !== "draw") restartGame();
      }, 5000);
      return;
    }
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
    setShowWinScreen(false);
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
      {showWinScreen && game.winner && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <h2 style={{ fontSize: 32 }}>{getWinnerText()}</h2>
        </div>
      )}
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
        {game.winner && !showWinScreen && (
          <>
            <h3>{getWinnerText()}</h3>
            <button onClick={restartGame}>Neues Spiel</button>
          </>
        )}
      </div>
    </div>
  );
}
