
//vars used in this file
var halfGameWidth = game.width / 2;

//This background.js could be converted to a function for Background like Interface and Contorller 
// var chips below is also used in Interface, as id the functions for adding canvases

//radius for the table arcs
var gRadius = 700;
var wRadius = 728;
var cRadius = 804;
var cRRadius = 756;
var bRadius = 575;
var wORadius = 430;
var wIRadius = 390;
var t1Radius = 420;
var t2Radius = 376;
var t3Radius = 350;

var chips = [
{ color : '#C47F00', borderColor : '#803300', value : 100, size: 18 }, { color : '#006bb3', borderColor : '#1D1DF5', value : 25, size: 18 },
{ color : '#A83636', borderColor : '#990000', value : 5, size: 18 }, { color : '#A8A800', borderColor : '#666600', value : 1, size: 18 }, 
{ color : '#00b300', borderColor : '#008000', value : 0.5, size: 18, x : -100, y : -100 }
]; //last button is the 0.5 chip for insurance of an odd number, x and y are set negative so that the chip does not produce a hit area

//canvas elements and their context objects for drawing
var bg_floor;
var flr;
var bg_table;
var tbl;

function canvasNoHighlight(){
	document.getElementById('blackjack').onmousedown = function(){
	  return false;
	};
}
game.canvas.background = function(){
	canvasNoHighlight();
	bg_floor = addCanvas();
	flr = getCanvasContext(bg_floor);
	bg_table = addCanvas();
	tbl = getCanvasContext(bg_table);
	drawCarpetPattern();
	tbl.translate(halfGameWidth, -180);//set the center point for drawing the circles
	drawGreenTable();
	drawWoodStrip();
	drawCushion();
	drawCushionRim();
	drawTextLines();
	drawText();
	drawBoxes();
	drawChips();
	tbl.setTransform(1, 0, 0, 1, 0, 0); //reset the position from the center of the circles back to the (0,0) position (top left).
	drawNote();
	drawChipTray();
}

//addCanvas and get CanvasContext should be added to the background object (function) If I organise this file into one
function addCanvas(zIndex){
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", 920);
	canvas.setAttribute("height", 580);
	canvas.style.width = game.width + "px";
	canvas.style.height = game.height + "px";
	canvas.style.zIndex = zIndex;
	game.HTMLElement.appendChild(canvas); //- currently not workig if appended to the blackjack div(likely to be do to with offset?)
	//document.body.appendChild(canvas);
	return canvas;
}

function getCanvasContext(canvas){
	return canvas.getContext("2d");
}

function drawCarpetPattern(){
	flr.fillStyle = '#993d00';
	flr.fillRect(0, 0, game.standardWidth, game.standardHeight);
	flr.lineWidth = 3;
	flr.strokeStyle = "gold";
	for(var i = 0; i < 1500; i+=50){
		flr.moveTo(i,0);
		flr.lineTo(0,i);
		flr.stroke();
	}	
	for(var i = 0; i < 1500; i+=50){
		flr.moveTo(game.width-i,0);
		flr.lineTo(game.width,i);
		flr.stroke();
	}
}

function drawGreenTable(){ //create 2 gradients one for the edge of the cloth, and one for the light above the table		
	grad = tbl.createRadialGradient(0, 350, 100, 0, 0, 700);
	grad.addColorStop(0, '#009933');
	grad.addColorStop(0.98, '#004d00');
	grad.addColorStop(1, '#003300');
	tbl.fillStyle = grad;
	tbl.arc(0,0,gRadius,0,Math.PI);
	tbl.fill(); 
}

function drawWoodStrip(){ //Wooden Arc for the table
	var woodTextureImage = new Image();
	flr.translate(halfGameWidth, -180);//set the center point for drawing the circles
	flr.beginPath();
	flr.arc(0,0,wRadius,0,Math.PI);
	flr.lineWidth = wRadius*0.08;
	flr.strokeStyle = '#522900';
	flr.stroke();
	woodTextureImage.onload = function() {
		flr.save();
		flr.globalAlpha = 0.4;
		flr.translate(-halfGameWidth, 470);//set the start point for wood texture
		var pattern = flr.createPattern(woodTextureImage, 'no-repeat');
		flr.strokeStyle = pattern;
		flr.stroke();
		flr.restore();
		grad = flr.createRadialGradient(0,0,wRadius*0.96, 0,0,wRadius*1.04);
		grad.addColorStop(0, '#511515');
		grad.addColorStop(0.06, 'transparent');
		grad.addColorStop(0.94, 'transparent');
		grad.addColorStop(1, '#511515');
		flr.strokeStyle = grad;
		flr.stroke();
	};
	woodTextureImage.src = game.imageLocation + 'background/wood_rim.jpg';
}

function drawCushion(){ //Cushion Arc for the table
	tbl.beginPath();
	tbl.arc(0,0,cRadius,0,Math.PI);
	grad = tbl.createRadialGradient(0,0,cRadius*0.94, 0,0,cRadius*1.06);
	grad.addColorStop(0, '#222');
	grad.addColorStop(0.05, '#262626');
	grad.addColorStop(0.3, '#404040');
	grad.addColorStop(0.4, '#333');
	grad.addColorStop(0.6, '#262626');
	grad.addColorStop(1, '#000');
	tbl.strokeStyle = grad;
	tbl.lineWidth = cRadius*0.12;
	tbl.save();
	tbl.shadowColor = "rgba( 0, 0, 0, 0.4 )";
	tbl.shadowOffsetX = 10;
	tbl.shadowOffsetY = 10;
	tbl.shadowBlur = 10;
	tbl.stroke();
	tbl.restore();
}

function drawCushionRim(){ //Cushion Arc for the table
	tbl.beginPath();
	tbl.arc(0,0,cRRadius,0,Math.PI);
	grad = tbl.createRadialGradient(0,0,cRRadius*0.998, 0,0,cRRadius*1.002);
	grad.addColorStop(0, '#4d4100');
	grad.addColorStop(0.4, '#665700');
	grad.addColorStop(1, '#4d4100');
	tbl.strokeStyle = grad;
	tbl.lineWidth = cRRadius*0.004;
	tbl.stroke();
}

function drawTextLines(){ //white Arcs for the message lines
	tbl.beginPath();
	tbl.lineWidth = 2;
	tbl.strokeStyle = '#ccffcc';
	tbl.arc(0,0,wORadius,0.25*Math.PI,0.75*Math.PI);
	tbl.stroke(); 
	tbl.beginPath();
	tbl.arc(0,0,wIRadius,0.25*Math.PI,0.75*Math.PI);
	tbl.stroke(); 
}

function drawText(){
	tbl.font = 'Bold 30px Times New Roman';
	tbl.fillStyle = '#004d00';
	tbl.textAlign = 'center';
	tbl.fillTextCircle('INSURANCE PAYS 2 TO 1', 0,0,t1Radius,0.24*Math.PI,0.745*Math.PI, false);
	tbl.font = 'Bold 18px Times New Roman';
	tbl.fillStyle = '#ccffcc';
	tbl.fillTextCircle('DEALER MUST DRAW TO 16 AND STAND ON ALL 17\'S', 0,0,t2Radius,0.245*Math.PI,0.748*Math.PI, false);
	tbl.font = 'Bold 30px Times New Roman';
	tbl.fillStyle = '#004d00';
	tbl.fillTextCircle('BLACKJACK PAYS 3 TO 2', 0,0,t3Radius,0.23*Math.PI,0.72*Math.PI, false);
}

function drawBoxes(){ // draw the round betting boxes
	var ang;
	var num;
	tbl.lineWidth = 1.5;
	tbl.strokeStyle = "#ccffcc";
	for(num = 8; num < 13; num++){
		ang = num * Math.PI / 10;
		tbl.rotate(ang);
		tbl.translate(0, -bRadius);
		tbl.rotate(-ang);
		tbl.beginPath();
		tbl.arc(0, 0, 40, 0, 2*Math.PI);
		tbl.stroke();
		tbl.rotate(ang);
		tbl.translate(0, bRadius);
		tbl.rotate(-ang);
	}
}

function drawChips(){ // draw the chips on the wooden edge
	var ang;
	var hyp = wRadius;
	var knownAngle;
	var xDistance;
	var yDistance;
	var degreeMove = 3.4; //degree of angle move since the last chip
	var startDegree = 205; //degree to draw the first chip at
	tbl.lineWidth = 1;
	//tbl.strokeStyle = "#404040";
	for(var num = 0; num < 4; num++){
		ang = (num*degreeMove+startDegree) * Math.PI / 180;
		//calculate the x and y position of the center of the drawn circle
		hyp = wRadius;
		knownAngle = (ang-Math.PI);
		xDistance = (Math.sin(knownAngle)) * hyp;
		yDistance = Math.sqrt((hyp * hyp) - (xDistance * xDistance));
		chips[num].x = halfGameWidth-xDistance; //take the xDistance from the current offset and store in the chips array as a property of the relevant chip object
		chips[num].y = -180+yDistance; //add the yDistnace to the current offset and store in the chips array
		tbl.rotate(ang);
		tbl.translate(0, -wRadius);
		tbl.rotate(-ang);
		drawChip(tbl, chips[num]);
		tbl.rotate(ang);
		tbl.translate(0, wRadius);
		tbl.rotate(-ang);
	}
}

function drawChip(layer, chip){
	layer.beginPath();
	layer.arc(0, 0, chip.size, 0, 2*Math.PI);
	layer.fillStyle = chip.color;
	layer.fill();
	layer.strokeStyle = chip.borderColor;
	layer.stroke();
	for(var cNum = 1; cNum < 9; cNum++){
		layer.beginPath();
		cAng = cNum * Math.PI / 4;
		layer.rotate(cAng);
		layer.translate(0, 0-(chip.size-3));
		layer.rotate(-cAng);
		layer.arc(0, 0, 1, 0, 2*Math.PI);
		layer.fillStyle = '#f2f2f2';
		layer.fill();
		layer.rotate(cAng);
		layer.translate(0, (chip.size-3));
		layer.rotate(-cAng);
	}
	layer.beginPath();
	layer.arc(0, 0, 11, 0, 2*Math.PI);
	layer.stroke();
	layer.fill();
	layer.textAlign = 'center';
    layer.textBaseline="middle"; 
	layer.fillStyle = 'black';
	layer.font = "bold 11px Arial";
	layer.fillText(chip.value,0,0);
}

function drawNote(){ 
    tbl.beginPath();
	tbl.fillStyle = '#ffffcc';
	tbl.save();
	tbl.shadowColor = "rgba( 0, 0, 0, 0.2 )";
	tbl.shadowOffsetX = 3;
	tbl.shadowOffsetY = 4;
	tbl.shadowBlur = 3;
	tbl.fillRect(10, 10, 130, 80);
	tbl.restore();
    tbl.strokeStyle = '#666600';
	tbl.fillStyle = '#666600';
    tbl.rect(12, 12, 126, 76);
	tbl.lineWidth = 1;
	tbl.stroke();
	tbl.textAlign = 'center';
    tbl.textBaseline="middle"; 
	tbl.font = "Bold 14px Times New Roman";
	tbl.fillText('Single Deck', 75, 24);
	tbl.fillText('Table Rules', 75, 78);
	tbl.font = "Bold 12px  Times New Roman";
	tbl.textAlign = 'left';
	tbl.fillText('Min: 1', 30, 44);
	tbl.fillText('Max: 500', 30, 58);
	tbl.moveTo(20,34);
	tbl.lineTo(130,34);
	tbl.moveTo(20,67);
	tbl.lineTo(130,67);
	tbl.stroke();
}

function drawNote2(){ 
    tbl.beginPath();
	tbl.fillStyle = '#ffffcc';
	tbl.translate(100, 5);
	tbl.save();
	tbl.shadowColor = "rgba( 0, 0, 0, 0.2 )";
	tbl.shadowOffsetX = 3;
	tbl.shadowOffsetY = 4;
	tbl.shadowBlur = 3;
	tbl.fillRect(0, 0, 100, 60);
	tbl.restore();
    tbl.strokeStyle = '#666600';
	tbl.fillStyle = '#666600';
    tbl.rect(2, 2, 96, 56);
	tbl.lineWidth = 1;
	tbl.stroke();
	tbl.textAlign = 'center';
    tbl.textBaseline="middle"; 
	tbl.font = "Bold 14px Times New Roman";
	tbl.fillText('Rules', 50, 14);
	tbl.font = "Bold 12px  Times New Roman";
	tbl.textAlign = 'left';
	tbl.fillText('Min: 1', 20, 34);
	tbl.fillText('Max: 500', 20, 48);
	tbl.moveTo(10,24);
	tbl.lineTo(90,24);
	tbl.stroke();
	tbl.translate(-100, -5);
}

function drawChipTray(){ 
	grad = tbl.createRadialGradient(halfGameWidth, -200, 0,500,0,300);
	grad.addColorStop(0, '#ffec80');
	grad.addColorStop(0.1, '#ffec80');
	grad.addColorStop(0.9, 'gold');
	grad.addColorStop(1, 'gold');
	tbl.fillStyle = grad;
	tbl.save();
	tbl.shadowColor = "rgba( 0, 0, 0, 0.2 )";
	tbl.shadowOffsetX = 3;
	tbl.shadowOffsetY = 4;
	tbl.shadowBlur = 3;
	tbl.fillRect(274, -20, 372, 36);
	tbl.restore();
	var tubeWidth = 36;
	var tubeHeight = 13;
	var innerTubeWidth = 34;
	var position;
	for(position = 280; position < 630; position+=tubeWidth){
		grad = tbl.createLinearGradient(position,0,position+tubeWidth,0);
		grad.addColorStop(0, '#b39600');
		grad.addColorStop(0.5, 'gold');
		grad.addColorStop(1, '#b39600');
		tbl.fillStyle = grad;
		tbl.fillRect(position+1, 0, innerTubeWidth, tubeHeight);
	}
}