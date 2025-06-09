export function botPlayEasy(botHand, topCard) {
  return botHand.find(card => isPlayable(card, topCard));
}

export function botPlayHard(botHand, topCard, opponentHand) {
  const playable = botHand.filter(c => isPlayable(c, topCard));
  if (playable.length === 0) return null;
  return playable.sort((a, b) => b.value - a.value)[0];
}

function isPlayable(card, topCard) {
  if (card.suit === topCard.suit) return true;
  if (card.value >= topCard.value) return true;
  if (card.label === "A" && topCard.label === "K") return true;
  return false;
}
