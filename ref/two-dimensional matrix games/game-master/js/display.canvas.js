// function (-slash-object-property) that draws the jewels onto the board
jewel.display = (function() {

	//declare variables, import settings from main jewel settings
	var canvas, cursor, ctx, cols, rows, jewelSize, jewels,
	previousCycle, firstRun = true, animations = [];
	cols = jewel.settings.cols;
	rows = jewel.settings.rows; 
	jewelSize = jewel.settings.jewelSize;
	
	//run the first time the function is called -- calls function to create jewel grid background
	function setup() {
		var boardElement = $('#game-screen .game-board')[0];
		canvas = $(".board")[0];
		ctx = canvas.getContext('2d');
		canvas.width = cols * jewelSize;
		canvas.height = rows * jewelSize;
		//scale the canvas so 1x1 is the size of a jewel for easy manipulation
		ctx.scale(jewelSize, jewelSize);
		createBackground();
		// starts animation cycle and keeps track of previous cycle
		previousCycle = Date.now();
		requestAnimationFrame(cycle);
	}
	
	// helper function to add an animation to the animations array
	function addAnimation(runTime, fncs) {
		var anim = {
			runTime: runTime,
			startTime: Date.now(),
			pos: 0,
			fncs: fncs
		};
		animations.push(anim);
	}
	
	// function to render all animations currently in the animations array
	function renderAnimations(time, lastTime) {
		var anims = animations.slice(0), n = anims.length, animTime, anim, i;
		// updates the time position of animations
		for(i = 0; i < n; i++) {
			anim = anims[i];
			// if animation has before function, call it
			if(anim.fncs.before) {
				anim.fncs.before(anim.pos);
			}
			anim.lastPos = anim.pos;
			animTime = (lastTime - anim.startTime);
			anim.pos = animTime / anim.runTime;
			anim.pos = Math.max(0, Math.min(1, anim.pos));
		}
		// reset animation list
		animations = []
		for(i = 0; i < n; i++) {
			// go through list and render the animations
			anim = anims[i];
			anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
			//if the animation is done, call the done function
			if(anim.pos == 1) {
				if(anim.fncs.done){
					anim.fncs.done();
				}
			//otherwise push it back into the animations array
			} else {
				animations.push(anim);
			}
		}
	}
	
	// helper function to schedule another cycle
	function cycle(time) {
		renderCursor(time);
		renderAnimations(time, previousCycle);
		previousCycle = time;
		requestAnimationFrame(cycle);
	}
	
	//helper function to clear cursor -- clears the canvas at an x,y loc
	function clearJewel(x, y) {
		ctx.clearRect(x, y, 1, 1);
	}
	
	//function to clear and redraw the jewel at a location
	function clearCursor() {
		if(cursor) {
			var x = cursor.x, y = cursor.y;
			clearJewel(x, y);
			drawJewel(jewels[x][y], x, y);
		}
	}
	
	//function that sets a cursors location and a specific position
	function setCursor(x, y, selected) {
		clearCursor();
		if(arguments.length > 0) {
			cursor = {
				x: x,
				y: y,
				selected: selected
			};
		} else {
			cursor = null;
		}
	}
	
	//creates grid background
	function createBackground() {
		var background = $(".board-bg")[0];
		bgctx = background.getContext('2d');
		background.width = cols * jewelSize;
		background.height = rows * jewelSize;
		bgctx.fillStyle = "rgba(225,235,255,0.15)";
		for(var x = 0; x < cols; x++) {
			for(var y = 0; y < rows; y++) {
				if((x+y)%2) {
					bgctx.fillRect(x*jewelSize, y*jewelSize, jewelSize, jewelSize);
				}
			}
		}
		return background;
	}
		
	//helper function for the redraw method	(draws the jewel specified by 'type'
	function drawJewel(type, x, y, scale, rot) {
		var image = jewel.images["images/jewels" + jewelSize + ".png"];
		ctx.save();
		//check to make sure scale is defined before we try to use it
		if(typeof scale !== 'undefined' && scale > 0) {
			ctx.beginPath();
			//clip the jewel and scale and rotate it
			ctx.rect(x,y,1,1);
			ctx.clip();
			ctx.translate(x + 0.5, y + 0.5);
			ctx.scale(scale, scale);
			if(rot) {
				ctx.rotate(rot);
			}
			ctx.translate(-x - 0.5, -y - 0.5);
		}
		
		ctx.drawImage(image, type * jewelSize, 0, jewelSize, jewelSize, x, y, 1, 1);
		ctx.restore();
	}
	
	// function that takes an array of moved jewel objects and a call back
	// for each moved jewel it adds an animation for moving from X1 to X2 (and Y)
	function moveJewels(movedJewels, callback) {
		var n = movedJewels.length,
		oldCursor = cursor,
		cursor = null;
		
		movedJewels.forEach(function(e) {
			var x = e.fromX, y = e.fromY,
			dx = e.toX - e.fromX,
			dy = e.toY - e.fromY,
			dist = Math.abs(dx) + Math.abs(dy);
			
			//before -- clears where the jewel was in the previous frame
			//render -- draws the jewels new frame
			//after -- sets the cursor at its old position and calls the callback
			addAnimation(200 * dist, {
				before: function(pos) {
					pos = Math.sin(pos * Math.PI / 2);
					clearJewel(x + dx * pos, y + dy * pos);
				},
				render: function(pos) {
					pos = Math.sin(pos * Math.PI / 2);
					drawJewel(e.type, x + dx * pos, y + dy * pos);
				},
				done: function() {
					if(--n == 0) {
						cursor: oldCursor;
						callback();
					}
				}
			});
		});
	}
	
	// function that add animation for removing the jewels in the removedJewel array
	function removeJewels(removedJewels, callback) {
		var n = removedJewels.length;
		removedJewels.forEach(function(e) {
			//before -- clear the jewel's current frame
			//render -- animation/redraw the jewel; scale goes from 1 to 0 thus removing
			//          the jewel
			//done -- call the callback
			addAnimation(400, {
				before: function() {
					clearJewel(e.x, e.y);
				},
				render: function(pos) {
					ctx.save();
					ctx.globalAlpha = 1 - pos;
					drawJewel(e.type, e.x, e.y, 1 - pos, pos * Math.PI * 2);
					ctx.restore();
				},
				done: function() {
					if (--n == 0) {
						callback();
					}
				}
			});
		});
	}
	
	function refill(newJewels, callback) {
		var lastJewel = 0;
		addAnimation(1000, {
			render: function(pos) {
				var thisJewel = Math.floor(pos * cols * rows),
				i, x, y;
				for(i = lastJewel; i < thisJewel; i++) {
					x = i % cols;
					y = Math.floor(1 / cols);
					clearJewel(x,y);
					drawJewel(newJewels[x][y], x, y);
				}
				lastJewel = thisJewel;
				canvas.style.webkitTransform = "rotateX(" + (360 * pos) + "deg)";
			},
			done: function() {
				canvas.style.webkitTransform = "";
				callback();
			}
		});		
	}
	
	//method with callback -- draws jewels across the entire board
	function redraw(newJewels, callback) {
		var x, y;
		jewels = newJewels;
		
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(x = 0; x < cols; x++) {
			for(y = 0; y < rows; y++) {
				drawJewel(jewels[x][y], x, y);
			}
		}	
		renderCursor();
		callback();
	}
	
	//function to display where the cursor is -- simply draws on the canvas
	function renderCursor(time) {
		if (!cursor) {
			return;
		}
		var x = cursor.x, y = cursor.y,
		t1 = (Math.sin(time / 200) + 1) / 2;
		t2 = (Math.sin(time / 400) + 1) / 2;
		clearCursor();
		if (cursor.selected) {
			ctx.save();
			ctx.globalCompositeOperation = 'lighter';
			ctx.globalAlpha = 0.8 * t1;
			drawJewel(jewels[x][y], x, y);
			ctx.restore();
		}
		ctx.save();
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = "rgba(250,250,150," + (0.5 + 0.5 * t2) +")";
		ctx.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9);
		ctx.restore();
	}
	
	// obvious -- game over animation
	function gameOver(callback) {
		addAnimation(1000, {
			render: function(pos) {
				$('.board').css('left', 0.2 * pos * (Math.random() - 0.5) + "em");
				$('.board').css('top', 0.2 * pos * (Math.random() - 0.5) + "em");
			},
			done: function () {
				$('.board').css('left', "0");
				$('.board').css('top', "0");
				explode(callback);
			}
		});
	}
	
	// JUICE function -- add level up effects
	function levelUp(callback) {
		addAnimation(1000, {
			before: function(pos) {
				var j = Math.floor(pos * rows * 2),
				x, y;
				for(y = 0, x = j; y < rows; y++, x--) {
					if(x >= 0 && x < cols) {
						clearJewel(x, y);
						drawJewel(jewels[x][y], x, y);
					}
				}
			},
			render: function(pos) {
				var j = Math.floor(pos * rows * 2),
				x, y;
				
				ctx.save();
				ctx.globalCompositeOperation = 'lighter';
				for(y = 0, x = j; y < rows; y++, x--) {
					if(x >= 0 && x < cols) {
						drawJewel(jewels[x][y], x, y, 1.1);
					}
				}
				ctx.restore();
			},
			done: callback
		});
	}
	
	// make jewels explode on game over
	function explode(callback) {
		var pieces = [], piece, x, y;
		for(x = 0; x < cols; x++) {
			for(y = 0; y < rows; y++) {
				piece = {
					type: jewels[x][y],
					pos: {
						x: x + 0.5,
						y: y + 0.5
					},
					vel: {
						x: (Math.random() - 0.5) * 20,
						y: -Math.random() * 10
					},
					rot: (Math.random() - 0.5) * 3
				}
				pieces.push(piece);
			}
		}
		addAnimation(2000, {
			before: function(pos) {
				ctx.clearRect(0,0,cols,rows);
			},
			render: function(pos, delta) {
			 explodePieces(pieces, pos, delta);
			},
			done: callback
		});
	}
	
	// helper function for explode -- iterates through all of the pieces, changes their pos
	// rotates them, and redraws them.
	function explodePieces(pieces, pos, delta) {
		var piece, i;
		for (i = 0; i < pieces.length; i++) {
			piece = pieces[i];
			piece.vel.y += 50 * delta; // this is the control for 'gravity'
			piece.pos.y += piece.vel.y * delta;
			piece.pos.x += piece.vel.x * delta;
			if(piece.pos.x < 0 || piece.pos.x > cols) {
				piece.pos.x = Math.max(0, piece.pos.x);
				piece.pos.x = Math.min(cols, piece.pos.x);
				piece.vel.x *= -1;
			}
			ctx.save();
			ctx.globalCompositeOperation = 'lighter';
			ctx.translate(piece.pos.x, piece.pos.y);
			ctx.rotate(piece.rot * pos * Math.PI * 4);
			ctx.translate(-piece.pos.x, -piece.pos.y);
			drawJewel(piece.type, piece.pos.x - 0.5, piece.pos.y - 0.5);
			ctx.restore();
		}
	}
	
	//only other (redraw) public function -- sets up the board the first time, and has callback
	function initialize(callback) {
		if(firstRun) {
			setup();
			firstRun = false;
		}
		callback();
	}
	
	//expose public functions
	return {
		initialize: initialize,
		redraw: redraw,
		setCursor: setCursor,
		moveJewels: moveJewels,
		removeJewels: removeJewels,
		refill: refill,
		levelUp: levelUp,
		gameOver: gameOver
	};
})();
			