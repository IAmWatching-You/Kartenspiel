import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";

function App() {
  const [mode, setMode] = useState(null);

  return (
    <div>
      {mode === null ? (
        <StartScreen onStart={setMode} />
      ) : (
        <GameBoard mode={mode} />
      )}
    </div>
  );
}

export default App;
