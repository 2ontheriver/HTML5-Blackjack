//any globals should be attached to relevent namespace .. e.g. canvas globals, should be game.canvas.variableName

var game = {
	canvas : {},
	no_canvas : {},
	standardHeight : 580,
	height : 580,
	standardWidth : 920,
	width : 920,
	scaleRatio : 1,
	forceNoCanvas : false,
	HTMLElement : null,
	startingChips : 10000,
	imageLocation : 'images/'
};

//elementId must be defined and there must be a div element on the page with this id. all other params are optional
function blackjackGame(elementId, appLocation, width, chips, forceNoCanvas) {
	
	game.HTMLElement = document.getElementById(elementId);
	if(typeof width !== 'undefined'){
		if(width > 2000) width = 200;
		if(width < 200) width = 200;
		var ratio = game.standardWidth / game.standardHeight;
		game.width = width;
		game.height = game.width / ratio;
		game.HTMLElement.style.width = game.width + "px";
		game.HTMLElement.style.height = game.height + "px";
		game.scaleRatio = game.width / game.standardWidth; 
	}
	
	if(typeof appLocation !== 'undefined') game.imageLocation = appLocation + game.imageLocation;
	
	if(typeof chips !== 'undefined') game.startingChips = chips;
	
	if(typeof forceNoCanvas !== 'undefined') game.forceNoCanvas = forceNoCanvas;
	
	//Test for the use of canvas and then create either canvasController or noCanvasController
	if (!game.forceNoCanvas && isCanvasSupported()){
		//If canvas
		new game.canvas.background;
		var canvasController = new game.canvas.controller(new game.canvas.view(new game.blackjack()));
		canvasController.prepareGame();
	} else {	
		//If no canvas
		new game.no_canvas.background;
		var noCanvasController = new game.no_canvas.controller(new game.no_canvas.view(new game.blackjack()));
		noCanvasController.prepareGame();
	}
	
};


