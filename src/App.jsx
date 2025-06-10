import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";

function App() {
  const [gameConfig, setGameConfig] = useState(null);

  return (
    <div>
      {gameConfig === null ? (
        <StartScreen onStart={setGameConfig} />
      ) : (
        <GameBoard mode={gameConfig.mode} player1Name={gameConfig.player1} player2Name={gameConfig.player2} />
      )}
    </div>
  );
}

export default App;
