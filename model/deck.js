

function Deck(){
    this.cards = [];
	var suits = ['s', 'd', 'c', 'h'];
	for(var suitIndex = 0; suitIndex < suits.length; suitIndex++) {
	    for	(cardValue = 1; cardValue <= 13; cardValue++) {
            this.cards.push(new Card(suits[suitIndex], cardValue));
        } 
    }
	this.shuffle = function(){
        var m = this.cards.length, t, i;
        while (m) { // While there remain elements to shuffle…
            i = Math.floor(Math.random() * m--); // Pick a remaining element…
            // And swap it with the current element.
            t = this.cards[m];
            this.cards[m] = this.cards[i];
            this.cards[i] = t;
        }
        return this.cards;
    }
	this.dealTopCard = function(){
	    return this.cards.shift();
	}
	this.toString = function(){ 
	    var returnText = "";
		for	(var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
		    returnText += "\n" + this.cards[cardIndex];
		}
		return returnText;
	};
}