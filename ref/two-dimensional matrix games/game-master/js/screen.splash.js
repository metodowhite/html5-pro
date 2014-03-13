//splash screen

jewel.screens['splash-screen'] = (function() {
    firstRun = true;
    function setup(getLoadProgress) {
        
		// function uses getLoadProgress to check the current load state. call it every 30ms until all assets are loaded
		// then adds a click handler to the main menu (i immediately remove it because i don't want this interfering with
		// the click handler in the main menu -- i could probably do it more elegantly, but this works
		function checkProgress() {
			var p = getLoadProgress() * 100;
			$(".indicator").css("width", p+"%");
			if(p == 100) {
				$('#continue').css("display", "block");
				$('.progress').css("display", "none");
				$(document).click(function() {
					$(document).unbind('click');
					jewel.game.showScreen('main-menu');
				});
			} else {
				setTimeout(checkProgress, 30);
			}
		}
        checkProgress();
    }
	
	//exposed function to run screen -- uses getLoadProgress to display loading bar
    function run(getLoadProgress){
        if(firstRun) {
            setup(getLoadProgress);
            firstRun = false;
        }
    }

    return {
        run: run
    };
})();
