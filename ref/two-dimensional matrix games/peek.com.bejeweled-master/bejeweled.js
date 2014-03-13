    //Class: GamePiece *-------------------------------------------------------
        function GamePiece(){
            //Instance Members
            this.shape = "";
            this.markedForRemoval = false;
            //End Instance Members

            //Instance Methods
            this.setRandomShape = function(){
                this.shape = Math.floor(Math.random() * GamePiece.shapes.length);
            }

            this.setNextShape = function(){
                this.shape++;
                if(this.shape > GamePiece.shapes.length - 1) this.shape = 0;
            }

            this.markForRemoval = function(){
                this.markedForRemoval = true;
            }
            //End Instance Methods

            //Constructor
            this.setRandomShape();
            //End Constructor
        }

        //Public Static Members
        GamePiece.shapes = [
                    {   'name':'circle',
                        'url':'circle.png'
                    },
                    { 'name':'triangle',
                        'url':'triangle.png'
                      },
                    {   'name':'square',
                        'url':'square.png'
                    },
                    {  'name':'diamond',
                        'url':'diamond.png'
                    }
        ];
        //End Public Static Members
    //End Class: GamePiece *---------------------------------------------------

    //Class: GameBoard *-------------------------------------------------------
        function GameBoard(){
            //Instance Members
            this.currentState = GameBoard.states.idle;
            this.target = $("#gameboard");
            this.gamePieces = new Array();
            this.initialGamePiece = "";
            this.targetGamePiece = "";
            this.rangeStart = "";
            this.rangeEnd = "";
            this.matchMade = false;
            this.initialMatch = true;
            this.score = 0;
            //End Instance Members

            //Instance Methods
            this.setState = function(state){
                this.currentState = state;
            }
            this.getState = function(){
                return this.currentState;
            }

            this.setInitialGamePiece = function(piece){
                this.initialGamePiece = piece;
            }
            this.getInitialGamePiece = function(piece){
                return this.initialGamePiece;
            }

            this.setTargetGamePiece = function(piece){
                this.targetGamePiece = piece;
            }
            this.getTargetGamePiece = function(piece){
                return this.targetGamePiece;
            }

            this.swap = function(){
                //setting the state here prevents additional clicking while we try the swap
                this.setState(GameBoard.states.matching);
                var numInitial = Number(this.initialGamePiece);
                var numTarget = Number(this.targetGamePiece);

                if (numTarget == numInitial - GameBoard.cols ||
                    numTarget == numInitial + 1 ||
                    numTarget == numInitial + GameBoard.cols ||
                    numTarget == numInitial - 1){
                    //okay to swap
                    var temp = "";
                    temp = this.gamePieces[numInitial];
                    this.gamePieces[numInitial] = this.gamePieces[numTarget];
                    this.gamePieces[numTarget] = temp;

                    return true;
                }else{
                    //not okay to swap
                    this.setState(GameBoard.states.swapping);
                    return false;
                }
            }

            this.match = function(){
                for(var row = 0; row < GameBoard.rows; row++){
                    if(this.rangeEnd == "") {
                        //length of array - 3 for last matching in row
                        this.rangeEnd = this.gamePieces.length - 3;
                    }else{
                        this.rangeEnd = this.rangeStart  - 3;
                    }

                    this.rangeStart = this.rangeEnd - GameBoard.cols + 3;

                    for (var piece = this.rangeStart; piece <= this.rangeEnd; piece++) {
                        if (this.gamePieces[piece].shape == this.gamePieces[piece+1].shape && this.gamePieces[piece+1].shape == this.gamePieces[piece+2].shape){
                            this.matchMade = true;
                            if(this.initialMatch){
                                this.gamePieces[piece+1].setNextShape();
                                this.gamePieces[piece+2].setNextShape();
                            }else{
                                this.gamePieces[piece].markForRemoval();
                                this.gamePieces[piece+1].markForRemoval();
                                this.gamePieces[piece+2].markForRemoval();
                            }
                        }
                    }
                }

                this.rangeEnd = "";
                this.rangeStart = "";

                for(var col = 0; col < GameBoard.cols; col++){
                    this.rangeEnd = col + ((GameBoard.rows-3)*GameBoard.cols);
                    for(piece = col; piece <= this.rangeEnd; piece = piece + GameBoard.rows){
                        if(this.gamePieces[piece].shape == this.gamePieces[piece+GameBoard.rows].shape && this.gamePieces[piece+GameBoard.rows].shape == this.gamePieces[piece+(GameBoard.rows*2)].shape){
                            this.matchMade = true;
                            if(this.initialMatch){
                                this.gamePieces[piece+GameBoard.rows].setNextShape();
                                this.gamePieces[piece+GameBoard.rows*2].setNextShape();
                            }else{
                                this.gamePieces[piece].markForRemoval();
                                this.gamePieces[piece+GameBoard.rows].markForRemoval();
                                this.gamePieces[piece+GameBoard.rows*2].markForRemoval();
                            }
                        }
                    }
                }

                this.rangeEnd = "";
                this.rangeStart = "";

                if (this.matchMade){
                    this.matchMade = false;
                    if (this.initialMatch) this.match();
                    this.matchMade = false;
                    this.initialMatch = false;
                    return true;
                }else{
                    this.initialMatch = false;
                    return false;
                }
            }

            this.drop = function(){
                for (var piece = this.gamePieces.length - 1; piece >= 0; piece--) {
                    if(this.gamePieces[piece].markedForRemoval && piece >= GameBoard.cols){

                        var multiplier = 1;
                        do{
                            var pieceFound = false;
                            var pieceToTest = piece - (GameBoard.cols*multiplier);
                            var resultPiece = "";
                            var assignNewPiece = false;
                            if(pieceToTest >= 0 &&
                                !this.gamePieces[pieceToTest].markedForRemoval){
                                    pieceFound = true;
                                    resultPiece = this.gamePieces[pieceToTest];
                            }else if(pieceToTest < 0){
                                resultPiece = new GamePiece();
                                this.score += 10;
                                $("#scoreBox").text(this.score);
                                assignNewPiece = true;
                                pieceFound = true;
                            }
                            multiplier++;
                        }while(pieceFound == false);

                        var temp = this.gamePieces[piece];
                        this.gamePieces[piece] = resultPiece;
                        this.gamePieces[pieceToTest] = temp;

                        if(assignNewPiece){
                            this.target.children().eq(piece).attr("src",GamePiece.shapes[resultPiece.shape].url);
                            this.target.children().eq(piece).attr("alt",GamePiece.shapes[resultPiece.shape].name);
                        }
                    }else if(this.gamePieces[piece].markedForRemoval){
                        this.gamePieces[piece] = new GamePiece();
                        this.score += 10;
                        $("#scoreBox").text(this.score);
                        this.target.children().eq(piece).attr("src",GamePiece.shapes[this.gamePieces[piece].shape].url);
                        this.target.children().eq(piece).attr("alt",GamePiece.shapes[this.gamePieces[piece].shape].name);
                    }
                }    
            }
            //End Instance Methods

            //Constructor
            for (var piece = 0; piece < GameBoard.rows * GameBoard.cols; piece++) {
                    this.gamePieces[piece] = new GamePiece();
                    this.target.append("<img src='"+GamePiece.shapes[this.gamePieces[piece].shape].url+"' />");
            }
            //End Constructor            
        }

        //Public Static Members
        GameBoard.states = {
            idle: {'name':'idle'},
            swapping: {'name':'swapping'},
            matching: {'name':'matching'},
            dropping: {'name':'dropping'}
        };

        GameBoard.rows = 8;
        GameBoard.cols = 8;
        //End Public Static Members
    //End Class: GameBoard *---------------------------------------------------

    //Class: View *------------------------------------------------------------
        function View(gameBoard){
            //Instance Members
            this.initialGamePiece = "";
            this.targetGamePiece = "";
            this.initialMatch = true;
            //End Instance Members

            //Instance Methods
            this.setInitialGamePiece = function(piece){
                this.initialGamePiece = piece;
            }
            this.getInitialGamePiece = function(){
                return this.initialGamePiece;
            }

            this.setTargetGamePiece = function(piece){
                this.targetGamePiece = piece;
            }
            this.getTargetGamePiece = function(){
                return this.targetGamePiece;
            }

            this.getHighScores = function(){
                var params = new Object();
                params.method = "highScores";

               $.post("score.php",params,"json")
                .done(function(data) {
                    $("#highScores table").html("<tr><th colspan='2'>High Scores</th></tr>");
                            
                    $.each(data.highScores,function(key,val){
                        $.each(val, function(subkey, subval){
                            if (subkey == "user"){
                                $("#highScores table").append("<tr><td>"+ val["user"] + "</td><td>" + val["score"] + "</td></tr>");
                            }
                        });
                    });
                })
                .fail(function(jqxhr, textStatus, error) {
                    var err = textStatus + ', ' + error;
                    alert("HighScores Specific error: "+ err);
                });
            }            

            this.swap = function(){
                var temp = this.initialGamePiece.clone();
                this.initialGamePiece.replaceWith(this.targetGamePiece.replaceWith(temp));
                this.initialGamePiece = temp;
            }

            this.match = function(){
                for (var piece = 0; piece < gameBoard.gamePieces.length; piece++) {
                    if(this.initialMatch){
                        gameBoard.target.children().eq(piece).attr("src",GamePiece.shapes[gameBoard.gamePieces[piece].shape].url);
                    }

                    if(gameBoard.gamePieces[piece].markedForRemoval == true){
                        gameBoard.target.children().eq(piece).toggleClass("mark");
                    }
                }
                if(this.initialMatch){
                    gameBoard.setState(GameBoard.states.idle);
                    this.initialMatch = false;
                }
            }

            this.drop = function(){
                for (var piece = gameBoard.gamePieces.length - 1; piece >= 0; piece--) {
                    if(gameBoard.gamePieces[piece].markedForRemoval == true){
                        gameBoard.target.children().eq(piece).addClass("destroy");
                    }
                }

                for (var piece = gameBoard.gamePieces.length - 1; piece >= 0; piece--) {
                    var thisPiece = gameBoard.target.children().eq(piece);

                    if(thisPiece.hasClass("destroy") && piece >= GameBoard.cols){
                        var multiplier = 1;
                        do{
                            var pieceFound = false;
                            var pieceToTest = piece - (GameBoard.cols*multiplier);
                            var resultPiece = "";
                            var assignNewPiece = true;
                            if(pieceToTest >= 0 &&
                                !gameBoard.target.children().eq(pieceToTest).hasClass("destroy")){
                                    pieceFound = true;
                                    resultPiece = gameBoard.target.children().eq(pieceToTest);
                            }else if(pieceToTest < 0){
                                assignNewPiece = false;
                                pieceFound = true;
                            }
                            multiplier++;
                        }while(pieceFound == false);

                        if(assignNewPiece){
                            var temp = thisPiece.clone();
                            thisPiece.replaceWith(resultPiece.replaceWith(temp));
                        }
                    }
                }
            }
            //End Instance Methods

            //Constructor

            //End Constructor            
        }

        //Public Static Members

        //End Public Static Members
    //End Class: View *--------------------------------------------------------

        $(document).ready(function() {
            var bejeweled = new GameBoard();
            var view = new View(bejeweled);
            bejeweled.match();
            view.match();
            view.getHighScores();

            //whoa. jquery only attaches event handlers to objects that currently exist.  found out the hard way. better use a different method.
            //$("#gameboard img").click(function(){
            $("#gameboard").on("click", "img", function(){
                if (bejeweled.getState() == GameBoard.states.idle){
                    if (bejeweled.getInitialGamePiece() == "") {
                        bejeweled.setState(GameBoard.states.swapping);
                        $(this).toggleClass("glow");
                        bejeweled.setInitialGamePiece($(this).index());
                        view.setInitialGamePiece($(this));                    
                    }
                    //return to prevent the swapping state from dropping through to the next click action
                    return;
                }

                if (bejeweled.getState() == GameBoard.states.swapping){
                    if(view.getInitialGamePiece().index() == $(this).index()){
                        bejeweled.setState(GameBoard.states.idle);
                        view.getInitialGamePiece().toggleClass("glow");
                        bejeweled.setInitialGamePiece("");
                        view.setInitialGamePiece("");
                        return;
                    }else if(view.getInitialGamePiece().index() != $(this).index()){
                        bejeweled.setTargetGamePiece($(this).index());
                        if(bejeweled.swap()){
                            view.setTargetGamePiece($(this));
                            view.initialGamePiece.removeClass("glow");
                            $(this).removeClass("glow");
                            view.swap();
                        }
                    }
                }

                if (bejeweled.getState() == GameBoard.states.matching){
                    if(bejeweled.match()){
                        view.match();
                        bejeweled.setState(GameBoard.states.dropping);
                    }else{
                        //If it's not a match, put things back where we found them.
                        $("#message").text("Invalid Match").fadeOut(1300,function(){
                            $(this).text("");
                            $(this).css("display","block");
                        });

                        bejeweled.swap();
                        view.swap();
                        bejeweled.setInitialGamePiece("");
                        bejeweled.setTargetGamePiece("");
                        view.setInitialGamePiece("");
                        view.setTargetGamePiece("");
                        bejeweled.setState(GameBoard.states.idle);
                    }
                }

                if (bejeweled.getState() == GameBoard.states.dropping){
                    while(bejeweled.match()){
                        view.match();
                        view.drop();
                        bejeweled.drop();
                        bejeweled.target.children().removeClass("destroy");
                        bejeweled.target.children().removeClass("mark");
                    }
                    bejeweled.setInitialGamePiece("");
                    bejeweled.setTargetGamePiece("");
                    view.setInitialGamePiece("");
                    view.setTargetGamePiece("");
                    bejeweled.setState(GameBoard.states.idle);
                }
            });

            $("#scoreButton").on("click", function(){
                var params = new Object();
                params.user =prompt("Please enter your name to be recorded with the score.")
                if (params.user == "") params.user = "Anonymous";
                params.method = "store";
                params.score = $("#scoreBox").text();

                $.post("score.php",params,"json")
                .done(function(data) {
                    alert("Score "+data.score+" recorded for player "+data.user+"!");
                    view.getHighScores();
                })
                .fail(function(jqxhr, textStatus, error) {
                    var err = textStatus + ', ' + error;
                    alert("Specific error: "+ err);
                });

                return false;
            });
        });