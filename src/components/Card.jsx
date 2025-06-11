export default function Card({ card }) {
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  return (
    <div className="card" style={{ 
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '0.5rem',
      margin: '0.25rem',
      minWidth: '2.5rem',
      minHeight: '3.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      cursor: 'pointer',
      userSelect: 'none'
    }}>
      {card ? (
        <div style={{ color: getColor(card.suit) }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{card.label}</div>
          <div style={{ fontSize: '1.5rem' }}>{getSuitSymbol(card.suit)}</div>
        </div>
      ) : (
        <div style={{ fontSize: '2rem', color: '#888' }}>🂠</div>
      )}
    </div>
  );
}
