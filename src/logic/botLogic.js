// Bot-Logik für verschiedene Schwierigkeitsgrade
export function botPlayEasy(botHand, topCard) {
  // Im Easy-Modus spielt der Bot einfach die erste spielbare Karte
  return botHand.find(card => isPlayable(card, topCard));
}

export function botPlayHard(botHand, topCard, opponentHand) {
  const playable = botHand.filter(card => isPlayable(card, topCard));
  if (playable.length === 0) return null;

  // Im Hard-Modus spielt der Bot strategischer:
  // 1. Wenn möglich, spiele die höchste Karte der gleichen Farbe
  const sameSuit = playable.filter(card => card.suit === topCard.suit);
  if (sameSuit.length > 0) {
    return sameSuit.reduce((highest, current) => 
      current.value > highest.value ? current : highest
    , sameSuit[0]);
  }

  // 2. Sonst spiele die niedrigste mögliche Karte einer anderen Farbe
  const otherSuits = playable.filter(card => card.suit !== topCard.suit);
  if (otherSuits.length > 0) {
    return otherSuits.reduce((lowest, current) => 
      current.value < lowest.value ? current : lowest
    , otherSuits[0]);
  }

  // Sollte nie erreicht werden, da playable.length > 0
  return playable[0];
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
