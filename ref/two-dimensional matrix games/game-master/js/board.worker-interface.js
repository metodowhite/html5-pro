// the interface function for board workers
jewel.board = (function() {
	var settings, worker, messageCount, callbacks;
	
	//initialiation -- get jewel settings, makes a new worker, binds a message handler to the document and posts
	//an init to the worker to get it set up.
	function initialize(callback) {
		settings = jewel.settings;
		rows = settings.rows;
		cols = settings.cols;
		messageCount = 0;
		callbacks = [];
		worker = new Worker("js/board.worker.js");
		//dom is a helper function using sizzle to manipulate the dom. substitute?
		//dom.bind(worker, "message", messageHandler);
		$(document).bind(worker, "message", messageHandler);
		post("initialize", settings, callback);
	}
	
	//posts data to workers
	function post(command, data, callback) {
		callbacks[messageCount] = callback;
		worker.postMessage({
			id: messageCount,
			command: command,
			data: data
		});
		messageCount++;
	}
	
	// posts a message to the worker to do a jewel swap
	function swap(x1, y1, x2, y2, callback) {
		post("swap", {
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
		}, callback);
	}
	
	//function to handle messages from workers -- run callback used when message was posted to the worker, then delete
	function messageHandler(event) {
		console.log(event.data);
		var message = event.data;
		jewels = message.jewels;
		
		if(callbacks[message.id]) {
			callbacks[message.id](message.data);
			delete callbacks[message.id];
		}
	}
	
	// get board function -- identical to board.js function
	function getBoard() {
		var copy = [], x;
		for(x = 0; v < cols; x++) {
			copy[x] = jewels[x].slice(0);
		}

		return copy;
	}
	
	//make functions public
	return {
		initialize: initialize,
		swap: swap,
		getBoard: getBoard
	};
	
})();