Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && 
           isFinite(value) && 
           Math.floor(value) === value;
};

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

function Table(){ //Model
    this.user;
    this.dealer;
	this.deck = new Deck();
	this.previousBet = 0;
	this.startingBet = 0;
	this.insuranceBet = 0;
	this.minBet = 1;
	this.maxBet = 500;
	
	//model events could be stored in an object or an array for tidyness?
	this.gameStarting = new Event(this);
	this.dealingHand = new Event(this);
	this.offerUserInsurance = new Event(this);
	this.insuranceClosed = new Event(this);
	this.userCardDealt = new Event(this);
	this.userShowOptions = new Event(this);
	this.dealerCardDealt = new Event(this);
	this.userHandBust = new Event(this);
	this.userHandStood = new Event(this); //includes 21 and BJ
	this.userDoubled = new Event(this);
	this.userSplit = new Event(this);
	this.showCompareHandsResult = new Event(this); 
	this.gameEnding = new Event(this); 
	this.userMessage = new Event(this); 
	this.settleInsurance = new Event(this); 
	this.userBalanceChange = new Event(this); 	
	
	this.updateUserBalance = function(addToBalance){
		this.user.balance += addToBalance;
		this.userBalanceChange.notify();
	}
	this.startGame = function(nameIn, balanceIn){
		if(balanceIn === undefined) balanceIn = 10000;
	    if(nameIn.length > 2 && nameIn.length < 11){
		    this.user = new User(nameIn, balanceIn);
		    this.dealer = new Dealer();
			this.gameStarting.notify();
			return true;
	    }
		return false;
	}
	this.getTotalBet = function(){
		if(this.user.hands[0] === undefined) return 0;
		var totalBet = this.startingBet;
		totalBet += this.insuranceBet;
		if(this.user.hands[0].doubled) totalBet += this.startingBet;
		if(this.user.hasSplit()){
			totalBet += this.startingBet;
			if(this.user.hands[1].doubled) totalBet += this.startingBet;
		}
		return totalBet;
	}
	this.placeBet = function(betIn){
		var failMessage = '';
	    if((!Number.isInteger(betIn)) || betIn <= 0) failMessage = 'Enter a number greater than 0.';
	    else if(this.maxBet < (betIn+this.startingBet)) failMessage = 'The table limit is ' + this.maxBet + '.';
	    else if(this.user.balance < betIn) failMessage = 'You do have enough in your cashier to place this bet.';
		if(failMessage != ''){
		    this.userMessage.notify(failMessage);
		    return false; 
		}
		this.startingBet += betIn;
		this.updateUserBalance(0-betIn);
		//this.updateBet.notify(false);
		return true;
	}
	/*this.clearBets = function(){
		if(this.startingBet > 0){
		    this.updateUserBalance(this.startingBet);
			this.startingBet = 0;
			this.updateBet.notify(true);
		}
	}*/
	this.deal = function(){
		this.deck.shuffle();
		var testCard = new Card('c', 2);
		var testCard2 = new Card('d', 2);
		var testCard3 = new Card('d', 1);
		var message;
	    //this.user.addCard(testCard);
	    this.user.addCard(this.deck.dealTopCard());
	    //this.dealer.addCard(testCard3);
	    this.dealer.addCard(this.deck.dealTopCard());
	    //this.user.addCard(testCard2);
	    this.user.addCard(this.deck.dealTopCard());
		this.dealingHand.notify();
		if(this.dealer.hasAce()){
			if(this.user.hasBJ()) message = this.user.name + ', take even money?';
			else message = this.user.name + ', would you like Insurance?';
			this.offerUserInsurance.notify(message);
		} else {
		    this.insuranceClosed.notify();
		    if(this.user.hasBJ()) this.userStands();
			else this.userShowOptions.notify();
		}
	}
	this.takeInsurance = function(choice){
		//alert(choice)
	    if(choice){
		    var insBet = (this.startingBet/2);
		    if(this.user.balance >= insBet){
		        this.insuranceBet = insBet;
				this.updateUserBalance(0-insBet);
			}
		}
		this.insuranceClosed.notify();
		if(this.user.hasBJ()) this.userStands();
		else this.userShowOptions.notify();
	}
	this.getHandOptions = function(){
	    var handOptions = [];
		var currentHand = this.user.selectHand();
	    if(!currentHand || currentHand.playedHand || currentHand.isBust()) return false;
	    if(currentHand.canBeDoubled()) handOptions.push('double');
	    handOptions.push('hit');
	    handOptions.push('stand');
	    if(currentHand.hasPair() && currentHand == this.user.hands[0] && this.user.hands.length == 1) handOptions.push('split'); 
		return handOptions;
	}
	this.userHits = function(doubled){
	    if(doubled === undefined) doubled = false;
		var currentHand = this.user.selectHand();
	    if(currentHand.has21() || currentHand.isBust()) return false;
		this.dealUserCard(this.deck.dealTopCard(), doubled);
		if(currentHand.isBust()) this.userBusts();
		else if(currentHand.has21() || doubled) this.userStands();
		else this.userShowOptions.notify(); 
	}
	this.dealUserCard = function(card, doubled){
		var cardNo = this.user.selectHand().cards.length-1; //get length of cards, before adding the new card, minus 1 to get the index
		this.user.addCard(card);	
		this.userCardDealt.notify({ 'card' : card, 'handNo' : this.user.getCurrentHandNo(), 'cardNo' : cardNo, 'hasSplit' : this.user.hasSplit(), 'doubled' : doubled});
	}
	this.dealDealerCard = function(card){
		this.dealer.addCard(card)		
		var cardNo = this.dealer.cards.length-1; //get length of cards, minus 1 to get the index
		this.dealerCardDealt.notify({ 'card' : card, 'cardNo' : cardNo});
	}
	this.userStands = function(){
	    this.user.finishCurrentHand();
	    this.userHandStood.notify();
		if(this.user.selectHand()){ //if there is a hand left after standing(the player has split)
		    this.setUpSplitHand();
		} else {
		    this.dealerPlayHand();
		}
	}
	this.setUpSplitHand = function(){
	    var nextSplitHand = this.user.selectHand()
		if(nextSplitHand){
			var splitAces = false;
	        if(nextSplitHand.cards[0].value == 1) splitAces = true;
			this.dealUserCard(this.deck.dealTopCard());
			if(nextSplitHand.has21() || splitAces) this.userStands(); //if the split hand makes 21 then force the hand to stand also
			else this.userShowOptions.notify(); 
			return true;
		} else return false
	}
	this.userDoubles = function(){
	    var currentHand = this.user.selectHand();
	    if(this.startingBet > this.user.balance) return false;
		currentHand.doubled = true;
		this.updateUserBalance(0-this.startingBet);
	    this.userDoubled.notify({ 'hasSplit' : this.user.hasSplit(), 'handNo' : this.user.getCurrentHandNo() });
	    this.userHits(true);
	}
	this.userSplits = function(){
	    var splitAces = false;
	    if(this.user.selectHand().cards[0].value == 1) splitAces = true;
	    if(this.startingBet > this.user.balance) return false;
		this.user.splits();
		this.updateUserBalance(0-this.startingBet);
		this.user.addCard(this.deck.dealTopCard());
	    this.userSplit.notify();
		if(this.user.selectHand().has21() || splitAces) this.userStands();
		else this.userShowOptions.notify(); 
	}
	this.userBusts = function(){
	    this.userHandBust.notify();
	    this.user.finishCurrentHand();
		if(!this.setUpSplitHand()){ 
		    if(this.user.allHandsBust()){
				if(this.insuranceBet != 0){
					this.dealDealerCard(this.deck.dealTopCard());
				}
			    this.compareHands();
			} else 
			    this.dealerPlayHand();
	    }
	}
	this.dealerPlayHand = function(){
	    if(this.user.hasBJ()){ 
			if(this.dealer.hasAce() || this.dealer.getHandValue() == 10){ // if user has BJ and dealer shows either an A or a 10 deal dealer a final card
				this.dealDealerCard(this.deck.dealTopCard());
			}
		} else {
			while(this.dealer.getHandValue() < 17){
				this.dealDealerCard(this.deck.dealTopCard());
			}
		}
		this.compareHands();
	}
	this.compareHands = function(){ 
	    var dealersScore = this.dealer.getFinsihedBestHandValue();
		var message = '';
		var wins = 0;
		var bets = 0;
		var handsInfo = []; //Has an array on hands that are an array with 0 => 
		for(var handIndex = 0; handIndex < this.user.hands.length; handIndex++){
			handsInfo[handIndex] = [0, this.user.hands[handIndex].doubled]; //first array element is 0 - push, 1 - dealer win, 2 - player win, 3 - player BJ
		    bets += this.startingBet;
			if(this.user.hands[handIndex].doubled == true) bets += this.startingBet;
			if(handIndex == 1) message = 'Hand 1: ' + message + ' Hand 2: ';
			var userScore = this.user.hands[handIndex].getFinsihedBestHandValue();
			if(this.user.hasBJ() && !this.dealer.hasBJ()){
				handsInfo[handIndex][0] = 3;
				message = '\'' + this.user.name + '\' wins with Blackjack!';
				wins = (this.startingBet*2.5);
			} else if(dealersScore > userScore || (!this.user.hasBJ() && this.dealer.hasBJ())){
				handsInfo[handIndex][0] = 1;
				message += '\'Dealer\' wins.';
			} else if(dealersScore == userScore || (this.user.hasBJ() && this.dealer.hasBJ())){
				message += 'Push.';
				wins += this.startingBet;
				if(this.user.hands[handIndex].doubled == true) wins += (this.startingBet);
			} else if(dealersScore < userScore){
				handsInfo[handIndex][0] = 2;
				message += '\'' + this.user.name + '\' wins.';
				wins += (this.startingBet*2);
				if(this.user.hands[handIndex].doubled == true) wins += (this.startingBet*2);
			}
		}
		if(this.insuranceBet != 0){
		    bets += this.insuranceBet;
		    if(this.dealer.hasBJ()){
		        wins += (this.insuranceBet*3);
				message = message + " (Insurance won)";
				this.settleInsurance.notify(true);
			} else {
			    message = message + " (Insurance lost)";
				this.settleInsurance.notify(false);
			}
			if(this.user.hasBJ()) message = '\'' + this.user.name + '\' took even money.';
		}
		this.updateUserBalance(wins); //add any wins to the user balance, any bets have already been deducted from the balance
		var netWins = wins - bets;
		if(netWins == 0) netWins = 'Break even';
		else netWins = (netWins <=0 ? '' : '+') + netWins;
		var handResults = { message : message + " (" + netWins + ")", hasSplit : this.user.hasSplit(), handsInfo : handsInfo };
		this.showCompareHandsResult.notify(handResults);
	}
	this.newHand = function(reBet){
		this.user.handReset();
		this.dealer.handReset();
		this.deck = new Deck();
		this.previousBet = this.startingBet;
		this.startingBet = 0;
		this.insuranceBet = 0;
		if(this.user.balance < this.minBet) this.gameEnding.notify(this.user.name + ' you do not have enough in your cashier to place a bet!');
		else if(reBet && this.placeBet(this.previousBet)) this.deal();
		else this.gameStarting.notify();
	}
	this.toString = function(){ 
	    var returnText = "Bet = " + this.startingBet + "\n\n" + this.dealer + "\n\n" + this.user;
		return returnText;
	};
}