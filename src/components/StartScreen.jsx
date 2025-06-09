export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>Kartenspiel</h1>
        <p>Wähle deinen Spielmodus:</p>
        <div className="button-group">
          <button onClick={() => onStart("bot-easy")}>Gegen Bot (normal)</button>
          <button onClick={() => onStart("bot-hard")}>Gegen Bot (schwer)</button>
          <button onClick={() => onStart("local")}>2 Spieler lokal</button>
        </div>
      </div>
    </div>
  );
}
