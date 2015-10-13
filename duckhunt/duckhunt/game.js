
var img = new Image();
	img.src = 'duckhunt-background.gif';

var bird1 = new Image();
	bird1.src = 'duckhunt_various_sheet.png';

var bird2 = new Image();
	bird2.src = 'duckhunt_various_sheet.png';


function init(){
	var canvas = document.getElementById("game_canvas");
	var context = canvas.getContext("2d");

	//draw the background
	context.drawImage(img,0,0);	

	//draw the green bird 
	context.drawImage(bird1,128,118, 39, 30, 180, 40, 39, 30);

	// draw the pink bird 
	context.drawImage(bird2, 38, 120, 36, 24, 75, 70, 36, 24);
}

