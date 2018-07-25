var _ = require('underscore');
var persist = require('./persist');
var Card = require('./card');
var Player = require('./player');
var readGame = false;

class Game {
  constructor() {
    this.isStarted = false;
    this.players = {}; //player.id : player
    this.playerOrder = [];
    this.pile = []; //central pile

  }

  usernameArr(players){
    var arr = [];
    arr = Object.values(players);
    arr = arr.map(player => player.username);
    // console.log('UUUUUUUUUSSSSSSSSERNAME ARRAY', arr)
    return arr;
  }

  addPlayer(username) {
    var arr = this.usernameArr(this.players);
    if (this.isStarted){
        throw "Error, can't join mid-game!"
    } else if (!username) {
        throw "Please choose a username!"
    } else if (arr.indexOf(username) !== -1){
        throw "Please choose another (unique) username!"
    } else {
      var newPlayer = new Player(username);
      this.playerOrder.push(newPlayer.id);
      this.players[newPlayer.id] = newPlayer;
      return newPlayer.id;
    }
  }

  startGame() {
    if (this.isStarted){
      throw "Error, game already in progress!";
    } else if (Object.keys(this.players).length < 2) {
      throw "Error, go make some friends!";
    } else {

      this.isStarted = true;
      var deck = this.createDeck();
      _.shuffle(deck);
      // console.log("////////////////", deck);
      let cardsPerPlayer = Math.floor(52/(Object.keys(this.players).length));
      for (let player in this.players) {
        for (let i = 0; i < cardsPerPlayer; i ++) {
          this.players[player].pile.push(deck.pop())
        }
      }
      //give the remaining cards to the players randomly
      while (deck.length !== 0) {
        var playerIdArr = Object.keys(this.players)
        // console.log(playerIdArr);
        var randPlayer = Math.random() * Object.keys(this.players).length;
        this.players[ (playerIdArr[Math.floor(randPlayer)]) ].pile.push(deck.pop())
      }
    }
  }

  nextPlayer() {
    if (!this.isStarted){
      throw ("must start game first!");
    } else {
        var firstElement = this.playerOrder.shift();
        this.playerOrder.push(firstElement);
        while (this.players[this.playerOrder[0]].pile.length == 0){
          var firstElement = this.playerOrder.shift();
          this.playerOrder.push(firstElement);
        }
    }
  }

  isWinning(playerId) {
    if (!this.isStarted){
      throw ("The game must have started to be winning!");
    } else{
        if (this.players[playerId].pile.length == 52){
          this.isStarted = false;
          return true;
        }
    }
    return false;
  }

  playCard(playerId) {
    if (!this.isStarted){
      throw ("You must start the game to play a card!");
    } else if (playerId !== this.playerOrder[0]){
      throw ("It's not your turn!");
    } else if (this.players[playerId].pile.length === 0){
      throw ("You have no cards left!");
    } else {
      this.pile.push(this.players[playerId].pile.pop());

      //count players with zero cards
      var zeroCount = 0;
      for (var player in this.players) {
        if (this.players[player].pile.length === 0)
          zeroCount ++;
      }
      if (zeroCount == this.playerOrder.length){
        this.isStarted = false;
        throw ("It's a tie?! How did this happen?!")
      }

      this.nextPlayer();

      var newCard = this.pile[this.pile.length -1];
      return {
        'card': newCard,
        'cardString': newCard.toString()
      }

    }
  }

  slap(playerId) {
    if (!this.isStarted) {
      throw ("You must start the game before you slap!")
    } else {
      var last = this.pile.length - 1;

      if ((this.pile.length >= 3 && this.pile[last].value === this.pile[last - 2].value)
          || (this.pile.length >= 2 && this.pile[last].value === this.pile[last - 1].value)
            || this.pile[last].value === 11 ) {
              //successful slap

              //player recieves game pile, game pile becomes new array
              this.players[playerId].pile =   this.pile.concat(this.players[playerId].pile);
              this.pile = [];

              //return
              return {
                'winning': this.isWinning(playerId),
                'message': 'got the pile!'
              }
      } else {
        //bad slap
        //obtain and remove the cards from the player pile
        var lostCards = [];
        for (var i = 0; i < Math.min(3, this.players[playerId].pile.length); i++) {
            lostCards.push(this.players[playerId].pile.pop())
        }

        //add to the BOTTOM of the game pile
        this.pile = lostCards.concat(this.pile);
        //return
        return {
          'winning': false,
          'message': 'lost 3 cards!'
        }

      }
    }
  }
  //helper FUNCTIONS
  createDeck(){
    var deck = [];
    var suits = ['hearts', 'spades', 'diamonds', 'clubs']
    for (var i in suits){
      for (var j = 1; j <= 13; j++){
        deck.push(new Card(suits[i], j));
      }
    }
    return deck;
  }



  // PERSISTENCE FUNCTIONS
  //
  // Start here after completing Step 2!
  // We have written a persist() function for you to save your game state to
  // a store.json file.
  // =====================
  fromObject(object) {
    this.isStarted = object.isStarted;

    this.players = _.mapObject(object.players, player => {
      var p = new Player();
      p.fromObject(player);
      return p;
    });

    this.playerOrder = object.playerOrder;

    this.pile = object.pile.map(card => {
      var c = new Card();
      c.fromObject(card);
      return c;
    });
  }

  toObject() {
    return {
      isStarted: this.isStarted,
      players: _.mapObject(this.players, val => val.toObject()),
      playerOrder: this.playerOrder,
      pile: this.pile.map(card => card.toObject())
    };
  }

  fromJSON(jsonString) {
    this.fromObject(JSON.parse(jsonString));
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  persist() {
    if (readGame && persist.hasExisting()) {
      this.fromJSON(persist.read());
      readGame = true;
    } else {
      persist.write(this.toJSON());
    }
  }

  //helper functions

}

module.exports = Game;
