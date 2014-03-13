// LOADER SCRIPT -- preloads assets and checks compatiblity using Modernizr / yepnope

// main objects of 'jewel' name space -- keep track of all "global vars
var jewel = {
    screens: {},
	images: {},
	settings: {
		rows: 8,
		cols: 8,
		baseScore: 100,
		numJewelTypes: 7,
		controls: {
			KEY_UP: "moveUp",
			KEY_LEFT: "moveLeft",
			KEY_DOWN: "moveDown",
			KEY_RIGHT: "moveRight",
			KEY_ENTER: "selectJewel",
			KEY_SPACE: "selectJewel",
			CLICK: "selectJewel",
			TOUCH: "selectJewel"
		},
		baseLevelTimer: 60000,
		baseLevelScore: 1500,
		baseLevelExp: 1.05
	}
};

//listen for 'load' event
window.addEventListener('load', function() {

	// uses 1 em div to calculate the size that one jewel should be
	var jewelProto = document.getElementById("jewel-proto"), rect = jewelProto.getBoundingClientRect();
	jewel.settings.jewelSize = rect.width;
		
	Modernizr.addTest("standalone", function() {
		return(window.navigator.standalone != false);
	});

	// add preloader for webworker scripts -- not used yet
	yepnope.addPrefix("preload", function(resource) {
		resource.noexec = true;
		return resource;
	});
	
	// add loader for images
	var numPreload = 0, numLoaded = 0;
	yepnope.addPrefix("loader", function(resource) {
		console.log("Loading: "+resource.url);
		var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
		resource.noexec = isImage;
		numPreload++;
		resource.autoCallback = function(e){
			console.log("Finished loading: "+resource.url);
			numLoaded++;
			if(isImage){
				var image = new Image();
				image.src = resource.url;
				jewel.images[resource.url] = image;
			}
		};
		return resource;
	});
	
	// helper function to return the current load progress for the splash screen
	function getLoadProgress() {
		if (numPreload > 0) {
			return numLoaded / numPreload;
		} else {
			return 0;
		}
	}
	
	// tests and assets to be loaded
	Modernizr.load([
	{
		load: [
			"js/jquery.js",
			"js/requestAnimationFrame.js",
			"js/game.js"
		]
	}, {
		test: Modernizr.standalone,
		yep: "js/screen.splash.js",
		nope: "js/screen.install.js",
		
		complete: function() {
			// set up background, touchscreen stuff
			jewel.game.setup();
			//if standalone load the game, if not, show the install screen to get iOS users to bookmark it
			if(Modernizr.standalone) {
				jewel.game.showScreen("splash-screen", getLoadProgress);
			} else {
				jewel.game.showScreen("install-screen");
			}
		}
	}
	]);

	if(Modernizr.standalone) {
		Modernizr.load([
		{
			test: Modernizr.webworkers,
			yep: [
				"loader!js/board.js"
				//"preload!js/board.worker.js" -- too add/fix later
				],
			nope: "loader!js/board.js"
		}, {
			load: [
				"loader!js/input.js",
				"loader!js/display.canvas.js",
				"loader!js/screen.main-menu.js",
				"loader!js/screen.game.js",
				"loader!images/jewels" + jewel.settings.jewelSize + ".png"
			]	
		}
		]);
	}
});
