

function Hand(){
    this.playedHand = false;
    this.doubled = false;
	this.cards = [];
	this.hasAce = function(){
	    for(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) { if(this.cards[cardIndex].getBJValue() == 1) return true; }
		return false;
	}
	this.getHandValue = function(){ //returns the (int)value of the hand, with ace as 1 unless they have made 21 which is returned instead
        var returnValue = 0;
        for	(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
            returnValue += this.cards[cardIndex].getBJValue();
        }
	    if(returnValue == 11 && this.hasAce()) return 21;
        return returnValue;
	}
	this.getHandValueTxt = function(){
	    if(this.has21()) return 21;
		else if(this.isBust()) return 'Bust';
		else if(this.playedHand) return (this.hasAce() && (this.getHandValue() < 11) ? this.getHandValue() + 10 : this.getHandValue());
	    else return this.getHandValue() + (this.hasAce() && (this.getHandValue() < 11) ? " or " + (this.getHandValue() + 10) : "");
	}
	this.hasPair = function(){
	    if(this.cards.length == 2 && this.cards[0].getBJValue() == this.cards[1].getBJValue()) return true;
		return false;
	}
	this.canBeDoubled = function(){
	    if(this.cards.length == 2 && !this.has21())return true;
		return false;
	}
	this.isBust = function(){
	    if (this.getHandValue() > 21) return true; else return false;
	}
	this.has21 = function(){
	    if(this.getHandValue() == 21) return true; else return false;
	}
	this.getFinsihedBestHandValue = function(){
	    var handValue = this.getHandValue();
	    if(handValue > 21) return 0;
		if(handValue <= 11 && this.hasAce()) handValue += 10;
		return handValue;
	}
	this.toString = function(){
	    var returnText = "";
		for	(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
		    returnText += this.cards[cardIndex] + (cardIndex !== (this.cards.length-1) ? ", " : "");
		}
		return returnText += " (" + this.getHandValueTxt() + ")" + (!this.playedHand && this.cards.length > 1 ? ' <' : '') + (this.doubled ? ' (Doubled)' : '');
	};
}