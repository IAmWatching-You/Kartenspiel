import { createDeck } from "../data/deck";

export function shuffle(deck) {
  // Fisher-Yates Shuffle für bessere Randomisierung
  const shuffled = deck.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealHands(deck, handSize = 5) {
  const player1 = deck.splice(0, handSize);
  const player2 = deck.splice(0, handSize);
  const topCard = deck.splice(0, 1)[0];
  return { player1, player2, topCard, remainingDeck: deck };
}
