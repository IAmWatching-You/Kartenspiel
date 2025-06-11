function shuffle(deck) {
	// Fisher–Yates shuffle algorithm
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// swap deck[i] and deck[j]
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

export { shuffle };