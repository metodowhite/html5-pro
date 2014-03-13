var Game = Game || {};

(function(Game, $){
	"use strict";
	
	Game.init = function() {
		console.log('init game');

		Game.cols = 8;
		Game.rows = 8;
		Game.tileSize = 50;
		Game.gems = ['yellow','blue','red','purple','green'];
		Game.grid = [];
		Game.col = [];
		Game.colNum = 1;
		Game.firstClick = true;
		Game.counter = 0;
		Game.gemCoords = "";
		Game.moves = [];
		Game.matches = [];
		Game.frames = null;
		Game.move = false; // flag for if user makes a move
		Game.startBtn = document.getElementById('start');
		Game.modal = document.getElementById('modal');
		Game.menu = document.getElementById('menu');
		Game.board = document.getElementById('gameBoard');
		

		Game.initTimer();
		Game.initScore();

		Game.appendHighScores();
		
		Game.startBtn.addEventListener('click',function(){
			Game.buildGrid();
			Game.menu.style.display = 'none';
			Game.modal.style.display = 'none';

			Game.play();
		}, false);
	}

	Game.play = function() {
		Game.frames = setInterval(function(){
			Game.updateTimer();
			// Game.getMatches();
			
			// if(typeof Game.matches.length !== 'undefined') {
			// 	Game.onMoveComplete();
			// }
		},1000);
	}
	
	Game.gemClick = function (e) {
		var gem =  e.target,
			gemCoords = gem.getAttribute('data-coords');
		
		Game.move = true;
		
		if(Game.firstClick) {
			console.log('first click');
			gem.style.opacity = '1';
			Game.firstClick = false;
			Game.selectedGem = gem;
			Game.moves = Game.getMoves(gemCoords);
		} else {
			console.log('second click');
			Game.firstClick = true;				
			Game.attemptMove(Game.selectedGem, gem);
		}
	}


	Game.buildGrid = function() {
		Game.board.innerHTML = '';
		
		var cols = Game.cols,
			rows = Game.rows,
			tileSize = Game.tileSize;
		
		gameBoard.style.height = rows*tileSize;
		gameBoard.style.width = cols*tileSize;
		
		for(var i = 0; i < cols; i ++) {
			for(var j = 0; j < rows; j++) {
				var gem = document.createElement('div');
				
				gem.id = 'gem'+i+''+j;
				gem.className = 'gem '+Game.randomGem();
				gem.style.height = tileSize;
				gem.style.width = tileSize;
				gem.style.left = i*tileSize;
				gem.style.bottom = j*tileSize;
				gem.setAttribute('data-coords', i+','+j);
				
				Game.board.appendChild(gem);
			}
		}
		
		Game.board.addEventListener('click',Game.gemClick, false);
	}

	Game.removeGems = function() {
		var cols = Game.cols,
			rows = Game.rows,
			gem, coords;
		
		for(var i = 0; i < Game.matches.length; i ++) {
			for(var j = 0; j < Game.matches[i].length; j++) {
				if(Game.matches[i][j].parentNode) {
					Game.matches[i][j].parentNode.removeChild(Game.matches[i][j]);
				}
			}
		}
	}
	
	Game.attemptMove = function(gem1, gem2) {
		for(var i = 0; i < Game.moves.length; i++) {
			if(Game.moves[i] == gem2.getAttribute('data-coords')) {
				console.log('Make the move');

				Game.swapGems(gem1, gem2);
				Game.firstClick = true;
				Game.moves = null;
				break;
			}
		}		
	}
	
	Game.onMoveComplete = function() {
		Game.updateScore();
		Game.removeGems(); // remove the gems from the grid array and dom
		Game.resetCols();
		Game.resetGems();
		Game.generateNewGems();
		// Game.resetMatches();

		Game.getMatches(true);

		if(Game.matches.length > 0) {
			Game.onMoveComplete();
			Game.resetMatches();
		}
	}

	Game.swapGems = function(src,dest) {
		var gem1Bottom = src.style.bottom,
			gem2Bottom = dest.style.bottom,
			gem1Coords = src.getAttribute('data-coords'),
			gem2Coords = dest.getAttribute('data-coords'),
			gem1X = gem1Coords.split(',')[0],
			gem1Y = gem1Coords.split(',')[1],
			gem2X = gem2Coords.split(',')[0],
			gem2Y = gem2Coords.split(',')[1],
			gem1Type = src.className,
			gem2Type = dest.className,
			gem1Id = src.id,
			gem2Id = dest.id,
			matches = [];
		
		src.className = gem2Type;
		dest.className = gem1Type;
		
		// Game.getMatches(true);
		Game.getMatches(false);

		matches = Game.matches;
		
		src.style.opacity = '0.5';

		if(matches.length == 0) {
			src.className = gem1Type;
			dest.className = gem2Type;
		} else {
			Game.onMoveComplete();
		}
		
		Game.selectedGem = null;
	}
	
	// check the columns for matches
	Game.checkColumns = function() {
		var	cols = Game.cols,
			rows = Game.rows,
			matches = [],
			matchCount = 0,
			currentGem, nextGem;
			
		for(var i = 0; i < cols; i++) {
			for(var j = 0; j < rows; j++) {
				currentGem = document.getElementById('gem'+i+''+j);
				
				for(var k = 1; k < (rows)-j; k++) {
					nextGem = document.getElementById('gem'+i+''+(k+j));
					
					if(nextGem && currentGem){
						if(currentGem.className.match(nextGem.className)) {
							matchCount++;
							matches.push(nextGem);
						} else {
							if(matchCount > 1) {
								matches.unshift(currentGem);
								Game.matches.push(matches);
							}

							// reset these if no match is found
							matchCount = 0;
							matches = [];
							break;
						}
					}
				}
				// reset these after each column
				matchCount = 0;
				matches = [];
			}
		}
	}

	// check the rows for matches
	// TODO: Finish the row matching!!!
	Game.checkRows =function(gem) {
		var	cols = Game.cols,
			rows = Game.rows,
			matches = [],
			matchCount = 0,
			currentGem, nextGem;
			
		for(var i = 0; i < rows; i++) {
			for(var j = 0; j < cols; j++) {
				currentGem = document.getElementById('gem'+j+''+i);
				console.log((cols)-j);
				// return;
				for(var k = 1; k < (cols)-i; k++) {
					nextGem = document.getElementById('gem'+j+''+(+k+i));
					console.log('gem'+j+''+(k+i));
					if(nextGem && currentGem){
						if(currentGem.className.match(nextGem.className)) {
							matchCount++;
							matches.push(nextGem);
						} else {
							if(matchCount > 1) {
								matches.unshift(currentGem);
								Game.matches.push(matches);
							}

							// reset these if a match of 3+ was found or no match was found
							matchCount = 0;
							matches = [];
							break;
						}
					}
				}
				
				// reset these after each column
				matchCount = 0;
				matches = [];
			}
		}
		console.log(Game.matches);		
	}
	
	// Get matches for either the rows or columns
	Game.getMatches = function(vert) {
		if(vert) { // check for matchs in the columns
			Game.checkColumns();		
		} else { // check for matchs in the rows
			Game.checkRows();
		}
	}
	
	// can only move a gem up, down, left, or right
	Game.getMoves = function(coords){
		coords = coords.split(',');
		
		var x = coords[0],
			y = coords[1],
			moves = [],
			newX,
			newY;
			
		// 0,-1 | -1,0 | 0,+1 | +1,0
		for(var i = 0; i < 4; i++) { 
			if(i==0) {
				newX = x-1;
				newY = y;
			} else if(i == 1) {
				newX = x;
				newY = y-1;				
			} else if(i == 2) {
				newX = +x+1;
				newY = y;
			} else {
				newX = x;
				newY = +y+1;
			}
			
			moves.push(newX+','+newY);
		}
		
		return moves;
	}

	Game.getMissingCount = function() {
		var missing = [],
			missingCount = 0;
		

		for(var i = 0; i < Game.cols; i++) {
			for(var j = 0; j < Game.rows; j++) {
				var gem = document.getElementById('gem'+i+''+j);
				if(!gem) {
					missingCount+=1;
				}
			}

			missing.push(missingCount);
			missingCount = 0;
		}

		return missing;
	}

	Game.gemCreate = function(i,j) {
		var gem = document.createElement('div'),
			gemY = (Game.rows-1)-j;

		gem.id = 'gem'+i+''+gemY;
		gem.className = 'gem '+Game.randomGem();
		gem.style.bottom = gemY*Game.tileSize
		gem.style.left = i*Game.tileSize;
		gem.style.height = Game.tileSize;
		gem.style.width = Game.tileSize;

		gem.setAttribute('data-coords',i+''+j);

		Game.board.appendChild(gem);
	}

	Game.generateNewGems = function() {
		var missing = Game.getMissingCount();

		for(var i = 0; i < missing.length; i++) {
			for(var j = 0; j < missing[i]; j++) {
				Game.gemCreate(i,j);
			}
		}
	}

	// reset the columns
	Game.resetCols = function() {
		var newPos = 0;

		for(var i = 0; i < Game.cols; i++) {
			for(var j = 0; j < Game.rows; j++) {
				var gem = document.getElementById('gem'+i+''+j);

				if(!gem) {
					newPos+=1;
				} else {
					gem.style.bottom = gem.style.bottom.replace('px','')-(newPos*Game.tileSize);
				}
			}
			newPos = 0;
		}
	}

	// reset each gems coordinates in the columns
	Game.resetGems = function() {
		var newY = 0;
		for(var i = 0; i < Game.cols; i++) {
			for(var j = 0; j < Game.rows; j++) {
				var gem = document.getElementById('gem'+i+''+j);

				if(gem) {
					gem.id = 'gem'+i+''+newY;
					gem.setAttribute('data-coords',i+','+newY);
					newY+=1;
				}
			}

			newY = 0;
		}
	}
	
	// randomly generate a gem type
	Game.randomGem = function() {
		var gemsLen = Game.gems.length,
			x = Math.floor(Math.random()*gemsLen);
			
		return Game.gems[x];
	}
	
	Game.resetMatches = function() {
		for(var i = 0; i < Game.matches.length; i++) {
			for(var j = 0; j < Game.matches.length; j++) {
				delete Game.matches[i][j];
				Game.matches[i].length = 0;
			}
		}

		Game.matches.length = 0;
	}

	Game.getGemX = function(gem) {
		var coords = gem.getAttribute('data-coords');
		
		if(typeof coords !== 'undefined') {
			return  coords.split(',')[0];
		}	
	}

	Game.getGemY = function(gem) {
		var coords = gem.getAttribute('data-coords');
		
		if(typeof coords !== 'undefined') {
			return  gem.getAttribute('data-coords').split(',')[1];
		}
	}

	Game.getInitials = function() {
		if(localStorage["initials"]) {
			return localStorage["initials"];
		}

		return '';
	}
	
}(Game,jQuery));

$(function(){
	Game.init();
});