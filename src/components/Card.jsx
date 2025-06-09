export default function Card({ card }) {
  return (
    <div className="card">
      {card ? (
        <>
          <div>{card.label}</div>
          <div>{card.suit}</div>
        </>
      ) : (
        <div>🂠</div>
      )}
    </div>
  );
}
