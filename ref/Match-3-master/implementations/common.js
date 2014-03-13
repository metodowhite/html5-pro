var TILE = 64;
var BOARD_WIDTH = 6;
var BOARD_HEIGHT = 6;
var UI_HEIGHT = 50;
var REAL_WIDTH = TILE * BOARD_WIDTH;
var REAL_HEIGHT = TILE * BOARD_HEIGHT + UI_HEIGHT;


var matchPatterns = [
	
	[ [-1, 0], [-1, -1] ], //1. left up
	[ [0, -1], [-1, -1] ], //2. up left
	[ [0, -1], [ 0, -2] ], //3. up up
	[ [0, -1], [ 1, -1] ], //4. up right
	[ [1,  0], [ 1, -1] ], //5. right up
	[ [1,  0], [ 2,  0] ], //6. right right
	[ [1,  0], [ 1,  1] ], //7. right down
	[ [0,  1], [ 1,  1] ], //8. down right
	[ [0,  1], [ 0,  2] ], //9. down down
	[ [0,  1], [-1,  1] ], //10. down left
	[ [-1, 0], [-1,  1] ], //11. left down
	[ [-1, 0], [-2,  0] ], //12. left left

	[ [-1, 0], [ 0, -1] ], //13. left & up
	[ [0, -1], [ 1,  0] ], //14. up & right
	[ [1,  0], [ 0,  1] ], //14. right & down
	[ [0,  1], [-1,  0] ], //15. down & left

	[ [0, -1], [ 0,  1] ], //16. up & down
	[ [-1, 0], [ 1,  0] ]  //17. left & right
];

Match3 = {
	board: [],
	blockers: [],

	current: "slum",

	startTile: [
		"slum",
		"house",
		"apartment",
		"skyscraper"
	],

	nextTile: {
		"slum": "house",
		"house": "mansion",
		"mansion": "apartment",
		"apartment": "skyscraper",
	},

	generateBoard: function (onItem) {

		for (var x = 0; x < BOARD_WIDTH; ++x) {
			//populate the board array
			if (!this.board[x]) { this.board[x] = []; }

			for (var y = 0; y < BOARD_HEIGHT; ++y) {
				var randomValue = Math.random();
				var type = "empty";

				if (randomValue < 0.02) {
					type = "pond";
				} else if (randomValue < 0.1) {
					type = this.startTile[2];
				} else if (randomValue < 0.2) {
					type = this.startTile[1];
				} else if (randomValue < 0.3) {
					type = this.startTile[0];
				}

				//only check for matches if not empty
				if (type !== "empty" && Match3.checkThree(x, y, type).length) {
					type = "empty";
				}
				
				this.board[x][y] = onItem.call(this, x, y, type);
			}
		}
	},

	generateRoads: function (onItem) {
		var dirs = {
			up: [ 0, -1], //up
			down: [ 0,  1], //down
			left: [-1,  0], //left
			right: [ 1,  0]  //right
		};

		for (var x = 0; x < BOARD_WIDTH; ++x) {
			for (var y = 0; y < BOARD_HEIGHT; ++y) {
				//only care about roads
				if (!this.board[x][y] || this.board[x][y].type !== "empty") {
					continue;
				}

				var tile = this.board[x][y];
				var neighbors = {};
				var type = "s";
				var rotation = 0;
				var count = 0;

				//check up, down, left, right
				for (var dir in dirs) {
					var dx = x + dirs[dir][0];
					var dy = y + dirs[dir][1];

					//out of bounds
					if (dx >= BOARD_WIDTH || dx < 0 || dy >= BOARD_HEIGHT || dy < 0)
						continue;

					var neighbor = this.board[dx][dy];
					if (neighbor.type === "empty") {
						count++;
						neighbors[dir] = true;
					}
				}

				if (count === 4) {
					type = "x";
				}
				else if (count === 3) {
					type = "t";

					if (neighbors.up && neighbors.left && neighbors.right)
						rotation = 180;
					if (neighbors.up && neighbors.left && neighbors.down)
						rotation = 90;
					if (neighbors.up && neighbors.right && neighbors.down)
						rotation = -90;

				}
				else if (count === 2) {
					type = "l";

					if (neighbors.left && neighbors.right) {
						type = "h";
					} else if (neighbors.up && neighbors.down) {
						type = "v";
					} else {
						if (neighbors.up && neighbors.right)
							rotation = 180;
						if (neighbors.up && neighbors.left)
							rotation = 90;
						if (neighbors.down && neighbors.right)
							rotation = -90;
					}
				}
				else if (count === 1) {
					type = "e";

					if (neighbors.up)
						rotation = -90;
					if (neighbors.left)
						rotation = -180;
					if (neighbors.down)
						rotation = 90;
				}

				onItem.call(this, tile, type, rotation);
			}
		}
	},

	getRelative: function (x, y, pos) {
		var newx = x + pos[0];
		var newy = y + pos[1];

		if (!this.board[newx] || !this.board[newx][newy]) {
			return undefined;
		}

		return this.board[newx][newy];
	},

	checkThree: function (x, y, tile) {
		var result = [];

		matchPatterns.forEach(function (direction) {
			
			var one = Match3.getRelative(x, y, direction[0]);
			var two = Match3.getRelative(x, y, direction[1]);

			//immediately stop reporting patterns
			if (!(one && two)) return;
			if (one.type === "empty" || two.type === "empty") return;
			if (one.type === "crystal" || two.type === "crystal") return;

			var match = false;

			//if wildcard, make sure one and two are same types
			if (tile === "crystal" && one.type === two.type)
				match = true;
			//else make sure same type as tile
			else if ((one.type === tile || one.type === "crystal") && 
					 (two.type === tile || two.type === "crystal"))
				match = true;

			if (match) {
				console.log(tile, one.type, two.type)
				result.push({
					direction: direction,
					one: one,
					two: two
				});
			}
		});

		return result;
	},

	moveBlockers: function () {
		var blockers = Match3.blockers;
		var dirs = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1]
		];

		for (var b = 0; b < blockers.length; ++b) {
			var car = blockers[b];
			
			dirs.sort(function () {
				return (Math.round(Math.random())-0.5);
			});

			//loop over every direction
			for (var dir in dirs) {
				//calculate the new coords
				var nx = car.col + dirs[dir][0];
				var ny = car.row + dirs[dir][1];

				//check out of bounds
				if (nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT || nx < 0 || ny < 0)
					continue;

				var tile = this.board[nx][ny];
				
				if (tile.type === "empty" && !tile.blocked) {
					//switch the blocked flags
					tile.blocked = true;
					console.log("WTF", this.board[car.col][car.row])
					this.board[car.col][car.row].blocked = false;

					Match3.onMoveBlocker(car, nx, ny);
					break;
				}
			}	
		}
	},

	place: function (x, y) {
		if (x >= BOARD_WIDTH || y >= BOARD_HEIGHT ||
			x < 0 || y < 0)
			return;

		var ent = Match3.board[x][y];

		//can only replace empty tiles
		if (ent.type !== "empty" || ent.blocked) { 
			console.log(ent, ent.type, ent.blocked);
			return;
		}

		if (Match3.current === "car") {
			Match3.placeBlocker(x, y);
		}
		else {
			Match3.onReplaceTile(x, y, Match3.current);
		}

		Match3.current = Match3.chooseNext();
		if (Match3.onNextItem) { 
			Match3.onNextItem(Match3.current); 
		}

		Match3.moveBlockers();
		Match3.checkGameover();
	},

	placeBlocker: function (x, y) {
		this.blockers.push(Match3.onBlocker(x, y));
		this.board[x][y].blocked = true;
	},

	checkGameover: function () {
		var filled = 0;
		var total = BOARD_WIDTH * BOARD_HEIGHT;

		for (var x = 0; x < BOARD_WIDTH; ++x) {
			for (var y = 0; y < BOARD_HEIGHT; ++y) {
				var tile = this.board[x][y];

				if (tile.type !== "empty" || tile.blocked)
					filled++;
			}
		}

		if (filled == total)
			Match3.onGameOver && Match3.onGameOver();
	},

	chooseNext: function () {
		var rand = Math.random();
		var type = "slum";

		if (rand < 0.04) {
			type = "crystal";
		}
		else if (rand < 0.07) {
			type = "mansion"
		}
		else if (rand < 0.16) {
			type = "house";
		}
		else if (rand < 0.22) {
			type = "car";
		}

		return type;
	},

	//export constants
	TILE: TILE,
	BOARD_WIDTH: BOARD_WIDTH,
	BOARD_HEIGHT: BOARD_HEIGHT,
	REAL_WIDTH: REAL_WIDTH,
	REAL_HEIGHT: REAL_HEIGHT,
	UI_HEIGHT: UI_HEIGHT,

	scores: {
		"empty": 0,
		"crystal": 0,
		"slum": 100,
		"house": 500,
		"mansion": 2000,
		"apartment": 10000,
		"skyscraper": 50000
	}
}



