

game.no_canvas.background = function(){

	function addElement(elmType, elmId, display){
		var elm = document.createElement(elmType);
		if (typeof elmId !== 'undefined') elm.setAttribute('id', elmId);
		if (typeof display !== 'undefined' && (!display)) elm.style.display = 'none';
		return elm;
	}

	function addTextElement(elmType, text){
		var elm = document.createElement(elmType);
		elm.appendChild(document.createTextNode(text));
		return elm;
	}

	var noCanvasBlackjack = addElement('div', 'no_canvas_container');
	noCanvasBlackjack.style.width = game.width + 'px';
	noCanvasBlackjack.style.height = game.height + 'px';

	noCanvasBlackjack.append(addTextElement("h1", "Blackjack Game"));

	var playerBets = addElement('p', 'player_bets');
	playerBets.append(addElement('span', 'bet'));
	playerBets.append(addElement('span', 'insurance_bet'));
	noCanvasBlackjack.append(playerBets);

	noCanvasBlackjack.append(addElement('div', 'input'));

	var gameContainer = addElement('div', 'game_container', 0);
	var dealerHand = addElement('p', 'dealer_hand');
	dealerHand.append(addTextElement("strong", "Dealers Hand:"));
	dealerHand.append(addElement('span', 'dealers_cards'));
	gameContainer.append(dealerHand);
	var playerHand = addElement('p', 'hand');
	playerHand.append(addTextElement("strong", "Players Hand:"));
	playerHand.append(addElement('span', 'players_cards'));
	gameContainer.append(playerHand);
	var playerHand2 = addElement('p', 'hand2', 0);
	playerHand2.append(addTextElement("strong", "Players Hand 2:"));
	playerHand2.append(addElement('span', 'players_cards2'));
	gameContainer.append(playerHand2);
	noCanvasBlackjack.append(gameContainer);

	noCanvasBlackjack.append(addElement('p', 'message'));

	noCanvasBlackjack.append(addElement('div', 'buttons'));

	var cashierContainer = addElement('p', 'cashier_container', 0);
	cashierContainer.append(addTextElement("strong", "Cashier: "));
	cashierContainer.append(addElement('span', 'cashier'));
	noCanvasBlackjack.append(cashierContainer);

	noCanvasBlackjack.append(addElement('div', 'leave_button'));
	
	game.HTMLElement.append(noCanvasBlackjack);

}