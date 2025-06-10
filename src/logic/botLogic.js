export function botPlayEasy(botHand, topCard) {
  return botHand.find(card => isPlayable(card, topCard));
}

export function botPlayHard(botHand, topCard, opponentHand) {
  const playable = botHand.filter(c => isPlayable(c, topCard));
  if (playable.length === 0) return null;
  return playable.sort((a, b) => b.value - a.value)[0];
}

function isPlayable(card, topCard) {
  // Ass als 14 werten, wenn auf König gelegt wird
  const topValue = (topCard.label === "K" && card.label === "A") ? 14 : topCard.value;
  const cardValue = (card.label === "A" && topCard.label === "K") ? 14 : card.value;
  if (card.suit === topCard.suit) return true;
  if (card.suit !== topCard.suit && cardValue >= topValue) return true;
  return false;
}
