//preloaded, so we need a jewel object declared to avoid errors
var jewel = {};

//imports board.js for the workers
importScripts("board.js");

//listens for a message - when it gets one, imports board info from loaded script
addEventListener("message", function(event) {
    var board = jewel.board, message = event.data;
	
	//based on the command from the message, do different things: either initialize or swap
	switch(message.command) {
		case "initialize":
			jewel.settings = message.data;
			board.initialize(callback);
			break;
		case "swap":
			board.swap(message.data.x1, message.data.y1, message.data.x2, message.data.y2, callback);
			break;
	}
	
	//callback function to post a message back to the main script after work is done
	function callback(data) {
		postMessage({
			id: message.id,
			data: data,
			jewels: board.getBoard()
		});
	}
}, false);
