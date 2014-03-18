var ctx, 
img,
img2,
canvas;

$(function () {
	// canvas = $("#mainCanvas");

	// ctx = canvas[0].getContext("2d");
	// img = new Image();

	// img.onload = function(){
	// // TweenLite.ticker.fps(120);
	// 	// TweenLite.ticker.addEventListener("tick", loop);
 //   		var sourceX = 0;
 //        var sourceY = 0;
 //        var sourceWidth = 440;
 //        var sourceHeight = 40;
 //        var destWidth = sourceWidth;
 //        var destHeight = sourceHeight;
 //        var destX = canvas.width / 2 - destWidth / 2;
 //        var destY = canvas.height / 2 - destHeight / 2;


	// 	ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destWidth, destHeight, destX, destY);
	// }

	// img.src = "img/coin-sprite-animation-sprite-sheet.png"

	var canvas = document.getElementById('mainCanvas');
	var context = canvas.getContext('2d');
	var imageObj = new Image();

	imageObj.onload = function() {
		// draw cropped image
		var sourceX = 0;
		var sourceY = 0;
		var sourceWidth = 44;
		var sourceHeight = 40;
		var destWidth = sourceWidth;
		var destHeight = sourceHeight;
		var destX = canvas.width / 2 - destWidth / 2;
		var destY = canvas.height / 2 - destHeight / 2;

		context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
	};
	
	imageObj.src = 'img/coin-sprite-animation-sprite-sheet.png';
	//imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';


	// loop();
	// TweenMax.to(img, 1, {xpos:2000, ypos:1000, bla:10, ble:10,  repeat:-1, yoyo:true});
});


// function loop(event) {
// 	// ctx.rotate(toDegrees(Math.sin(-1)));
// 	// ctx.rotate(Math.sin(-.1));
// 	// ctx.drawImage(img, img.xpos, img.ypos, img.bla, img.ble);
// 	// context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
// }

// function toDegrees (angle) {
// 	return angle * (180 / Math.PI);
// }

// function toRadians (angle) {
// 	return angle * (Math.PI / 180);
// }