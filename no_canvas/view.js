
game.no_canvas.view = function(blackjackIn){ //View 
    this.blackjack = blackjackIn;
	this.buttons = {
	'start' : this.createButton('Start'), 'deal' : this.createButton('Deal'), 'clear' : this.createButton('Clear'), 
	'yes' : this.createButton('Yes'), 'no' : this.createButton('No'), 
	'hit' : this.createButton('Hit'), 'stand' : this.createButton('Stand'), 
	'double' : this.createButton('Double'), 'split' : this.createButton('Split'), 
	'new_hand' : this.createButton('New Hand'), 're_bet' : this.createButton('Re-bet'), 
	're_bet_deal' : this.createButton('Re-bet & Deal'), 'reload_page' : this.createButton('Leave Table')
	};
	this.inputs = { 'name' : document.createElement("INPUT"), 'bet' : document.createElement("INPUT")};
    var _this = this //used instead of bind for accessing this object in the event functions
	
	//attach model listeners
    this.blackjack.gameStarting.attach(function (){ _this.startGame(); });    
	this.blackjack.dealingHand.attach(function (){ _this.dealGame(); });
	this.blackjack.offerUserInsurance.attach(function (sender, msg){ _this.offerInsurance(msg); });
	this.blackjack.insuranceClosed.attach(function (){ _this.closeInsurance(); });
	this.blackjack.userCardDealt.attach(function (){ _this.updatePlayerHand(); });
	this.blackjack.userShowOptions.attach(function (){ _this.showHandOptions(); });
	this.blackjack.dealerCardDealt.attach(function (){ _this.updateDealerHand(); });
	this.blackjack.userHandBust.attach(function (){ _this.playerBust(); });
	this.blackjack.userHandStood.attach(function (){ _this.playerStand(); });
	this.blackjack.userDoubled.attach(function (){ _this.playerDoubled(); });
	this.blackjack.userSplit.attach(function (){ _this.playerSplit(); });
	this.blackjack.showCompareHandsResult.attach(function (sender, msg){ _this.showHandResult(msg); });
	this.blackjack.userMessage.attach(function (sender, msg){ _this.showMessage(msg); });
	this.blackjack.gameEnding.attach(function (sender, msg){ _this.endGame(msg); });
	
	//attach listeners to html controls
    this.buttons.start.onclick = function(){ _this.buttons.start.event.notify(); };    
	this.buttons.deal.onclick = function(){ _this.buttons.deal.event.notify(); };  
	this.buttons.clear.onclick = function(){ _this.inputs.bet.value = ''; };  
	this.buttons.yes.onclick = function(){ _this.buttons.yes.event.notify(); };
	this.buttons.no.onclick = function(){ _this.buttons.no.event.notify(); };
	this.buttons.hit.onclick = function(){ _this.buttons.hit.event.notify(); };
	this.buttons.stand.onclick = function(){ _this.buttons.stand.event.notify(); };
	this.buttons.double.onclick = function(){ _this.buttons.double.event.notify(); };
	this.buttons.split.onclick = function(){ _this.buttons.split.event.notify(); };
	this.buttons.new_hand.onclick = function(){ _this.buttons.new_hand.event.notify(); };
	this.buttons.re_bet.onclick = function(){ _this.buttons.re_bet.event.notify(); };
	this.buttons.re_bet_deal.onclick = function(){ _this.buttons.re_bet_deal.event.notify(); };
	this.buttons.reload_page.onclick = function(){ _this.buttons.reload_page.event.notify(); };
}
game.no_canvas.view.prototype.prepareGame = function() {
    document.getElementById("buttons").appendChild(this.buttons.start);
    document.getElementById("input").appendChild(this.inputs.name);
	this.showMessage('Enter your name.');
}
game.no_canvas.view.prototype.startGame = function() {
    this.clearButtons();
    this.clearInput();
	document.getElementById('game_container').style.display = "none";
    document.getElementById('dealers_cards').innerHTML = '';
	document.getElementById('players_cards').innerHTML = '';
	document.getElementById('bet').innerHTML = '';
	document.getElementById('insurance_bet').innerHTML = '';
	document.getElementById("buttons").appendChild(this.buttons.deal);
	document.getElementById("buttons").appendChild(this.buttons.clear);
    document.getElementById("input").appendChild(this.inputs.bet);
	this.showMessage(this.blackjack.user.name + ', enter an amount to bet.');
	document.getElementById('cashier_container').style.display = "block";
	document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
	document.getElementById("leave_button").appendChild(this.buttons.reload_page);
}
game.no_canvas.view.prototype.dealGame = function() {
    this.clearButtons();
    this.clearInput();
	document.getElementById('insurance_bet').innerHTML = '';
    document.getElementById('hand2').style.display = "none";
	document.getElementById('bet').innerHTML = "<strong>Bet:</strong> &pound;" + this.blackjack.startingBet;
	document.getElementById('game_container').style.display = "block";
	document.getElementById('dealers_cards').innerHTML = this.blackjack.dealer;
	document.getElementById('players_cards').innerHTML = this.blackjack.user.hands[0];
	document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
	this.showMessage('');
};
game.no_canvas.view.prototype.offerInsurance = function(messageIn) {
	this.showMessage(messageIn);
	document.getElementById("buttons").appendChild(this.buttons.yes);
	document.getElementById("buttons").appendChild(this.buttons.no);
}
game.no_canvas.view.prototype.closeInsurance = function() {
    this.showMessage('');
    if(this.blackjack.insuranceBet != 0) {
	    document.getElementById('insurance_bet').innerHTML = "<strong>Insurance Bet:</strong> &pound;" + this.blackjack.insuranceBet;
		document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
	}
	//if(this.blackjack.user.hasBJ()) this.showMessage('You have Blackjack!'); //should this be prompted by the model??
	//this.showHandOptions();
}
game.no_canvas.view.prototype.showHandOptions = function() {
    this.clearButtons();
	var handOptions = this.blackjack.getHandOptions();
	if(handOptions){
		var buttonContainer = document.getElementById("buttons");
		for (var i = 0; i < handOptions.length; i++) {
			buttonContainer.appendChild(this.buttons[handOptions[i]]);
		}
	}
}
game.no_canvas.view.prototype.updatePlayerHand = function() { 
	document.getElementById('players_cards').innerHTML = this.blackjack.user.hands[0];
	if(this.blackjack.user.hands.length > 1) document.getElementById('players_cards2').innerHTML = this.blackjack.user.hands[1];
	document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
}
game.no_canvas.view.prototype.updateDealerHand = function() {
    document.getElementById('dealers_cards').innerHTML = this.blackjack.dealer;
}
game.no_canvas.view.prototype.playerBust = function() {
    //this.showMessage('Player Hand Bust.');
}
game.no_canvas.view.prototype.playerStand = function() {
    this.clearButtons();
	this.updatePlayerHand();
}
game.no_canvas.view.prototype.playerDoubled = function() {
	document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
}
game.no_canvas.view.prototype.playerSplit = function() {
	document.getElementById('players_cards').innerHTML = this.blackjack.user.hands[0];
    document.getElementById('hand2').style.display = "block";
	document.getElementById('players_cards2').innerHTML = this.blackjack.user.hands[1];
	document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
}
game.no_canvas.view.prototype.showHandResult = function(messageIn) {
    this.clearButtons();
    this.showMessage(messageIn);
	document.getElementById('cashier').innerHTML = this.blackjack.user.balance;
	document.getElementById("buttons").appendChild(this.buttons.new_hand);
	document.getElementById("buttons").appendChild(this.buttons.re_bet);
	document.getElementById("buttons").appendChild(this.buttons.re_bet_deal);
}
game.no_canvas.view.prototype.endGame = function(messageIn) {
    this.clearButtons();
	document.getElementById('game_container').style.display = "none";
	document.getElementById('bet').innerHTML = '';
	document.getElementById('insurance_bet').innerHTML = '';
	this.showMessage(messageIn);
}
game.no_canvas.view.prototype.showMessage = function(messageIn) {
	document.getElementById('message').innerHTML = messageIn;	
}
game.no_canvas.view.prototype.clearButtons = function() { //remove any previous buttons that existed
    var myNode = document.getElementById("buttons");
    while (myNode.firstChild) { myNode.removeChild(myNode.firstChild); }
}
game.no_canvas.view.prototype.clearInput = function() { //remove any previous inputs that existed
    var myNode = document.getElementById("input");
	while (myNode.firstChild) { myNode.removeChild(myNode.firstChild); }
}
game.no_canvas.view.prototype.createButton = function(text) { //possibly button object in own right???
    	var btn = document.createElement("BUTTON");
        btn.appendChild(document.createTextNode(text)); 
	    btn.event = new Event(this);
		return btn;
}