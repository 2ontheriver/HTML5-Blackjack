
game.no_canvas.controller = function(viewIn){  //game.no_canvas.controller

    this.blackjack = viewIn.blackjack;
    this.view = viewIn;
	var _this = this;
	
    this.blackjack.userBalanceChange.attach(function (){ _this.saveBalance(); });   //attach a model listeners for balanace change to update localStorage
	
	this.view.buttons.start.event.attach(function () { _this.startGame(); });
	this.view.buttons.deal.event.attach(function () { _this.dealGame(); });
	this.view.buttons.yes.event.attach(function () { _this.processInsurance(true); });
	this.view.buttons.no.event.attach(function () { _this.processInsurance(false); });
	this.view.buttons.hit.event.attach(function () { _this.playerHit(); });
	this.view.buttons.stand.event.attach(function () { _this.playerStand(); });
	this.view.buttons.double.event.attach(function () { _this.playerDouble(); });
	this.view.buttons.split.event.attach(function () { _this.playerSplit(); });
	this.view.buttons.new_hand.event.attach(function () { _this.newHand(); });
	this.view.buttons.re_bet.event.attach(function () { _this.reBet(); });
	this.view.buttons.re_bet_deal.event.attach(function () { _this.reBetDeal(); });
	this.view.buttons.reload_page.event.attach(function () { _this.reloadGame(); });
} 
game.no_canvas.controller.prototype.saveBalance = function(){ 
    localStorage.balance = this.blackjack.user.balance;
}
game.no_canvas.controller.prototype.prepareGame = function(){ 
	if (localStorage.getItem("name") !== null) {
        this.blackjack.startGame(localStorage.name,  parseFloat(localStorage.balance));
	} else 
	    view.prepareGame();
}
game.no_canvas.controller.prototype.startGame = function(){ 
    if(this.blackjack.startGame(this.view.inputs.name.value)){
	    localStorage.name = this.view.inputs.name.value;
		this.saveBalance();
	} else{
	    this.view.showMessage('Enter a name with 3 to 10 characters.');
	}
} 
game.no_canvas.controller.prototype.dealGame = function(){ 
    var playerBet = Math.floor(this.view.inputs.bet.value);
    if(this.blackjack.placeBet(playerBet)) this.blackjack.deal();
}
game.no_canvas.controller.prototype.processInsurance = function(userTookInsurance){
    this.blackjack.takeInsurance(userTookInsurance);
}
game.no_canvas.controller.prototype.playerHit = function(){ 
    this.blackjack.userHits();
}
game.no_canvas.controller.prototype.playerStand = function(){ 
    this.blackjack.userStands();
}
game.no_canvas.controller.prototype.playerDouble = function(){ 
    this.blackjack.userDoubles();
}
game.no_canvas.controller.prototype.playerSplit = function(){ 
    this.blackjack.userSplits();
}
game.no_canvas.controller.prototype.newHand = function(){ 
    this.blackjack.newHand(false);
    this.view.inputs.bet.value = '';
}
game.no_canvas.controller.prototype.reBet = function(){ 
    this.blackjack.newHand(false);
    this.view.inputs.bet.value = this.blackjack.previousBet;
}
game.no_canvas.controller.prototype.reBetDeal = function(){ 
    this.blackjack.newHand(true);
}
game.no_canvas.controller.prototype.reloadGame = function(){ 
    window.location.reload(false);
	localStorage.removeItem("name");
	localStorage.removeItem("balance");
}
