

function Dealer(){
    this.name = 'Dealer';
	this.cards = [];
	this.addCard = function(card){
	    this.cards.push(card);
	}
	this.hasAce = function(){
	    for(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) { if(this.cards[cardIndex].getBJValue() == 1) return true; }
		return false;
	}
    this.getHandValue = function(){ //returns the (int)value of the hand, with ace as 1 unless the dealer has made 17+ which is returned instead
        var returnValue = 0;
        for	(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
            returnValue += this.cards[cardIndex].getBJValue();
        }
	    if((returnValue >=7 && returnValue <= 11) && this.hasAce()) returnValue += 10;
        return returnValue;
	}
	this.getHandValueTxt = function(){
	    var handV = this.getHandValue();
	    if(handV >= 17  && handV <= 21) return handV;
		else if(handV > 21) return 'Bust';
	    else return handV + (this.hasAce() && (handV < 11) ? " or " + (handV + 10) : "");
	}
	this.hasBJ = function(){ //check to see if the dealer has Blackjack, dealt 21 in their first 2 cards
	    if(this.cards.length == 2 && this.getHandValue() == 21) return true; else return false;
	}
	this.getFinsihedBestHandValue = function(){
	    if(this.getHandValue() > 21) return 0;
	    return this.getHandValue();
	}
	this.handReset = function(){ 
	    this.cards = [];
	}
	this.toString = function(){ 
	    var returnText = "";
		for	(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
		    returnText += this.cards[cardIndex] + (cardIndex !== (this.cards.length-1) ? ", " : "");
		}
		return returnText += " (" + this.getHandValueTxt() + ")";
	};
}
