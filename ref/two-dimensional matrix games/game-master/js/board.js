//function that manipulates and keeps track of board state
jewel.board = (function() {
	//set up vars for the board, jewels, etc
	var settings, jewels, cols, rows, baseScore, numJewelTypes;
	
	//init function to set up everything -- get board settings, fill the board, and then run the callback
	function initialize(callback) {
		settings = jewel.settings;
		numJewelTypes = settings.numJewelTypes;
		baseScore = settings.baseScore;
		cols = settings.cols;
		rows = settings.rows;
		fillBoard();
		callback();
	}
	
	//fills board with random jewels -- while loop and recursive call to hasMoves makes sure there are no matches set up initially 
	//and that there are moves set up
	function fillBoard() {
		var x, y, type;
		jewels = [];
		for(x = 0; x < cols; x++) {
			jewels[x] = [];
			for(y = 0; y < rows; y++) {
				type = randomJewel();	
				while((type === getJewel(x-1, y) && type === getJewel(x-2, y)) ||
				(type === getJewel(x, y-1) && type === getJewel(x,y-2))) {
					type = randomJewel();
				}
				jewels[x][y] = type;
			}
		}
		if(!hasMoves()) {
			fillBoard();
		}
	}
	
	//helper function -- gets jewel at given coords
	function getJewel(x, y) {
		if(x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
			return -1;
		} else {
			return jewels[x][y];
		}
	}

	//function returns a random jewel
	function randomJewel() {
		return Math.floor(Math.random() * numJewelTypes);
	}

	//helper function for canSwap and checkChains-- returns the number of jewels that are matched in a row 
	//(the greater number between the x and y axis)
	function checkChain(x, y) {
		var type = getJewel(x, y), left = 0, right = 0, down = 0, up = 0;

		while(type === getJewel(x - left - 1, y)) {
			left++;
		}

		while(type === getJewel(x + right + 1, y)) {
			right++;
		}

		while(type === getJewel(x, y + up + 1)) {
			up++;
		}

		while(type === getJewel(x, y - down - 1)) {
			down++;
		}

		return Math.max(left + 1 + right, up + 1 + down);
	}

	//helper function to determine whether a swap is valid (i.e. there is a chain to be made with the swap)
	//temporaily swaps them, checks for a match, and swaps them back, then returns a boolean if there was a chain or not
	function canSwap(x1, y1, x2, y2) {
		var type1 = getJewel(x1,y1), type2 = getJewel(x2, y2), chain;
		
		if(!isAdjacent(x1,y1,x2,y2)) {
			return false;
		}

		jewels[x1][y1] = type2;
		jewels[x2][y2] = type1;
		chain = (checkChain(x2,y2) > 2 || checkChain(x1, y1) > 2);
		jewels[x1][y1] = type1;
		jewels[x2][y2] = type2;
		
		return chain;
	}

	//another helper function - makes sure the jewels that are being swaps are adjacent
	function isAdjacent(x1, y1, x2, y2) {
		var dx = Math.abs(x1 - x2), dy = Math.abs(y1 - y2);
		return (dx+dy === 1);
	}

	//function that gets all chains that are currently on the board -- called after a successful swap to make sure
	//everything is taken care of.
	function getChains() {
		var x, y, chains = [];

		for(var x = 0; x < cols; x++) {
			chains[x] = [];
			for(var y = 0; y < rows; y++) {
				chains[x][y] = checkChain(x, y);
			}
		}

		return chains;
	}
	
	//function checks if a chain was made, and adds the number of gaps in the board
	//pushes the removed jewels into an array, pushes moved jewels into an array,
	//and adds new jewels to replace old jewels and pushes any events that occured back
	//to the calling function
	function check(events) {
		var chains = getChains(), hadChains = false, score = 0, removed = [],
		moved = [], gaps = [];

		for(var x = 0; x < cols; x++){
			gaps[x] = 0;
			for(var y = rows-1; y >= 0; y--){
				if(chains[x][y] > 2){
					hadChains = true;
					gaps[x]++;
					removed.push({
						x: x, y: y, type: getJewel(x, y)
					});
					score += baseScore * Math.pow(2, (chains[x][y] - 3));
				} else if (gaps[x] > 0) {
					moved.push({
						toX: x, toY: y + gaps[x], fromX: x, fromY: y, type: getJewel(x, y)
					});
					jewels[x][y + gaps[x]] = getJewel(x,y);
				}
			}
			for(y = 0; y < gaps[x]; y++) {
				jewels[x][y] = randomJewel();
				moved.push({
					toX: x, toY: y, fromX: x, fromY: y - gaps[x], type: jewels[x][y]
				});
			}
		}
		//checks to see if there were previous events, or inits a new empty array
		events = events || [];

		//if there were chains, add arrays of removed, moved jewels, as well as scores
		if(hadChains){
			events.push({ type: "remove", data: removed},
						{ type: "score", data: score},
						{ type: "move", data: moved});
			//if there aren't any more moves available, refill the board and push a new board to events
			if(!hasMoves()) {
				fillBoard();
				events.push({ type: "refill", data: getBoard() });
			}
			//recusively call events to make sure these events didn't trigger any more events
			return check(events);
		//if there weren't any chains, just return any events that happened
		} else {
			return events;
		}
	}

	//function that just returns an exact copy of the board
	function getBoard() {
		var copy = [], x;
		for(x = 0; x < cols; x++) {
			copy[x] = jewels[x].slice(0);
		}

		return copy;
	}

	//helper function that makes sure there are moves on the board
	function hasMoves() {
		for(var x = 0; x < cols; x++){
			for(var y = 0; y < rows; y++){
				if(canJewelMove(x,y)) {
					return true;
				}
			}
		}

		return false;
	}

	//helper function that determines if a jewel is allowed to move or not (x,y position and if there is a valid swap)
	function canJewelMove(x, y) {
		return ((x > 0 && canSwap(x, y, x-1, y)) ||
				(x < cols - 1 && canSwap(x, y, x+1, y)) ||
				(y > 0 && canSwap(x, y, x, y-1)) ||
				(y < rows - 1 && canSwap(x, y, x, y+1)));
	}

	//function that actually does the swapping -- uses canSwap
	//then checks for any other events -- moving jewels in to replace chained jewels, etc
	//then callsback with the an array of events
	function swap(x1, y1, x2, y2, callback) {
		var tmp, swap1, swap2, events = [];
		// swap1 and swap2 elements for pushing into the events array
		swap1 = {
			type: "move",
			data: [{
					type: getJewel(x1, y1),
					fromX: x1, fromY: y1, toX: x2, toY: y2
				}, {
					type: getJewel(x2, y2),
					fromX: x2, fromY: y2, toX: x1, toY: y1
			}]
		};
		
		swap2 = {
			type: "move",
			data: [{
					type: getJewel(x2, y2),
					fromX: x1, fromY: y1, toX: x2, toY: y2
				}, {
					type: getJewel(x1, y1),
					fromX: x2, fromY: y2, toX: x1, toY: y1
			}]
		};
		
		// if jewels are adjacent, push a swap event, and if they're actually
		// swapable, switch them and concat any events from check()...otherwise
		// push swap2 to events as a badswap for animation purposes
		if(isAdjacent(x1, y1, x2, y2)) {
			events.push(swap1);
			if(canSwap(x1, y1, x2, y2)){
				tmp = getJewel(x1, y1);
				jewels[x1][y1] = getJewel(x2, y2);
				jewels[x2][y2] = tmp;
				events = events.concat(check());
			} else {
				events.push(swap2, {type: "badswap"});
			}

			callback(events);
		} 
	}

	//function to print the current board's state
	function print() {
		var str = "";
		for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
				str += getJewel(x,y) + " ";
			}
			str += "\r\n";
		}
		console.log(str);
	}

	//expose public functions
	return {
		initialize: initialize,
		print: print,
		canSwap: canSwap,
		getBoard: getBoard,
		swap: swap
		};
})();
