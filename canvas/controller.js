

game.canvas.controller = function(viewIn){  //game.canvas.controller

    this.blackjack = viewIn.blackjack;
    this.view = viewIn;
	var _this = this;
	this.blackjack.userBalanceChange.attach(function (){ _this.saveBalance(); });   //attach a model listener for balance change to update localStorage
	this.view.buttons.start.event.attach(function () { _this.startGame(); });
	this.view.buttons.deal.event.attach(function () { _this.dealGame(); });
	this.view.buttons.clear.event.attach(function () { _this.clearChips(); });
	this.view.buttons.yes.event.attach(function () { _this.processInsurance(true); });
	this.view.buttons.no.event.attach(function () { _this.processInsurance(false); });
	this.view.buttons.hit.event.attach(function () { _this.playerHit(); });
	this.view.buttons.stand.event.attach(function () { _this.playerStand(); });
	this.view.buttons.double.event.attach(function () { _this.playerDouble(); });
	this.view.buttons.split.event.attach(function () { _this.playerSplit(); });
	this.view.buttons.new_hand.event.attach(function () { _this.newHand(); });
	this.view.buttons.re_bet.event.attach(function () { _this.reBet(); });
	this.view.buttons.re_bet_deal.event.attach(function () { _this.reBetDeal(); });
	this.view.buttons.leave.event.attach(function () { _this.reloadGame(); });
	this.view.chipWrapper.event.attach(function (sender, chipValue) { _this.playerClickedChip(chipValue); });
} 
game.canvas.controller.prototype.saveBalance = function(){ 
    localStorage.name = this.blackjack.user.name;
    localStorage.balance = this.blackjack.user.balance;
}
game.canvas.controller.prototype.prepareGame = function(){ 
	if (localStorage.getItem("name") !== null) {
        this.blackjack.startGame(localStorage.name,  parseFloat(localStorage.balance));
	} else {
	    this.view.prepareGame();
	}
}
game.canvas.controller.prototype.startGame = function(){ 
	var userNameField = this.view.nameInput;
    if(userNameField.value !=  userNameField.startValue && this.blackjack.startGame(userNameField.value, game.startingChips)){
	    localStorage.name = userNameField.value;
		this.saveBalance();
	} else this.view.showMessage('Enter a name with 3 to 10 characters.');
} 
game.canvas.controller.prototype.playerClickedChip = function(chipValue){ 
	var failMessage = '';
	if(this.blackjack.user.balance < (chipValue + this.view.unplacedBets)) failMessage = 'You do have enough in your cashier to place this bet.';
	else if(this.blackjack.maxBet < (chipValue + this.view.unplacedBets)) failMessage = 'The blackjack limit is ' + this.blackjack.maxBet + '.';
	if(failMessage == ''){
		//alert("adding chips " + chipValue + " Total: " + this.view.unplacedBets);
		this.view.unplacedBets += chipValue;
		this.view.updateBettingBox(); //add to betBox
	}
	else this.blackjack.userMessage.notify(failMessage);
}
game.canvas.controller.prototype.dealGame = function(){ 
    if(this.view.unplacedBets >= this.blackjack.minBet){
	    this.blackjack.placeBet(this.view.unplacedBets);
		this.view.unplacedBets = 0;
	    this.blackjack.deal();
		//this.view.updateBettingBox(); 
	} 
}
game.canvas.controller.prototype.clearChips = function(){ 
	this.view.unplacedBets = 0;
	this.view.updateBettingBox(true); 
}
game.canvas.controller.prototype.processInsurance = function(userTookInsurance){
    this.blackjack.takeInsurance(userTookInsurance);
}
game.canvas.controller.prototype.playerHit = function(){
    this.blackjack.userHits();
}
game.canvas.controller.prototype.playerStand = function(){ 
    this.blackjack.userStands();
}
game.canvas.controller.prototype.playerDouble = function(){ 
    this.blackjack.userDoubles();
}
game.canvas.controller.prototype.playerSplit = function(){ 
    this.blackjack.userSplits();
}
game.canvas.controller.prototype.newHand = function(){ 
    this.blackjack.newHand(false);
}
game.canvas.controller.prototype.reBet = function(){ 	
    this.blackjack.newHand(false);
	if(this.blackjack.user.balance >= this.blackjack.previousBet){
		this.view.unplacedBets = this.blackjack.previousBet;
		this.view.updateBettingBox(false);
	}
}
game.canvas.controller.prototype.reBetDeal = function(){ 
    this.blackjack.newHand(true);
}
game.canvas.controller.prototype.reloadGame = function(){ 
    var leave = confirm("Are you sure you want to leave, all stats will be deleted");
	if (leave == true) {
		window.location.reload(false);
		localStorage.removeItem("name");
		localStorage.removeItem("balance");
	}
}

