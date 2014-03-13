jewel.screens['main-menu'] = (function() {
    firstRun = true;
    function setup() {
		// on click change the screen
        $('button').click(function() {
            jewel.game.showScreen($(this).attr('name'));          
        });
    }
	
	// exposed function to 'run' the main menu
    function run(){
        if(firstRun){
            firstRun = false;
            setup();
        }
    }

    return {
        run: run
    };
})();
    
