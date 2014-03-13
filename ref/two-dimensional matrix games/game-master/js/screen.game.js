// function that calls the drawing functions and handles some input
jewel.screens["game-screen"] = (function() {
	var board = jewel.board, display = jewel.display, settings = jewel.settings,
	input = jewel.input, cursor, firstRun = true;
	var gameState = {
	};
	
	// self explainitory -- calls board initialize with display.initialize callback 
	// with display.redraw call back board sets up the math behind the board, display.init
	//	sets up canvas, display.redraw draws them onto the board
	// also sets up initial game state.
	function startGame() {
		gameState = {
			level: 0,
			score: 0,
			timer: 0,
			startTime: 0,
			endTime: 0
		};
		cursor = {
			x: 0,
			y: 0,
			selected: false
		};
		updateGameInfo();
		setLevelTimer(true);
		board.initialize(function(){
			display.initialize(function() {
				display.redraw(board.getBoard(), function () {});
				advanceLevel();
			});
		});
	}
	
	//updates the divs with score and level info
	function updateGameInfo() {
		$("#game-screen .score span").html(gameState.score);
		$('#game-screen .level span').html(gameState.level);
	}
	
	// runs setup the board if its the firstRun, then starts the game
	function run() {
		if(firstRun) {
			setup();
			firstRun = false;
		}
		startGame();
	}
	
	//initializes the input object and binds actions to functions
	function setup() {
		input.initialize();
		input.bind("selectJewel", selectJewel);
		input.bind("moveUp", moveUp);
		input.bind("moveDown", moveDown);
		input.bind("moveLeft", moveLeft);
		input.bind("moveRight", moveRight);
	}
	
	// obvious -- adds one to your level, updates the display, adds a new timer
	function advanceLevel() {
		gameState.level++;
		announce("Level "+ gameState.level);
		updateGameInfo();
		gameState.startTime = Date.now();
		gameState.endTime = settings.baseLevelTimer * Math.pow(gameState.level,
		-0.05 * gameState.level);
		setLevelTimer(true);
		display.levelUp();
	}
	
	// function to display the level up annoucement
	function announce(str) {
		var $e = $('#game-screen .annouce');
		$e.html(str);
		if(Modernizr.cssanimations) {
			$e.removeClass('zoomfade');
			setTimeout(function() {
				$e.addClass('zoomfade');
			}, 1);
		} else {
			$e.addClass('active');
			setTimeout(function() {
				$e.removeClass('active');
			}, 1000);
		}
	}
	
	// function that sets and runs the timer based on the level the player is on
	// uses setTimeout rather than updateAnimation because exact timing is more
	// critical for the timer
	function setLevelTimer(reset) {
		if(gameState.timer) {
			clearTimeout(gameState.timer);
			gameState.timer = 0;
		}
		if(reset) {
			gameState.startTime = Date.now();
			gameState.endTime = settings.baseLevelTimer * Math.pow(gameState.level,
			-0.05 * gameState.level);
		}
		var delta = gameState.startTime + gameState.endTime - Date.now(),
			percent = (delta / gameState.endTime) * 100,
			progress = $('#game-screen .time .indicator');
		if(delta < 0) {
			gameOver();
		} else {
			progress.css("width", percent+"%");
			gameState.timer = setTimeout(setLevelTimer, 30);
		}
	}
	
	//function to set cursor x, y, and selection
	function setCursor(x, y, select) {
		cursor.x = x;
		cursor.y = y;
		cursor.selected = select;
		//links the logic in screen.game.js to the display
		display.setCursor(x, y, select);
	}
	
	//function to move the cursor and select new jewel if appropriate
	function moveCursor(x, y) {
		if(cursor.selected) {
			x += cursor.x;
			y += cursor.y;
			if(x >= 0 && x < settings.cols && y >= 0 && y < settings.rows) {
				selectJewel(x, y);
			}
		} else {
			x = (cursor.x + x + settings.cols) % settings.cols;
			y = (cursor.y + y + settings.rows) % settings.rows;
			setCursor(x, y, false);
		}
	}
	
	//functions to move the cursor directionally
	function moveUp() {
		moveCursor(0, -1);
	}
	
	function moveRight() {
		moveCursor(1, 0);
	}
	
	function moveDown() {
		moveCursor(0, 1);
	}
	
	function moveLeft() {
		moveCursor(-1, 0);
	}
	
	function addScore(points) {
		var nextLevelAt = Math.pow(settings.baseLevelScore, Math.pow(settings.baseLevelExp,
		gameState.level-1));
		gameState.score += points;
		if(gameState.score > nextLevelAt) {
			advanceLevel();
		}
		updateGameInfo();
	}
	
	//callback function for swap (board.js) -- uses the events array 
	// (from the board.js swap function) to display graphically what events too place
	function playBoardEvents (events) {
		//if there are events
		if(events.length > 0) {
			//get first item from array and remove it
			var boardEvent = events.shift(),
			//callback function to recursively call this function and go through all
			//the items stored in events
			next = function() {
				playBoardEvents(events);
			};
			//switch to display whatever is happening in the events
			switch (boardEvent.type) {
				case "move":
					display.moveJewels(boardEvent.data, next);
					break;
				case "remove":
					display.removeJewels(boardEvent.data, next);
					break;
				case "refill":
					display.refill(boardEvent.data, next);
					annouce("No moves!");
					break;
				case "score":
					addScore(boardEvent.data);
					next();
					break;
				default:
					next();
					break;
			}
		} else {
			//then redraw the board when we're done
			display.redraw(board.getBoard(), function() {
			});
		}
	}
	
	function gameOver() {
		display.gameOver(function() {
			announce("Game over");
		});
	}
	
	//function to select jewels -- helper fucntion for move cursor
	function selectJewel(x, y) {
		//if no x and y are provided, select the jewel where the cursor is
		if(arguments.length == 0) {
			selectJewel(cursor.x, cursor.y);
			return;
		}
		//if the cursor has selected a jewel already, check the dist from where the first
		//click was. if its 1, swap the jewels, if not, select a new jewel.
		if(cursor.selected) {
			var dx = Math.abs(x - cursor.x),
			dy = Math.abs(y - cursor.y),
			dist = dx + dy;
			if(dist == 0) {
				setCursor(x, y, false);
			} else if(dist == 1) {
				board.swap(cursor.x, cursor.y, x, y, playBoardEvents);
				setCursor(x, y, false);
			} else {
				setCursor(x, y, true);
			}
		} else {
			setCursor(x, y, true);
		}
	}
	
	return {
		run: run
	};
})();