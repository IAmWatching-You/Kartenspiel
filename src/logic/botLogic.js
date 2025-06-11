// Bot-Logik für verschiedene Schwierigkeitsgrade
export function botPlayEasy(botHand, topCard) {
  // Im Easy-Modus spielt der Bot einfach die erste spielbare Karte
  return botHand.find(card => isPlayable(card, topCard));
}

export function botPlayHard(botHand, topCard, opponentHand) {
  const playable = botHand.filter(card => isPlayable(card, topCard));
  if (playable.length === 0) return null;

  // Im Hard-Modus spielt der Bot strategischer:
  
  // 1. Wenn der Gegner nur noch eine Karte hat und wir eine hohe Karte haben, diese spielen
  if (opponentHand.length === 1) {
    const highCards = playable.filter(card => card.value >= 10);
    if (highCards.length > 0) {
      return highCards.reduce((highest, current) => 
        current.value > highest.value ? current : highest
      , highCards[0]);
    }
  }

  // 2. Wenn möglich, spiele die höchste Karte der gleichen Farbe
  const sameSuit = playable.filter(card => card.suit === topCard.suit);
  if (sameSuit.length > 0) {
    // Wenn wir mehrere Karten der gleichen Farbe haben, spiele die zweithöchste
    // um noch eine höhere Karte für später zu behalten
    if (sameSuit.length > 1) {
      const sorted = sameSuit.sort((a, b) => b.value - a.value);
      return sorted[1];
    }
    return sameSuit[0];
  }

  // 3. Wenn der Gegner viele Karten hat (4-5), spiele eine niedrige Karte
  if (opponentHand.length >= 4) {
    const otherSuits = playable.filter(card => card.suit !== topCard.suit);
    if (otherSuits.length > 0) {
      return otherSuits.reduce((lowest, current) => 
        current.value < lowest.value ? current : lowest
      , otherSuits[0]);
    }
  }

  // 4. Ansonsten spiele die höchste verfügbare Karte
  return playable.reduce((highest, current) => 
    current.value > highest.value ? current : highest
  , playable[0]);
}

function isPlayable(card, topCard) {
  // Ass als 14 werten, wenn auf König gelegt wird
  const topValue = (topCard.label === "K" && card.label === "A") ? 14 : topCard.value;
  const cardValue = (card.label === "A" && topCard.label === "K") ? 14 : card.value;
  
  // Gleiche Farbe ist immer erlaubt
  if (card.suit === topCard.suit) return true;
  
  // Bei unterschiedlicher Farbe muss der Wert größer oder gleich sein
  return cardValue >= topValue;
}
