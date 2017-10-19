

game.blackjack = function(){ //Model
    
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
		if(typeof balanceIn === 'undefined') balanceIn = game.startingChips;
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
	    else if(this.user.balance < betIn) failMessage = 'You do not have enough in your cashier to place this bet.';
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
		if(this.user.balance < this.minBet) this.gameEnding.notify('Game Over. You have less than the minimum bet. Click \'Leave\'');
		else if(reBet && this.placeBet(this.previousBet)) this.deal();
		else this.gameStarting.notify();
	}
	this.toString = function(){ 
	    var returnText = "Bet = " + this.startingBet + "\n\n" + this.dealer + "\n\n" + this.user;
		return returnText;
	};
}
