export const suits = ["hearts", "diamonds", "clubs", "spades"];
export const values = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "J", value: 11 },
  { label: "Q", value: 12 },
  { label: "K", value: 13 },
  { label: "A", value: 1 }
];

export function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let val of values) {
      deck.push({ suit, label: val.label, value: val.value });
    }
  }
  return deck;
}
