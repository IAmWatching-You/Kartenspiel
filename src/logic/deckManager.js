import { createDeck } from "../data/deck";

export function shuffle(deck) {
  return deck
    .slice()
    .sort(() => Math.random() - 0.5);
}

export function dealHands(deck, handSize = 5) {
  const player1 = deck.splice(0, handSize);
  const player2 = deck.splice(0, handSize);
  const topCard = deck.splice(0, 1)[0];
  return { player1, player2, topCard, remainingDeck: deck };
}
