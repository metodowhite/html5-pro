//input handler
jewel.input = (function() {
	var settings = jewel.settings, inputHandlers;
	var keys = {
		37: "KEY_LEFT",
		38: "KEY_UP",
		39: "KEY_RIGHT",
		40: "KEY_DOWN",
		13: "KEY_ENTER",
		32: "KEY_SPACE",
		65: "KEY_A",
		66: "KEY_B",
		67: "KEY_C"
	};
	
	// initialization functions -- sets up objects and keybinding
	function initialize() {
		inputHandlers = {};
		var board = $('#game-screen .game-board');
		
		// check to see if a keypress is equal to a defined key code adn then
		// triggers an event if it is
		$(document).bind("keydown", function(e) {
			var keyName = keys[event.keyCode];
			if(keyName && settings.controls[keyName]) {
				event.preventDefault();
				trigger(settings.controls[keyName]);
			}
		});
		// binds mousedown and touch start handlers
		board.bind("mousedown", function(e) {
			handleClick(e, "CLICK", e);
		});
		board.bind("touchstart", function(e) {
			handleClick(e, "TOUCH", event.targetTouches[0]);
		});
	}
	
	//function to handle any click events
	function handleClick(event, control, click) {
		var action = settings.controls[control];

		if(!action) {
			return;
		}
		// obvious -- get X and Y of jewel that was clicked and trigger the
		// bound action
		var board = $('#game-screen .game-board')[0], 
		rect = board.getBoundingClientRect(),
		relX, relY, jewelX, jewelY;
		
		relX = click.clientX - rect.left;
		relY = click.clientY - rect.top;
		
		jewelX = Math.floor(relX / rect.width * settings.cols);
		jewelY = Math.floor(relY / rect.height * settings.rows);

		trigger(action, jewelX, jewelY);
		
		event.preventDefault();
	}
	
	//pushes a handler to an inputHandler defined by 'action'
	function bind(action, handler) {
		if(!inputHandlers[action]) {
			inputHandlers[action] = [];
		}
		inputHandlers[action].push(handler);
	}
	
	//calls any handlers pushed to inputHandlers[action] as well as any additional args
	//passed to the function are sent to the handlers via apply
	function trigger(action){
		var handlers = inputHandlers[action],
		//get anything else passed to trigger past action:
		args = Array.prototype.slice.call(arguments, 1);
		if(handlers) {
			for(var i = 0; i < handlers.length; i++) {
				handlers[i].apply(null, args);
			}
		}
	}
	
	return {
		initialize: initialize,
		bind: bind
	};
})();