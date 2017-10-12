var c = document.getElementById("background");
var ctx = c.getContext("2d");
var bWR = document.getElementById("background_wood_rim");
var bWRLayer = bWR.getContext("2d");
ctx.strokeStyle = "#555";
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

drawScene();

function drawScene(){
	drawCarpetPattern();
	ctx.translate(460, -180);//set the center point for drawing the circles
	drawGreenTable();
	drawWoodStrip();
	drawCushion();
	drawCushionRim();
	drawTextLines();
	drawText();
	drawBoxes();
	drawChips();
	ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the position from the center of the circles back to the (0,0) position (top left).
	drawNote();
	drawChipTray();
}

function drawCarpetPattern(){
	bWRLayer.fillStyle = '#993d00';
	bWRLayer.fillRect(0, 0, 920, 580);
	bWRLayer.lineWidth = 3;
	bWRLayer.strokeStyle = "gold";
	for(var i = 0; i < 1500; i+=50){
		bWRLayer.moveTo(i,0);
		bWRLayer.lineTo(0,i);
		bWRLayer.stroke();
	}	
	for(var i = 0; i < 1500; i+=50){
		bWRLayer.moveTo(920-i,0);
		bWRLayer.lineTo(920,i);
		bWRLayer.stroke();
	}
}

function drawGreenTable(){ //create 2 gradients one for the edge of the cloth, and one for the light above the table		
	grad = ctx.createRadialGradient(0, 350, 100, 0, 0, 700);
	grad.addColorStop(0, '#009933');
	grad.addColorStop(0.98, '#004d00');
	grad.addColorStop(1, '#003300');
	ctx.fillStyle = grad;
	ctx.arc(0,0,gRadius,0,Math.PI);
	ctx.fill(); 
}

function drawWoodStrip(){ //Wooden Arc for the table
	var woodTextureImage = new Image();
	bWRLayer.translate(460, -180);//set the center point for drawing the circles
	bWRLayer.beginPath();
	bWRLayer.arc(0,0,wRadius,0,Math.PI);
	bWRLayer.lineWidth = wRadius*0.08;
	bWRLayer.strokeStyle = '#522900';
	bWRLayer.stroke();
	woodTextureImage.onload = function() {
		bWRLayer.save();
		bWRLayer.globalAlpha = 0.4;
		bWRLayer.translate(-460, 470);//set the start point for wood texture
		var pattern = bWRLayer.createPattern(woodTextureImage, 'no-repeat');
		bWRLayer.strokeStyle = pattern;
		bWRLayer.stroke();
		bWRLayer.restore();
		grad = bWRLayer.createRadialGradient(0,0,wRadius*0.96, 0,0,wRadius*1.04);
		grad.addColorStop(0, '#511515');
		grad.addColorStop(0.06, 'transparent');
		grad.addColorStop(0.94, 'transparent');
		grad.addColorStop(1, '#511515');
		bWRLayer.strokeStyle = grad;
		bWRLayer.stroke();
	};
	woodTextureImage.src = 'images/background/wood_rim.jpg';
}

function drawCushion(){ //Cushion Arc for the table
	ctx.beginPath();
	ctx.arc(0,0,cRadius,0,Math.PI);
	grad = ctx.createRadialGradient(0,0,cRadius*0.94, 0,0,cRadius*1.06);
	grad.addColorStop(0, '#222');
	grad.addColorStop(0.05, '#262626');
	grad.addColorStop(0.3, '#404040');
	grad.addColorStop(0.4, '#333');
	grad.addColorStop(0.6, '#262626');
	grad.addColorStop(1, '#000');
	ctx.strokeStyle = grad;
	ctx.lineWidth = cRadius*0.12;
	ctx.save();
	ctx.shadowColor = "rgba( 0, 0, 0, 0.4 )";
	ctx.shadowOffsetX = 10;
	ctx.shadowOffsetY = 10;
	ctx.shadowBlur = 10;
	ctx.stroke();
	ctx.restore();
}

function drawCushionRim(){ //Cushion Arc for the table
	ctx.beginPath();
	ctx.arc(0,0,cRRadius,0,Math.PI);
	grad = ctx.createRadialGradient(0,0,cRRadius*0.998, 0,0,cRRadius*1.002);
	grad.addColorStop(0, '#4d4100');
	grad.addColorStop(0.4, '#665700');
	grad.addColorStop(1, '#4d4100');
	ctx.strokeStyle = grad;
	ctx.lineWidth = cRRadius*0.004;
	ctx.stroke();
}

function drawTextLines(){ //white Arcs for the message lines
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#ccffcc';
	ctx.arc(0,0,wORadius,0.25*Math.PI,0.75*Math.PI);
	ctx.stroke(); 
	ctx.beginPath();
	ctx.arc(0,0,wIRadius,0.25*Math.PI,0.75*Math.PI);
	ctx.stroke(); 
}

function drawText(){
	ctx.font = 'Bold 30px Times New Roman';
	ctx.fillStyle = '#004d00';
	ctx.textAlign = 'center';
	ctx.fillTextCircle('INSURANCE PAYS 2 TO 1', 0,0,t1Radius,0.24*Math.PI,0.745*Math.PI, false);
	ctx.font = 'Bold 18px Times New Roman';
	ctx.fillStyle = '#ccffcc';
	ctx.fillTextCircle('DEALER MUST DRAW TO 16 AND STAND ON ALL 17\'S', 0,0,t2Radius,0.245*Math.PI,0.748*Math.PI, false);
	ctx.font = 'Bold 30px Times New Roman';
	ctx.fillStyle = '#004d00';
	ctx.fillTextCircle('BLACKJACK PAYS 3 TO 2', 0,0,t3Radius,0.23*Math.PI,0.72*Math.PI, false);
}

function drawBoxes(){ // draw the round betting boxes
	var ang;
	var num;
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "#ccffcc";
	for(num = 8; num < 13; num++){
		ang = num * Math.PI / 10;
		ctx.rotate(ang);
		ctx.translate(0, -bRadius);
		ctx.rotate(-ang);
		ctx.beginPath();
		ctx.arc(0, 0, 40, 0, 2*Math.PI);
		ctx.stroke();
		ctx.rotate(ang);
		ctx.translate(0, bRadius);
		ctx.rotate(-ang);
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
	ctx.lineWidth = 1;
	//ctx.strokeStyle = "#404040";
	for(var num = 0; num < 4; num++){
		ang = (num*degreeMove+startDegree) * Math.PI / 180;
		//calculate the x and y position of the center of the drawn circle
		hyp = wRadius;
		knownAngle = (ang-Math.PI);
		xDistance = (Math.sin(knownAngle)) * hyp;
		yDistance = Math.sqrt((hyp * hyp) - (xDistance * xDistance));
		chips[num].x = 460-xDistance; //take the xDistance from the current offset and store in the chips array as a property of the relevant chip object
		chips[num].y = -180+yDistance; //add the yDistnace to the current offset and store in the chips array
		ctx.rotate(ang);
		ctx.translate(0, -wRadius);
		ctx.rotate(-ang);
		drawChip(ctx, chips[num]);
		ctx.rotate(ang);
		ctx.translate(0, wRadius);
		ctx.rotate(-ang);
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
    ctx.beginPath();
	ctx.fillStyle = '#ffffcc';
	ctx.save();
	ctx.shadowColor = "rgba( 0, 0, 0, 0.2 )";
	ctx.shadowOffsetX = 3;
	ctx.shadowOffsetY = 4;
	ctx.shadowBlur = 3;
	ctx.fillRect(10, 10, 130, 80);
	ctx.restore();
    ctx.strokeStyle = '#666600';
	ctx.fillStyle = '#666600';
    ctx.rect(12, 12, 126, 76);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.textAlign = 'center';
    ctx.textBaseline="middle"; 
	ctx.font = "Bold 14px Times New Roman";
	ctx.fillText('Single Deck', 75, 24);
	ctx.fillText('Table Rules', 75, 78);
	ctx.font = "Bold 12px  Times New Roman";
	ctx.textAlign = 'left';
	ctx.fillText('Min: 1', 30, 44);
	ctx.fillText('Max: 500', 30, 58);
	ctx.moveTo(20,34);
	ctx.lineTo(130,34);
	ctx.moveTo(20,67);
	ctx.lineTo(130,67);
	ctx.stroke();
}

function drawNote2(){ 
    ctx.beginPath();
	ctx.fillStyle = '#ffffcc';
	ctx.translate(100, 5);
	ctx.save();
	ctx.shadowColor = "rgba( 0, 0, 0, 0.2 )";
	ctx.shadowOffsetX = 3;
	ctx.shadowOffsetY = 4;
	ctx.shadowBlur = 3;
	ctx.fillRect(0, 0, 100, 60);
	ctx.restore();
    ctx.strokeStyle = '#666600';
	ctx.fillStyle = '#666600';
    ctx.rect(2, 2, 96, 56);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.textAlign = 'center';
    ctx.textBaseline="middle"; 
	ctx.font = "Bold 14px Times New Roman";
	ctx.fillText('Rules', 50, 14);
	ctx.font = "Bold 12px  Times New Roman";
	ctx.textAlign = 'left';
	ctx.fillText('Min: 1', 20, 34);
	ctx.fillText('Max: 500', 20, 48);
	ctx.moveTo(10,24);
	ctx.lineTo(90,24);
	ctx.stroke();
	ctx.translate(-100, -5);
}

function drawChipTray(){ 
	grad = ctx.createRadialGradient(460, -200, 0,500,0,300);
	grad.addColorStop(0, '#ffec80');
	grad.addColorStop(0.1, '#ffec80');
	grad.addColorStop(0.9, 'gold');
	grad.addColorStop(1, 'gold');
	ctx.fillStyle = grad;
	ctx.save();
	ctx.shadowColor = "rgba( 0, 0, 0, 0.2 )";
	ctx.shadowOffsetX = 3;
	ctx.shadowOffsetY = 4;
	ctx.shadowBlur = 3;
	ctx.fillRect(274, -20, 372, 36);
	ctx.restore();
	var tubeWidth = 36;
	var tubeHeight = 13;
	var innerTubeWidth = 34;
	var position;
	for(position = 280; position < 630; position+=tubeWidth){
		grad = ctx.createLinearGradient(position,0,position+tubeWidth,0);
		grad.addColorStop(0, '#b39600');
		grad.addColorStop(0.5, 'gold');
		grad.addColorStop(1, '#b39600');
		ctx.fillStyle = grad;
		ctx.fillRect(position+1, 0, innerTubeWidth, tubeHeight);
	}
}