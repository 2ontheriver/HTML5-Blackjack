

function Card(suitIn, valueIn, faceUpIn) { //card constructor function, note for valueIn Ace = 1, 2 = 2 ... K = 13
    if(valueIn < 1 || valueIn > 13 || !Number.isInteger(valueIn)) throw new Error("You have tried to create a card with an incorrect value");
	this.suit = suitIn;
    this.value = valueIn;
    this.faceUp = faceUpIn;
	this.getName = function(){
		return this.suit + "_" + this.value;
	}
	this.getBJValue = function(){
	    if(this.value >= 1 && this.value <= 9) return this.value;
		else if(this.value >= 10 && this.value <= 13) return 10;
	}
	this.getValueString = function(){
	    var cardNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
		return cardNames[(this.value-1)]
	}
	this.getSuitString = function(){
        switch (this.suit) {
            case "c" : return "Clubs"; case "d" : return "Diamonds"; case "h" : return "Hearts"; case "s" : return "Spades"; 
			default : return null; //should this throw an error? or should the 
        }
	}
    this.toString = function(){ return this.getValueString() + " of " + this.getSuitString() };
}