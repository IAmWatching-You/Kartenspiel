import { shuffle, dealHands } from "./deckManager";
import { createDeck } from "../data/deck";
import { botPlayEasy, botPlayHard } from "./botLogic";

export class GameManager {
  constructor(mode) {
    this.mode = mode;
    this.rounds = { player1: 0, player2: 0 };
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
    // Im Bot-Modus ist der Mensch immer player1 und beginnt immer
    if (this.mode && this.mode.startsWith("bot")) {
      this.currentPlayer = "player1";
    } else {
      this.currentPlayer = Math.random() < 0.5 ? "player1" : "player2";
    }
    // Rundenstand NICHT zurücksetzen!
    this.winner = null;
  }

  getCurrentHand() {
    return this.hands[this.currentPlayer];
  }

  isCardPlayable(card) {
    // Ass als 14 werten, wenn auf König gelegt wird
    const topValue = (this.topCard.label === "K" && card.label === "A") ? 14 : this.topCard.value;
    const cardValue = (card.label === "A" && this.topCard.label === "K") ? 14 : card.value;
    if (card.suit === this.topCard.suit) return true;
    if (card.suit !== this.topCard.suit && cardValue >= topValue) return true;
    return false;
  }

  playCard(cardIndex) {
    const hand = this.getCurrentHand();
    const card = hand[cardIndex];
    if (!this.isCardPlayable(card)) return false;

    hand.splice(cardIndex, 1);
    this.topCard = card;

    // Prüfe, ob Spieler gewonnen hat (Hand leer)
    if (hand.length === 0) {
      this.rounds[this.currentPlayer]++;
      // Prüfe auf Spielsieg
      if (this.rounds[this.currentPlayer] === 2) {
        this.winner = this.currentPlayer;
      } else {
        this.resetGame();
      }
      return true;
    }

    // Prüfe, ob der nächste Spieler überhaupt noch spielen kann
    this.switchPlayer();
    this.checkPattSituation();
    return true;
  }

  // Prüft, ob beide Spieler nicht mehr spielen können (Patt)
  checkPattSituation() {
    const canCurrent = this.hands[this.currentPlayer].some(card => this.isCardPlayable(card));
    const other = this.currentPlayer === "player1" ? "player2" : "player1";
    const canOther = this.hands[other].some(card => this.isCardPlayable(card));
    if (!canCurrent && !canOther) {
      // Beide können nicht spielen: Unentschieden, beide bekommen einen Punkt
      this.rounds.player1++;
      this.rounds.player2++;
      if (this.rounds.player1 === 2 && this.rounds.player2 === 2) {
        this.winner = "draw";
      }
      this.resetGame();
    }
  }

  drawCard() {
    if (this.hands[this.currentPlayer].length >= 5 || this.deck.length === 0) {
      this.switchPlayer();
      this.checkPattSituation();
      return;
    }

    const newCard = this.deck.shift();
    this.hands[this.currentPlayer].push(newCard);

    // Nachziehen beendet den Zug nur, wenn Hand voll ist oder Karte nicht spielbar
    if (!this.isCardPlayable(newCard) && this.hands[this.currentPlayer].length === 5) {
      this.switchPlayer();
      this.checkPattSituation();
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
