import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";
import GameManager from "./GameManager"; // Import GameManager

function App() {
  const [gameConfig, setGameConfig] = useState(null);
  const [gameManager, setGameManager] = useState(new GameManager()); // Initialize GameManager

  return (
    <div>
      {gameConfig === null ? (
        <StartScreen onStart={setGameConfig} />
      ) : (
        <GameBoard
          mode={gameConfig.mode}
          player1Name={gameConfig.player1}
          player2Name={gameConfig.player2}
          gameManager={gameManager} // Pass GameManager to GameBoard
        />
      )}
    </div>
  );
}

export default App;