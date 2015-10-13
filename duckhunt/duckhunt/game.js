function init(){
	var canvas = document.getElementById("game_canvas");
	var context = canvas.getContext("2d");

	//draw the background
	var img = new Image();
	img.src = 'duckhunt-background.gif';
	context.drawImage(img,0,0);	

	//draw the green bird 
	var bird1 = new Image();
	bird1.src = 'duckhunt_various_sheet.png';
	context.drawImage(bird1,128,118, 39, 30, 180, 40, 39, 30);

	// draw the pink bird 
	var bird2 = new Image();
	bird2.src = 'duckhunt_various_sheet.png';
	context.drawImage(bird2, 38, 120, 36, 24, 75, 70, 36, 24);

}

