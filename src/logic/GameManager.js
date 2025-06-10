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
    
    // Im Bot-Modus IMMER player1 (Mensch) beginnen
    this.currentPlayer = this.mode?.startsWith("bot") ? "player1" : (Math.random() < 0.5 ? "player1" : "player2");
    
    // Rundenstand NICHT zurücksetzen!
    this.winner = null;
    
    // Prüfe initial, ob überhaupt spielbar ist
    this.checkInitialSituation();
  }

  checkInitialSituation() {
    const handCurrent = this.hands[this.currentPlayer];
    if (!handCurrent.some(card => this.isCardPlayable(card))) {
      // Wenn keine Karte spielbar ist, automatisch eine Karte ziehen
      this.drawCard();
    }
  }

  getCurrentHand() {
    return this.hands[this.currentPlayer];
  }

  isCardPlayable(card) {
    // Ass als 14 werten, wenn auf König gelegt wird
    const topValue = (this.topCard.label === "K" && card.label === "A") ? 14 : this.topCard.value;
    const cardValue = (card.label === "A" && this.topCard.label === "K") ? 14 : card.value;
    
    // Gleiche Farbe immer erlaubt
    if (card.suit === this.topCard.suit) return true;
    // Andere Farbe nur wenn Wert größer/gleich
    return cardValue >= topValue;
  }

  playCard(cardIndex) {
    // Verhindere Spielen während Bot-Zug
    if (this.mode?.startsWith("bot") && this.currentPlayer === "player2") return false;

    const hand = this.getCurrentHand();
    const card = hand[cardIndex];
    
    if (!this.isCardPlayable(card)) return false;

    // Karte spielen
    hand.splice(cardIndex, 1);
    this.topCard = card;

    // Prüfe auf Rundensieg (Hand leer)
    if (hand.length === 0) {
      this.rounds[this.currentPlayer]++;
      
      // Prüfe auf Spielsieg (2 Runden)
      if (this.rounds[this.currentPlayer] === 2) {
        this.winner = this.currentPlayer;
      } else {
        // Neue Runde starten
        this.resetGame();
      }
      return true;
    }

    this.switchPlayer();
    this.checkPattSituation();
    return true;
  }

  checkPattSituation() {
    const current = this.currentPlayer;
    const other = current === "player1" ? "player2" : "player1";
    const handCurrent = this.hands[current];
    const handOther = this.hands[other];
    
    // Prüfe ob beide Spieler handlungsunfähig sind
    const canCurrent = handCurrent.some(card => this.isCardPlayable(card));
    const canOther = handOther.some(card => this.isCardPlayable(card));
    
    // Patt nur wenn beide 5 Karten haben und keine spielbar ist
    if (handCurrent.length === 5 && handOther.length === 5 && !canCurrent && !canOther) {
      this.rounds.player1++;
      this.rounds.player2++;
      
      // Prüfe auf Unentschieden
      if (this.rounds.player1 === 2 && this.rounds.player2 === 2) {
        this.winner = "draw";
      }
      
      this.resetGame();
    }
  }

  drawCard() {
    // Verhindere Ziehen während Bot-Zug
    if (this.mode?.startsWith("bot") && this.currentPlayer === "player2") return false;
    
    // Prüfe ob Ziehen möglich
    if (this.hands[this.currentPlayer].length >= 5 || this.deck.length === 0) {
      this.switchPlayer();
      this.checkPattSituation();
      return false;
    }

    const newCard = this.deck.shift();
    this.hands[this.currentPlayer].push(newCard);

    // Nachziehen beendet den Zug nur wenn Hand voll oder Karte nicht spielbar
    if (this.hands[this.currentPlayer].length === 5 || !this.isCardPlayable(newCard)) {
      this.switchPlayer();
      this.checkPattSituation();
    }
    
    return true;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "player1" ? "player2" : "player1";
  }

  botPlay() {
    if (!this.mode?.startsWith("bot") || this.currentPlayer !== "player2") return false;

    const botHand = this.hands.player2;
    const humanHand = this.hands.player1;
    
    // Bot-Strategie wählen
    const card = this.mode === "bot-hard" 
      ? botPlayHard(botHand, this.topCard, humanHand)
      : botPlayEasy(botHand, this.topCard);

    if (card) {
      const index = botHand.indexOf(card);
      return this.playCard(index);
    } else {
      return this.drawCard();
    }
  }
}
