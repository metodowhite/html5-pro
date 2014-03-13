(function(Game){
    Game.initScore = function() {
        var score = document.getElementById('score'),
            highScores = localStorage["highScores"],
            leaderBoardLength = 5;

        Game.updateScore = function() {
            var currentScore = score.innerHTML,
                newScore = 0;

            for(var i = 0; i < Game.matches.length; i++) {
                newScore++;
            }

            newScore = +newScore*100; // 100 points per gem matched

            if(newScore !== 0) {
                score.innerHTML = '';
                score.innerHTML = +newScore+(+currentScore);

                newScore = 0;               
            }
        }

        Game.saveScore = function() {
            var currentScore = score.innerHTML,
                highScores = Game.getHighScores(),
                newHighScores = [];
            
            if(highScores != null) {
                if(typeof highScores.length == 'undefined') {
                    newHighScores.push(currentScore);
                    newHighScores.push(highScores);
                    newHighScores.sort(sortByNum);
                    newHighScores.reverse();
                } else {
                    for(var i = 0; i < highScores.length; i++) {
                        newHighScores.push(highScores[i]);
                    }

                    newHighScores.push(currentScore);
                    newHighScores.sort(sortByNum);
                    newHighScores.reverse();
                    console.log(newHighScores);
                    if(newHighScores.length > leaderBoardLength) {
                        newHighScores.pop();    
                    }
                }
            } else {
                newHighScores.push(currentScore);
            }
            
            localStorage["highScores"] = newHighScores.toString();
        }

        Game.getHighScores = function() {
            var scores = localStorage["highScores"].toString();

            if(scores !== '') {
                scores = scores.split(',');

                return scores;
            }
            
            return null;
        }

        Game.appendHighScores = function() {
            var ol = document.createElement('ol'),
                highScoreDiv = document.getElementById('highScores'),
                highScores = Game.getHighScores();

            highScoreDiv.innerHTML = '';
            
            if(highScores && typeof highScores.length !== 'undefined') {
                for(var i = 0; i < highScores.length; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = highScores[i];
                    highScoreDiv.appendChild(ol);
                    ol.appendChild(li);
                }
            } else if(highScores){
                var li = document.createElement('li');
                li.innerHTML = Game.highScores;
                highScoreDiv.appendChild(ol);
                ol.appendChild(li);
            }
        }
    }
}(Game));