import { useEffect, useState, useCallback } from "react";
import { GameManager } from "../logic/GameManager";
import Card from "./Card";

const WinScreen = ({ text, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{text}</h2>
    </div>
  </div>
);

export default function GameBoard({ mode = "local", player1Name = "Player 1", player2Name = "Player 2" }) {
  const [game, setGame] = useState(() => {
    try {
      return new GameManager(mode);
    } catch (error) {
      console.error('Failed to initialize GameManager:', error);
      return new GameManager('local');
    }
  });
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [showRoundWinScreen, setShowRoundWinScreen] = useState(false);
  const [showGameWinScreen, setShowGameWinScreen] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [botThinking, setBotThinking] = useState(false);

  const isBotMode = mode?.startsWith("bot") || false;

  // Sicherheitscheck für game.hands
  const gameHands = game?.hands || {};
  
  // Im Bot-Modus IMMER die Hand von player1 (Mensch) anzeigen
  const hand = isBotMode ? gameHands["player1"] : gameHands[game?.currentPlayer];
  const isHumanTurn = !isBotMode || game?.currentPlayer === "player1";
  
  // Für Kartenanzahl-Anzeige
  const otherKey = isBotMode ? "player2" : (game?.currentPlayer === "player1" ? "player2" : "player1");
  const otherHandCount = gameHands[otherKey]?.length || 0;

  const getPlayerName = (key) => {
    if (isBotMode) {
      return key === "player1" ? player1Name : "Bot";
    }
    return key === "player1" ? player1Name : player2Name;
  };

  const getWinnerText = () => {
    if (game.winner === "draw") {
      return "Unentschieden! Beide bekommen einen Punkt.";
    }
    const winnerName = getPlayerName(game.winner);
    return `${winnerName} hat ${game.winner === "player1" ? "gewonnen" : "verloren"}!`;
  };

  const updateGame = useCallback((newGame) => {
    setGame(prevGame => ({
      ...prevGame,
      ...newGame
    }));
  }, []);

  const restartGame = useCallback(() => {
    setGame(new GameManager(mode));
    setSelectedCardIndex(null);
    setMessage("");
    setShowWinScreen(false);
    setBotThinking(false);
  }, [mode]);

  // Bot-Logik
  useEffect(() => {
    let botTimer;
    const executeBotMove = async () => {
      if (!isBotMode || game.currentPlayer !== "player2" || game.winner || botThinking) {
        return;
      }

      setBotThinking(true);
      
      try {
        // Erste Aktion (Karte spielen oder ziehen)
        await new Promise(resolve => {
          botTimer = setTimeout(() => {
            setGame(prevGame => {
              const updatedGame = new GameManager(mode);
              Object.assign(updatedGame, prevGame);
              updatedGame.botPlay();
              return updatedGame;
            });
            resolve();
          }, 1000);
        });

        // Wenn der Bot nach dem Ziehen spielen kann, warte und spiele
        if (game.currentPlayer === "player2" && !game.winner) {
          await new Promise(resolve => {
            botTimer = setTimeout(() => {
              setGame(prevGame => {
                const updatedGame = new GameManager(mode);
                Object.assign(updatedGame, prevGame);
                updatedGame.botPlay();
                return updatedGame;
              });
              resolve();
            }, 1000);
          });
        }
      } finally {
        setBotThinking(false);
      }
    };

    if (isBotMode && game.currentPlayer === "player2" && !game.winner && !botThinking) {
      executeBotMove();
    }

    return () => {
      if (botTimer) clearTimeout(botTimer);
    };
  }, [game.currentPlayer, game.winner, isBotMode, botThinking, mode]);

  const playSelectedCard = useCallback(() => {
    if (!isHumanTurn) {
      setMessage("Warte bis du an der Reihe bist!");
      return;
    }

    setMessage("");
    if (selectedCardIndex === null) {
      setMessage("Bitte wähle zuerst eine Karte aus.");
      return;
    }

    setGame(prevGame => {
      const updatedGame = new GameManager(mode);
      Object.assign(updatedGame, prevGame);
      
      const prevRounds = { ...updatedGame.rounds };
      const success = updatedGame.playCard(selectedCardIndex);
      
      if (success) {
        setSelectedCardIndex(null);
        const roundWon = (updatedGame.rounds.player1 > prevRounds.player1) || 
                        (updatedGame.rounds.player2 > prevRounds.player2);
                        
        if (updatedGame.winner || roundWon) {
          setShowWinScreen(true);
          setTimeout(() => {
            setShowWinScreen(false);
            if (updatedGame.winner) restartGame();
          }, 3000);
        }
        return updatedGame;
      } else {
        setMessage("Diese Karte kann nicht gespielt werden.");
        return prevGame;
      }
    });
  }, [isHumanTurn, selectedCardIndex, mode, restartGame]);

  const drawCard = useCallback(() => {
    if (!isHumanTurn) {
      setMessage("Warte bis du an der Reihe bist!");
      return;
    }

    setMessage("");

    setGame(prevGame => {
      const updatedGame = new GameManager(mode);
      Object.assign(updatedGame, prevGame);

      if (updatedGame.deck.length === 0) {
        setMessage("Der Nachziehstapel ist leer.");
        return prevGame;
      }
      if (updatedGame.hands[updatedGame.currentPlayer].length >= 5) {
        setMessage("Du hast bereits 5 Karten auf der Hand.");
        return prevGame;
      }

      const prevRounds = { ...updatedGame.rounds };
      updatedGame.drawCard();
      
      const roundWon = (updatedGame.rounds.player1 > prevRounds.player1) || 
                      (updatedGame.rounds.player2 > prevRounds.player2);
                      
      if (updatedGame.winner || roundWon) {
        setShowWinScreen(true);
        setTimeout(() => {
          setShowWinScreen(false);
          if (updatedGame.winner) restartGame();
        }, 3000);
      }
      
      return updatedGame;
    });
  }, [isHumanTurn, mode, restartGame]);

  useEffect(() => {
    const checkWinCondition = () => {
      // Prüfe auf Spielende
      if (game.winner) {
        setShowGameWinScreen(true);
        setTimeout(() => {
          setShowGameWinScreen(false);
          restartGame();
        }, 5000);
        return;
      }

      // Prüfe auf Rundenende (wenn sich die Punktzahl geändert hat)
      const totalPoints = game.rounds.player1 + game.rounds.player2;
      if (totalPoints > 0 && !showRoundWinScreen) {
        let winner;
        if (game.rounds.player1 > game.rounds.player2) {
          winner = "player1";
        } else if (game.rounds.player2 > game.rounds.player1) {
          winner = "player2";
        } else {
          winner = "draw";
        }
        setRoundWinner(winner);
        setShowRoundWinScreen(true);
        setTimeout(() => {
          setShowRoundWinScreen(false);
          setRoundWinner(null);
        }, 5000);
      }
    };

    checkWinCondition();
  }, [game.rounds.player1, game.rounds.player2, game.winner, restartGame]);

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
      <p>{getPlayerName(otherKey)} hat noch {otherHandCount} Karten.</p>
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

      {showRoundWinScreen && (
        <WinScreen 
          text={roundWinner === "draw" 
            ? "Unentschieden! Beide Spieler bekommen einen Punkt!" 
            : `${getPlayerName(roundWinner)} gewinnt die Runde!`}
        />
      )}
      {showGameWinScreen && (
        <WinScreen 
          text={game.winner === "draw"
            ? "Unentschieden! Das Spiel endet ohne Sieger!"
            : `${getPlayerName(game.winner)} gewinnt das Spiel!`}
        />
      )}
    </div>
  );
}
