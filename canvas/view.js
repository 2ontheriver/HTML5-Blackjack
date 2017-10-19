

var gameFont = "Arial";


game.canvas.view = function(blackjackIn){ //View 

	//add the canvases and the get the context objects for drawing on the canvases
	this.cashierCanvas = addCanvas(1);
	this.cashierLayer = getCanvasContext(this.cashierCanvas);
	this.dealerCardsCanvas = addCanvas(5);
	this.dealerCardsLayer = getCanvasContext(this.dealerCardsCanvas);
	this.playerCardsCanvas = addCanvas(4);
	this.playerCardsLayer = getCanvasContext(this.playerCardsCanvas);
	this.deckCanvas = addCanvas(10);
	this.deckLayer = getCanvasContext(this.deckCanvas);
	this.messageCanvas = addCanvas(8);
	this.messageLayer = getCanvasContext(this.messageCanvas);
	this.buttonCanvas = addCanvas(2);
	this.buttonLayer = getCanvasContext(this.buttonCanvas);
	this.leaveButtonCanvas = addCanvas(2);
	this.leaveButtonLayer = getCanvasContext(this.leaveButtonCanvas);
	this.hitCanvas = addCanvas(2000);
	this.hitLayer = getCanvasContext(this.hitCanvas);
	this.playerBetCanvas = addCanvas(6);
	this.playerBetLayer = getCanvasContext(this.playerBetCanvas);
	this.playerBetCanvas2 = addCanvas(6);
	this.playerBetLayer2 = getCanvasContext(this.playerBetCanvas2);
	this.insuranceBetCanvas = addCanvas(7);
	this.insuranceBetLayer = getCanvasContext(this.insuranceBetCanvas);

    this.blackjack = blackjackIn;
	this.cardImages = [];
	this.lookup = {}; //creates an object referncing the cardImages array so they can be choosen by name
	this.unplacedBets = 0;
	this.cardDealTime = 1000;
	this.plyrMveCrd = { 'x' : 18, 'y' : -18};
	this.plyrDealCrdPos; //set in deal, so it is reset every hand
	this.dlrStrtCrdPos;  //set in deal, so it is reset every hand
	var sources = [];
	for(num = 0; num < 52; num++){
		sources.push(this.blackjack.deck.cards[num].suit + '_' + this.blackjack.deck.cards[num].value);    
	}
	this.loadCardImages = function(callback) {
		var loadedImages = 0;
		var numImages = 0;
		for(var src in sources) { // get num of sources
			numImages++;
		}
		for(var src in sources) {
		    var source = game.imageLocation + 'cards/' + sources[src] + '.png'; 
			this.cardImages[src] = new Image();
		    this.cardImages[src].name = sources[src];
			this.lookup[this.cardImages[src].name] = this.cardImages[src];
			this.cardImages[src].onload = function() {
				if(++loadedImages >= numImages) {
					if(callback !== undefined) callback();
				}
			};
			this.cardImages[src].src = source;
		}
	}
	
    this.nameInput = document.createElement("INPUT");
	this.nameInput.id = "name_input";
	this.nameInput.maxLength  = 10;
	this.nameInput.startValue = "enter name";
	//this.rect.left;
	//this.rect.top;

	/*
	var viewportOffset = this.hitCanvas.getBoundingClientRect();
// these are relative to the viewport, i.e. the window
var top = viewportOffset.top;
var left = viewportOffset.left;
	
	alert('left : ' + this.rect.left + ' top: ' + this.rect.top + 
	'\n left : ' + left + ' top: ' + top);
*/
	var btnHeigth = 50;
	var btnTop = 520;
    this.buttons = {
	'start' : { text : 'Take Seat', colour: '#ccffff', width: 140, height: btnHeigth, top: btnTop, left: 390, event : new Event(this) },
	'deal' : { text : 'Deal', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 340, event : new Event(this) },
	'clear' : { text : 'Clear', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 470, event : new Event(this) },
	'double' : { text : 'Double', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 210, event : new Event(this) },
	'hit' : { text : 'Hit', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 340, event : new Event(this) },
	'stand' : { text : 'Stand', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 470, event : new Event(this) },
	'split' : { text : 'Split', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 600, event : new Event(this) },
	'leave' : { text : 'Leave Table', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 10, event : new Event(this) },
	'yes' : { text : 'Yes', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 340, event : new Event(this) },
	'no' : { text : 'No', colour: '#ccffff', width: 120, height: btnHeigth, top: btnTop, left: 470, event : new Event(this) },
	'new_hand' : { text : 'New Hand', colour: '#ccffff', width: 170, height: btnHeigth, top: btnTop, left: 195, event : new Event(this) }, 
	're_bet' : { text : 'Re-Bet', colour: '#ccffff', width: 170, height: btnHeigth, top: btnTop, left: 375, event : new Event(this) }, 
	're_bet_deal' : { text : 'Re-Bet & Deal', colour: '#ccffff', width: 170, height: btnHeigth, top: btnTop, left: 555, event : new Event(this) }
	};
	this.chipWrapper = { chips : chips, event : new Event(this) };
	var _this = this;
	
	//attach model listeners
    this.blackjack.gameStarting.attach(function (){ _this.startGame(); }); 
	this.blackjack.dealingHand.attach(function (){ _this.dealGame(); }); 
	this.blackjack.offerUserInsurance.attach(function (sender, msg){ _this.offerInsurance(msg); });
	this.blackjack.insuranceClosed.attach(function (){ _this.closeInsurance(); });
	this.blackjack.userCardDealt.attach(function (sender, args){ _this.updatePlayerHand(args); });
	this.blackjack.userShowOptions.attach(function (){ _this.showHandOptions(); });
	this.blackjack.dealerCardDealt.attach(function (sender, args){ _this.updateDealerHand(args); });
	this.blackjack.userHandBust.attach(function (){ _this.playerBust(); });
	this.blackjack.userHandStood.attach(function (){ _this.playerStand(); });
	this.blackjack.userDoubled.attach(function (sender, args){ _this.playerDoubled(args); });
	this.blackjack.userSplit.attach(function (){ _this.playerSplit(); });
	this.blackjack.showCompareHandsResult.attach(function (sender, args){ _this.showHandResult(args); });
	this.blackjack.userMessage.attach(function (sender, msg){ _this.showMessage(msg); });
	this.blackjack.gameEnding.attach(function (sender, msg){ _this.endGame(msg); });	
	this.blackjack.userBalanceChange.attach(function (){ _this.drawCashier(); });  
	this.blackjack.settleInsurance.attach(function (sender, win){ _this.settleInsuranceBet(win); });   
	
	//attach listeners to areas of the hit canvas 
	this.startClicked = function(event){ 
		if(_this.isClickOnButton(event, _this.buttons.start)) _this.buttons.start.event.notify();
	}
	this.isClickOnButton = function(event, buttonIn){
		var rect = game.HTMLElement.getBoundingClientRect();
		var x = event.clientX - rect.left,
		y = event.clientY - rect.top;
		//use the game.scaleRatio variable to scale the click onto the default hitmap
		x /= game.scaleRatio; 
		y /= game.scaleRatio;
		/*
		alert('bounding rectangle left = ' + rect.left + ' top = ' + rect.top + 
		'\n x = ' + x + ' y = ' + y + 
		'\n rect.left = ' + rect.left + ' rect.top = ' + rect.top + '\n' + 
		' x = ' +  buttonIn.left + '+' + buttonIn.width + 'y = ' + buttonIn.top + '+' + buttonIn.height);
		*/
		if(y > buttonIn.top && y < buttonIn.top + buttonIn.height && x > buttonIn.left && x < buttonIn.left + buttonIn.width) return true;
		return false;
	}
	this.leaveClicked = function(event){ 
		if(_this.isClickOnButton(event, _this.buttons.leave)) _this.buttons.leave.event.notify();
	}
	this.dealClicked = function(event){
	    if(_this.isClickOnButton(event, _this.buttons.deal)){
		 _this.buttons.deal.event.notify();
		 }
	    else if(_this.isClickOnButton(event, _this.buttons.clear)) _this.buttons.clear.event.notify();
	}
	this.insuranceAnswerClicked = function(event){
	    if(_this.isClickOnButton(event, _this.buttons.yes)) _this.buttons.yes.event.notify();
	    else if(_this.isClickOnButton(event, _this.buttons.no)) _this.buttons.no.event.notify();
	}
	this.optionButtonClicked = function(event){	
		var handOptions = _this.blackjack.getHandOptions(); //get the current hand options to only check listeners for the current buttons
		if(handOptions){
			for (var i = 0; i < handOptions.length; i++) {
				if(_this.isClickOnButton(event, _this.buttons[handOptions[i]])) _this.buttons[handOptions[i]].event.notify();	
			}
		}
	}
	this.newHandOptionClicked = function(event){
	    if(_this.isClickOnButton(event, _this.buttons.new_hand)) _this.buttons.new_hand.event.notify();
	    else if(_this.isClickOnButton(event, _this.buttons.re_bet)) _this.buttons.re_bet.event.notify();
	    else if(_this.isClickOnButton(event, _this.buttons.re_bet_deal)) _this.buttons.re_bet_deal.event.notify();
	}
	this.chipClicked = function(event){ 
		var rect = game.HTMLElement.getBoundingClientRect();
		var x = event.clientX - rect.left,
		y = event.clientY - rect.top;
		//use the game.scaleRatio variable to scale the click onto the default hitmap
		x /= game.scaleRatio; 
		y /= game.scaleRatio;
		_this.chipWrapper.chips.forEach(function(element) {
			var yDist = x - element.x;
			var xDist = y - element.y;
			var dist = Math.sqrt(yDist*yDist + xDist*xDist);
			if (dist < element.size) {
				_this.chipWrapper.event.notify(element.value);
			  //_this.blackjack.placeBet(element.value); //this should notify the controller to invoke the change on the model
			}
		});
	}

	this.prepareGame = function() {
		var rect = this.cashierCanvas.getBoundingClientRect();
		var gSR = game.scaleRatio;
		var inputWidth = (120*game.scaleRatio);
		var leftPos = (game.width/2)-(inputWidth/2);
		this.nameInput.style.cssText = 'left:' + leftPos + 'px; top: ' + (380*gSR) + 'px; z-index: 2100; width: ' + inputWidth + 'px; height: ' + (25*gSR) + 'px; line-height: ' + (25*gSR) + 'px; font-size: ' + (19*gSR) + 'px; font-family: ' + gameFont + ';';
		game.HTMLElement.appendChild(this.nameInput);
		this.nameInput.placeholder = "your name";
		this.nameInput.onmousedown = function(){
		  this.focus(); //This is due to onmousedown function being ignored on the blackajck div
		};
		this.showMessage('Enter your name and click \'Take Seat\'.');
		this.renderButton(this.buttons.start);
		this.hitCanvas.addEventListener("click", this.startClicked);
		//attach the html listener here
		this.loadCardImages(function() {
			_this.drawCardFan();
		});
	}
	this.dealGame = function() {
		this.plyrDealCrdPos = [{ 'x' : 427, 'y' : 285}, {'x' : 507, 'y' : 295}, {'x' : 347, 'y' : 295}];
		this.dlrStrtCrdPos = { 'x' : 427, 'y' : 30}; 
		this.updateBettingBox();
		this.messageLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
		this.buttonLayer.clearRect(0, 0, this.buttonCanvas.width, this.buttonCanvas.height);
		this.hitCanvas.removeEventListener("click", this.newHandOptionClicked);
		this.playerCardsLayer.clearRect(0, 0, this.playerCardsCanvas.width, this.playerCardsCanvas.height);
		this.dealerCardsLayer.clearRect(0, 0, this.dealerCardsCanvas.width, this.dealerCardsCanvas.height);
		this.playerCardsLayer.drawImage(this.lookup[this.blackjack.user.hands[0].cards[0].getName()],this.plyrDealCrdPos[0].x,this.plyrDealCrdPos[0].y);
		this.dealerCardsLayer.drawImage(this.lookup[this.blackjack.dealer.cards[0].getName()],this.dlrStrtCrdPos.x,this.dlrStrtCrdPos.y);
		this.plyrDealCrdPos[0].x += this.plyrMveCrd.x;
		this.plyrDealCrdPos[0].y += this.plyrMveCrd.y;
		this.playerCardsLayer.drawImage(this.lookup[this.blackjack.user.hands[0].cards[1].getName()],this.plyrDealCrdPos[0].x,this.plyrDealCrdPos[0].y); 
	}
}
game.canvas.view.prototype.startGame = function() {
	this.updateBettingBox();
	if(this.cardImages.length < 1) this.loadCardImages(); //if the card images were not loaded in the prepareGame() method
	if(game.HTMLElement.contains(this.nameInput)) game.HTMLElement.removeChild(this.nameInput);
	this.deckLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	this.messageLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	this.buttonLayer.clearRect(0, 0, this.buttonCanvas.width, this.buttonCanvas.height);
	this.playerCardsLayer.clearRect(0, 0, this.playerCardsCanvas.width, this.playerCardsCanvas.height);
	this.dealerCardsLayer.clearRect(0, 0, this.dealerCardsCanvas.width, this.dealerCardsCanvas.height);
	this.hitCanvas.removeEventListener("click", this.startClicked);
	this.hitCanvas.removeEventListener("click", this.newHandOptionClicked);
	if(this.blackjack.user.balance >= this.blackjack.minBet){
		this.showMessage(this.blackjack.user.name + ' click on the chips, to add them to your bet.');
		this.renderButton(this.buttons.deal);
		this.renderButton(this.buttons.clear);
		this.hitCanvas.addEventListener("click", this.dealClicked);
		this.hitCanvas.addEventListener("click", this.chipClicked);
	} else {
		this.showMessage('Game Over. You have less than the minimum bet. Click \'Leave\'');
	}
	this.drawLeaveTableButton();
	this.hitCanvas.addEventListener("click", this.leaveClicked);
	this.drawCashier();
	this.drawDeck();
}
game.canvas.view.prototype.updateBettingBox = function(clear) {
    if(clear === undefined) clear = false
	this.playerBetLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	this.playerBetLayer2.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	this.insuranceBetLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	if(clear || (this.unplacedBets == 0 && this.blackjack.startingBet == 0)) return;
	this.drawChips(0); 
}
game.canvas.view.prototype.showHandResult = function(handResults) {
    this.buttonLayer.clearRect(0, 0, this.buttonCanvas.width, this.buttonCanvas.height);
    this.showMessage(handResults.message);
	this.renderButton(this.buttons.new_hand);
	this.renderButton(this.buttons.re_bet);
	this.renderButton(this.buttons.re_bet_deal);
	this.hitCanvas.addEventListener("click", this.newHandOptionClicked);
	this.hitCanvas.removeEventListener("click", this.optionButtonClicked);
	//deal with payouts
	if(handResults.handsInfo[0][0] == 1) this.playerBetLayer.clearRect(0, 0, this.playerBetCanvas.width, this.playerBetCanvas.height);
	if(this.blackjack.user.hasSplit()){
		if(handResults.handsInfo[1][0] == 1) this.playerBetLayer2.clearRect(0, 0, this.playerBetCanvas.width, this.playerBetCanvas.height);
		if(handResults.handsInfo[0][0] == 2){
			this.drawChips(1, false, 1);
			if(handResults.handsInfo[0][1]) this.drawChips(1, true, 1);
		}
		if(handResults.handsInfo[1][0] == 2){
			this.drawChips(2, false, 1);
			if(handResults.handsInfo[1][1]) this.drawChips(2, true, 1);
		}
	} else {
		if(handResults.handsInfo[0][0] == 2){
			this.drawChips(0, false, 1);
			if(handResults.handsInfo[0][1]) this.drawChips(0, true, 1);
		} else if(handResults.handsInfo[0][0] == 3) this.drawChips(0, false, 1.5);
	}
	
}
//hand is either 0 (standard hand), 1 (split hand 1), 2 (split hand 2), doubled is bool
//winnings is either 0 for not using field, 1 for yes, and 1.5 if playerBJ and winnings paid at 1.5
game.canvas.view.prototype.drawChips = function(handNo, doubled, winnings) { 
	if(doubled === undefined) doubled = false;
	if(winnings === undefined) winnings = 0;
	var placedBet = false;
	var layer = this.playerBetLayer;
	if(this.blackjack.user.hands[0].cards.length > 0) placedBet = true;
	var position;
	if(handNo === undefined) handNo = 0;
	if(handNo == 0) position = { 'x' : 460, 'y' : 400 };
	else if(handNo == 1) position = { 'x' : 540, 'y' : 405 };
	else if(handNo == 2){
		position = { 'x' : 380, 'y' : 405 };
		layer = this.playerBetLayer2;
	}
	if(doubled) position.y += 37;
	layer.save();
	if(winnings != 0) position.x -= 37;
	layer.translate(position.x, position.y); //set the start point for drawing chips in the betting box
	var bet = this.unplacedBets;
	if(placedBet) bet = this.blackjack.startingBet
	else this.drawBetNote(this.unplacedBets); 
	if(winnings == 1.5) bet = (bet*winnings); 
	var chipsInBetBox = [];
	for(var num = 0; num < 4; num++){
	    chipsInBetBox[num] = Math.floor(bet/chips[num].value);
	    bet -= (chipsInBetBox[num]*chips[num].value);
	}
	var chipsDrawn = 0;
	for(var num = 0; num < 4; num++){
		for(var cNum = 0; cNum < chipsInBetBox[num]; cNum++){
			drawChip(layer, chips[num]);
			layer.translate(0, -3); //each time a chip is drawn move the drawing position 4px up
			chipsDrawn++; //keep a counter of all the chips drawn to reset the drawing position
		}
	}
	layer.restore();	
}
game.canvas.view.prototype.placeInsuranceBet = function(winnings) { //if winnigns == true then draw the chips to represent winning
	this.insuranceBetLayer.save();
	if(winnings === undefined) winnings = false;
	if(winnings) this.insuranceBetLayer.translate(423, 230); //set the start point for drawing chips in the insurance curve
	else this.insuranceBetLayer.translate(460, 230); //set the start point for drawing chips in the insurance curve
	var bet = this.blackjack.insuranceBet;
	if(winnings) bet += this.blackjack.insuranceBet; //double the amount if paying out
	var chipsInBetBox = [];
	chipsInBetBox[4] = (bet % 1 == 0.5 ? 1 : 0);
	for(var num = 0; num < 4; num++){
	    chipsInBetBox[num] = Math.floor(bet/chips[num].value);
	    bet -= (chipsInBetBox[num]*chips[num].value);
	}
	var chipsDrawn = 0;
	for(var num = 0; num < 5; num++){
		for(var cNum = 0; cNum < chipsInBetBox[num]; cNum++){
			this.insuranceBetLayer.fillStyle = chips[num].color;
			drawChip(this.insuranceBetLayer, chips[num]);
			this.insuranceBetLayer.translate(0, -3); //each time a chip is drawn move the drawing position 4px up
			chipsDrawn++; //keep a counter of all the chips drawn to reset the drawing position
		}
	}
	this.insuranceBetLayer.restore();
}
game.canvas.view.prototype.drawBetNote = function(betAmount) {
	var noteLength = 10+(betAmount.toString().length * 6);
    this.playerBetLayer.beginPath();
	this.playerBetLayer.fillStyle = '#ddd';
	this.playerBetLayer.strokeStyle = '#333';
	this.playerBetLayer.lineWidth = 1;
	this.playerBetLayer.rect(-40-(noteLength/2), -25, noteLength, 18);
	this.playerBetLayer.fill();
	this.playerBetLayer.stroke();
	this.playerBetLayer.font = "12px " + gameFont;
	this.playerBetLayer.fillStyle = '#222';
	this.playerBetLayer.textAlign = "center";
	this.playerBetLayer.textBaseline = 'middle';
	this.playerBetLayer.fillText(betAmount, -40, -15);
}
game.canvas.view.prototype.offerInsurance = function(messageIn) {
	this.hitCanvas.removeEventListener("click", this.dealClicked);
	this.hitCanvas.removeEventListener("click", this.chipClicked);
	this.showMessage(messageIn);
	this.renderButton(this.buttons.yes);
	this.renderButton(this.buttons.no);
	this.hitCanvas.addEventListener("click", this.insuranceAnswerClicked);
}
game.canvas.view.prototype.closeInsurance = function() {
	this.hitCanvas.removeEventListener("click", this.dealClicked);
	this.hitCanvas.removeEventListener("click", this.chipClicked);
	this.hitCanvas.removeEventListener("click", this.insuranceAnswerClicked);
    this.messageLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
    if(this.blackjack.insuranceBet != 0) {
	    this.placeInsuranceBet();
	}
}
game.canvas.view.prototype.showHandOptions = function() {	
    this.buttonLayer.clearRect(0, 0, this.buttonCanvas.width, this.buttonCanvas.height);
	var handOptions = this.blackjack.getHandOptions();
	if(handOptions){
		for (var i = 0; i < handOptions.length; i++) {
			this.renderButton(this.buttons[handOptions[i]]);
		}	
		this.hitCanvas.addEventListener("click", this.optionButtonClicked);
	} else 
	    this.hitCanvas.removeEventListener("click", this.optionButtonClicked);
}
game.canvas.view.prototype.updatePlayerHand = function(args) {// args.card, args.handNo, args.cardNo, args.hasSplit, args.doubled - available properties
    var handPos;
	if(!args.hasSplit) handPos = this.plyrDealCrdPos[0];
	else if(args.handNo == 0) handPos = this.plyrDealCrdPos[1];
	else if(args.handNo == 1) handPos = this.plyrDealCrdPos[2];
	handPos.x += this.plyrMveCrd.x;
	handPos.y += this.plyrMveCrd.y;
	this.playerCardsLayer.save();
	this.playerCardsLayer.translate(handPos.x, handPos.y);
	var image = this.lookup[args.card.getName()];
	if(args.doubled){
	    this.playerCardsLayer.rotate(-90 * Math.PI/180);
		this.playerCardsLayer.drawImage(image, -(image.width), 0);
	}
	else 
	    this.playerCardsLayer.drawImage(image, 0, 0);
	this.playerCardsLayer.restore();
	
}
game.canvas.view.prototype.updateDealerHand = function(args) {
	var cardDealt = args.cardNo; 
	this.dealerCardsLayer.clearRect(0, 0, this.dealerCardsCanvas.width, this.dealerCardsCanvas.height);
	if(cardDealt % 2 == 1) this.dlrStrtCrdPos.x = 464+((cardDealt-1)/2)*70;
	else if(cardDealt % 2 == 0) this.dlrStrtCrdPos.x = 497+((cardDealt-2)/2)*70;
	for(var i = 0; i < this.blackjack.dealer.cards.length; i++){
	    this.dealerCardsLayer.drawImage(this.lookup[this.blackjack.dealer.cards[i].getName()],this.dlrStrtCrdPos.x-(i*70),this.dlrStrtCrdPos.y);
	}
}
game.canvas.view.prototype.playerBust = function() { //remove the chips for the current hand when bust
	var handNo = this.blackjack.user.getCurrentHandNo();
	var layer = (handNo == 0 ? this.playerBetLayer : this.playerBetLayer2);
	layer.clearRect(0, 0, this.playerBetCanvas.width, this.playerBetCanvas.height);
}
game.canvas.view.prototype.playerStand = function() {
    this.buttonLayer.clearRect(0, 0, this.buttonCanvas.width, this.buttonCanvas.height);
	this.hitCanvas.removeEventListener("click", this.optionButtonClicked);
}
game.canvas.view.prototype.playerDoubled = function(args) {
    var handNo; //this will be set to either; 0 (standard hand), 1 (split hand 1, left hand), 2 (split hand 2, rigth hand)
	if(!args.hasSplit) handNo = 0;
	else if(args.handNo == 0) handNo = 1;
	else if(args.handNo == 1) handNo = 2;
    this.drawChips(handNo, true); 
}
game.canvas.view.prototype.playerSplit = function() {
	this.playerCardsLayer.clearRect(0, 0, this.playerCardsCanvas.width, this.playerCardsCanvas.height);
	this.playerCardsLayer.drawImage(this.lookup[this.blackjack.user.hands[0].cards[0].getName()],this.plyrDealCrdPos[1].x,this.plyrDealCrdPos[1].y);
	this.playerCardsLayer.drawImage(this.lookup[this.blackjack.user.hands[1].cards[0].getName()],this.plyrDealCrdPos[2].x,this.plyrDealCrdPos[2].y);
	this.plyrDealCrdPos[1].x += this.plyrMveCrd.x;
	this.plyrDealCrdPos[1].y += this.plyrMveCrd.y;
	this.playerCardsLayer.drawImage(this.lookup[this.blackjack.user.hands[0].cards[1].getName()],this.plyrDealCrdPos[1].x,this.plyrDealCrdPos[1].y);
	this.playerBetLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	this.drawChips(1);
	this.drawChips(2); 
	if(this.blackjack.insuranceBet > 0) this.placeInsuranceBet(); //if there was an insurance bet, then redraw that as it was removed above
}
game.canvas.view.prototype.settleInsuranceBet = function(win) {
	if(win){
		//draw an extra insurance bet to the left of the exisiting bet
		this.placeInsuranceBet(true);
	} else this.insuranceBetLayer.clearRect(0, 0, this.insuranceBetCanvas.width, this.insuranceBetCanvas.height);
}
game.canvas.view.prototype.endGame = function(messageIn) {
	this.showMessage(messageIn);
	
}
game.canvas.view.prototype.renderButton = function(button) {
	var borderWidth = 4.5;
	this.buttonLayer.fillStyle = "rgba(255, 255, 255, 1)";
	this.buttonLayer.strokeStyle = "#444";
	this.buttonLayer.lineWidth = 1;
	roundRect(this.buttonLayer, button.left, button.top, button.width, button.height, 10, true);
	var grd=this.buttonLayer.createLinearGradient(button.left+borderWidth,button.top+borderWidth,button.left+borderWidth,button.top+(button.height-borderWidth*2));
	grd.addColorStop(0,"#00005E");
	grd.addColorStop(1, "#0000D9");
	this.buttonLayer.fillStyle=grd;
	this.buttonLayer.strokeStyle = "#00004d";
	roundRect(this.buttonLayer, button.left+borderWidth, button.top+borderWidth, button.width-borderWidth*2,  button.height-borderWidth*2, 10, true);
	this.buttonLayer.save();
	this.buttonLayer.globalAlpha=0.5;
	var grd=this.buttonLayer.createLinearGradient(button.left+borderWidth,button.top+borderWidth,button.left+borderWidth,button.top+(button.height/2-borderWidth*2));
	grd.addColorStop(0,"#ccccff");
	grd.addColorStop(1, "#6666ff");
	this.buttonLayer.fillStyle=grd;
	roundRect(this.buttonLayer, button.left+borderWidth, button.top+borderWidth, button.width-borderWidth*2,  button.height/2-borderWidth, 10, true, false);
	this.buttonLayer.restore();
	this.buttonLayer.fillStyle='white';
	this.buttonLayer.textAlign = 'center';
	this.buttonLayer.textBaseline="middle"; 
	this.buttonLayer.font = "22px Arial";
	this.buttonLayer.fillText(button.text, button.left+(button.width/2), button.top+(button.height/2));
}
game.canvas.view.prototype.drawDeck = function(){ 
	var backOfCard = new Image();
	backOfCard.src = game.imageLocation + 'cards/blue_back.png';
	//thisdecklayer is assigned to a property of the backOfCard so that when image loads it will have the context to draw it 
	backOfCard.deckLayer = this.deckLayer; 
	backOfCard.onload = function(){
		var ang = -45*Math.PI/180;
		this.deckLayer.translate(845, 15);
		this.deckLayer.rotate(ang);
	    this.deckLayer.drawImage(this, 0, 0);
		this.deckLayer.rotate(-ang);
		this.deckLayer.translate(-845, -15);
	}
}
game.canvas.view.prototype.drawCardFan = function(){ 
	var ang;
	var cFRadius = 435;
    this.deckLayer.translate(460, -180);//set the center point for drawing the circles
	var degreeMove = 1.8; //degree of angle move since the last card
	var startDegree = 138.5; //degree to draw the first card at
	this.deckLayer.lineWidth = 1.5;
	this.deckLayer.strokeStyle = "#ccffcc";
	this.deckLayer.fillStyle = "#000";
	this.cardImages.reverse();
	for(var num = 0; num < 52; num++){
		ang = (num*degreeMove+startDegree) * Math.PI / 180;
		this.deckLayer.rotate(ang);
		this.deckLayer.translate(0, -cFRadius);
		this.deckLayer.rotate(Math.PI);
		this.deckLayer.drawImage(this.cardImages[num],0,0);
		this.deckLayer.rotate(-Math.PI);
		this.deckLayer.translate(0, cFRadius);
		this.deckLayer.rotate(-ang);
	}
    this.deckLayer.translate(-460, 180); //reset the start point for this.deckLayer
}
game.canvas.view.prototype.drawCashier = function(balanceIn){
    this.cashierLayer.clearRect(0, 0, this.cashierCanvas.width, this.cashierCanvas.height);
    this.cashierLayer.beginPath();
    this.cashierLayer.rect(770, 450, 140, 120);
	this.cashierLayer.lineWidth = 2;
	this.leaveButtonLayer.lineWidth = 1;
	this.cashierLayer.strokeStyle = '#444';
    this.cashierLayer.fillStyle = '#fff';
    this.cashierLayer.fill();
    this.cashierLayer.stroke();
    this.cashierLayer.fillStyle = '#B3A75D';
    this.cashierLayer.fillRect(774.5, 514.5, 131, 26);
	this.cashierLayer.textBaseline="middle"; 
	this.cashierLayer.textAlign = 'center';
	this.cashierLayer.font = "Bold 20px Arial";
    this.cashierLayer.fillRect(774.5, 454.5, 131, 26);
    this.cashierLayer.fillStyle = '#000';
	this.cashierLayer.fillText(this.blackjack.user.balance, 840, 555);
	this.cashierLayer.fillText(this.blackjack.getTotalBet(), 840, 495);
	this.cashierLayer.fillStyle = '#fff';
	this.cashierLayer.font = "Bold 15px " + gameFont;
	this.cashierLayer.fillText('BETS', 840, 468);
	this.cashierLayer.fillText('CASHIER', 840, 528);
}
game.canvas.view.prototype.drawLeaveTableButton = function(){ 
	var borderWidth = 4.5;
	var leaveButton = this.buttons.leave;
    this.leaveButtonLayer.rect(leaveButton.left, leaveButton.top, leaveButton.width, leaveButton.height);
	this.leaveButtonLayer.lineWidth = 1;
	this.leaveButtonLayer.strokeStyle = '#444';
    this.leaveButtonLayer.fillStyle = '#fff';
    this.leaveButtonLayer.stroke();
    this.leaveButtonLayer.fill();
    this.leaveButtonLayer.beginPath();
    this.leaveButtonLayer.fillStyle = '#B3A75D';
    this.leaveButtonLayer.fillRect(leaveButton.left+borderWidth, leaveButton.top+borderWidth, leaveButton.width-(borderWidth*2), leaveButton.height-(borderWidth*2));
    this.leaveButtonLayer.beginPath();
	this.leaveButtonLayer.save();
	this.leaveButtonLayer.strokeStyle = '#fff';
    this.leaveButtonLayer.fillStyle = '#fff';
	this.leaveButtonLayer.translate(25, 545);
	this.leaveButtonLayer.moveTo(0,0);
	this.leaveButtonLayer.lineTo(10,10);
	this.leaveButtonLayer.lineTo(10,2);
	this.leaveButtonLayer.lineTo(25,2);
	this.leaveButtonLayer.lineTo(25,-2);
	this.leaveButtonLayer.lineTo(10,-2);
	this.leaveButtonLayer.lineTo(10,-10);
	this.leaveButtonLayer.closePath();
    this.leaveButtonLayer.stroke();
    this.leaveButtonLayer.fill();
	this.leaveButtonLayer.restore();
    this.leaveButtonLayer.fillStyle = '#fff';
	this.leaveButtonLayer.textBaseline="middle"; 
	this.leaveButtonLayer.textAlign = 'center';
	this.leaveButtonLayer.font = "22px " + gameFont;
	this.leaveButtonLayer.fillText('Leave', 85, this.buttons.leave.top+(this.buttons.leave.height/2));
}
game.canvas.view.prototype.showMessage = function(messageIn) {
	this.messageLayer.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
	var length = (messageIn.length * 7 + 40);	
	var startLeft = (this.messageCanvas.width-length)/2;
	var startTop = 484;
	this.messageLayer.beginPath();
	this.messageLayer.fillStyle = '#fff';
	this.messageLayer.strokeStyle = '#222';
	this.messageLayer.lineWidth = 1;
	this.messageLayer.rect(startLeft, startTop, length, 26);
	this.messageLayer.fill();
	this.messageLayer.stroke();
	this.messageLayer.font = "16px " + gameFont;
	this.messageLayer.fillStyle = '#222';
	this.messageLayer.textAlign = "center";
	this.messageLayer.textBaseline = 'middle';
	this.messageLayer.fillText(messageIn, this.messageCanvas.width/2, startTop+13); 
}