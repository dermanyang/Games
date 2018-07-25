class Card {
  constructor(suit, value) {
    this.value = value,
    this.suit = suit
  }

  toString() {
    var message = "";
    if (this.value == 1)
        message += "Ace of ";
    else if (this.value == 11)
        message += "Jack of ";
    else if (this.value == 12)
        message += "Queen of ";
    else if (this.value == 13)
        message += "King of "
    else
        message += this.value + " of ";

  var suitStr = this.suit;
  suitStr = suitStr[0].toUpperCase() + suitStr.slice(1);

  return message + suitStr;
}


  // PERSISTENCE FUNCTIONS
  //
  // Start here after completing Step 2!
  // We have written a persist() function for you to save your game state to
  // a store.json file.
  // =====================
  fromObject(object) {
    this.value = object.value;
    this.suit = object.suit;
  }

  toObject() {
    return {
      value: this.value,
      suit: this.suit
    };
  }
}

module.exports = Card;
