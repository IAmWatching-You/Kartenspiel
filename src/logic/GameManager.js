import { shuffle, dealHands } from "./deckManager";
import { createDeck } from "../data/deck";
import { botPlayEasy, botPlayHard } from "./botLogic";

export class GameManager {
  constructor(mode) {
    this.mode = mode;
    this.resetGame();
  }

  resetGame() {
    this.deck = shuffle(createDeck());
    const { player1, player2, topCard, remainingDeck } = dealHands(this.deck);
    this.hands = {
      player1,
      player2,
    };
    this.topCard = topCard;
    this.deck = remainingDeck;
    this.currentPlayer = Math.random() < 0.5 ? "player1" : "player2";
    this.rounds = { player1: 0, player2: 0 };
    this.winner = null;
  }

  getCurrentHand() {
    return this.hands[this.currentPlayer];
  }

  isCardPlayable(card) {
    return (
      card.suit === this.topCard.suit ||
      card.value >= this.topCard.value ||
      (card.label === "A" && this.topCard.label === "K")
    );
  }

  playCard(cardIndex) {
    const hand = this.getCurrentHand();
    const card = hand[cardIndex];
    if (!this.isCardPlayable(card)) return false;

    hand.splice(cardIndex, 1);
    this.topCard = card;

    if (hand.length === 0) {
      this.rounds[this.currentPlayer]++;
      if (this.rounds[this.currentPlayer] === 2) {
        this.winner = this.currentPlayer;
      } else {
        this.resetGame();
      }
    } else {
      this.switchPlayer();
    }

    return true;
  }

  drawCard() {
    if (this.hands[this.currentPlayer].length >= 5 || this.deck.length === 0) {
      this.switchPlayer();
      return;
    }

    const newCard = this.deck.shift();
    this.hands[this.currentPlayer].push(newCard);

    if (this.isCardPlayable(newCard)) {
      // Optionally auto-play? Leave for user.
    } else if (this.hands[this.currentPlayer].length === 5) {
      this.switchPlayer();
    }
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "player1" ? "player2" : "player1";
  }

  botPlay(opponentHand = []) {
    const botHand = this.hands[this.currentPlayer];
    const card =
      this.mode === "bot-hard"
        ? botPlayHard(botHand, this.topCard, opponentHand)
        : botPlayEasy(botHand, this.topCard);

    if (card) {
      const index = botHand.indexOf(card);
      this.playCard(index);
    } else {
      this.drawCard();
    }
  }
}
