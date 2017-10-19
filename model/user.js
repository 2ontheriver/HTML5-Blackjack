

function User(nameIn, balanceIn){
    this.name = nameIn;
	this.balance = balanceIn;
	this.hands = [];
	this.hands[0] = new Hand();
	this.selectHand = function(){ //returns the Hand that is currently being played or false if all hands have been played
		for	(var handIndex = 0; handIndex < this.hands.length; handIndex++) {
			if(!this.hands[handIndex].playedHand) return this.hands[handIndex];
		}
		return false;
	}
	this.getCurrentHandNo = function(){ //returns the Hand index in the array, 1st hand = 0, 2nd hand = 1
		for	(var handIndex = 0; handIndex < this.hands.length; handIndex++) {
			if(!this.hands[handIndex].playedHand) return handIndex;
		}
		return false;
	}
	this.finishCurrentHand = function(){
		this.selectHand().playedHand = true;
	}
	this.addCard = function(cardIn){
	    var currentHand = this.selectHand();
	    currentHand.cards.push(cardIn);
	}
	this.splits = function(){
	    var currentHand = this.selectHand();
	    this.hands[1] = new Hand();
	    this.hands[1].cards.push(currentHand.cards.pop()); //take a card from the current hand, and put in in the next hand
	}
	this.hasSplit = function(){ //function not used much!
	    if(this.hands.length > 1) return true; 
		return false;
	}
	this.hasBJ = function(){ 
	    if(this.hands.length != 1) return false; //if the user has split.
	    if(this.hands[0].cards.length == 2 && this.hands[0].has21()) return true; 
		else return false;
	}
	this.allHandsBust = function(){
	    for	(var handIndex = 0; handIndex < this.hands.length; handIndex++) {
			if(!this.hands[handIndex].isBust()) return false;
		}
		return true;
	}
	this.handReset = function(){ 
		this.hands = [];
		this.hands[0] = new Hand();
	}
	this.toString = function(){
	    var returnText = this.name + ".";
		for	(var handIndex = 0; handIndex < this.hands.length; handIndex++) {
		    returnText += " Hand " + (handIndex+1) + ": ";
		    returnText += this.hands[handIndex].toString();
		}
		return returnText;
	}
}