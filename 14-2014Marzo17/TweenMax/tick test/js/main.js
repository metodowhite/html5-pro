var ctx, 
	img,
	img2,
	$canvas;

$(function () {
	$canvas = $("#mainCanvas");

	ctx = $canvas[0].getContext("2d");
	img = new Image();
	img.src = "http://www.fillmurray.com/300/300";
	img.xpos = 10;
	img.ypos = 10;
	img.bla = 300;
	img.ble = 300;

	img2 = new Image();
	img2.src = "http://www.fillmurray.com/g/300/300";
	img2.xpos = 2000;
	img2.ypos = 1000;
	img2.bla = 300;
	img2.ble = 300;

	img.onload = function(){
		// TweenLite.ticker.fps(15);
		TweenLite.ticker.addEventListener("tick", loop);
		
		TweenMax.to(img, 3, {xpos:2000, ypos:1000, bla:10, ble:10,  repeat:-1, yoyo:true});
		TweenMax.to(img2, 3, {xpos:20, ypos:10, bla:10, ble:10,  repeat:-1, yoyo:true});
	}
});


function loop(event) {
	// ctx.rotate(toDegrees(Math.sin(-1)));
	ctx.rotate(Math.sin(-.1));
	// ctx.clearRect(0, 0, $canvas.width(), $canvas.height());

	ctx.drawImage(img, img.xpos, img.ypos, img.bla, img.ble);
	ctx.drawImage(img2, img2.xpos, img2.ypos, img2.bla, img2.ble);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}


