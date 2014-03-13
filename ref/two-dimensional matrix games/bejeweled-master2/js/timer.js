(function(Game){
    Game.initTimer = function() {
        var minutes = 1,
            seconds = 0,
            totalTime = minutes*60 + seconds,
            el = document.getElementById('timer');
        
        Game.updateTimer = function() {
            var clockMins = Math.floor( totalTime / 60 ),
                clockSecs = totalTime % 60,
                time;

            if(totalTime == 0) {
                Game.saveScore();
                Game.appendHighScores();
                Game.modal.style.display = 'block';
                Game.menu.style.display = 'block';

                clearInterval(Game.frames);
            }


            if (clockMins < 10) {
                clockMins = "0" + clockMins;
            }

            if (clockSecs < 10) {
                clockSecs = "0" + clockSecs; 
            }

            time = clockMins + ':' + clockSecs;

            el.innerHTML = time;

            totalTime--;
        }
    }
}(Game));