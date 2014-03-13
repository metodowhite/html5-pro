var game = (function () {

    // game Globals

    var OuterGemSize   = 84;
    var GemSize        = 80;
    var BorderSize     = 2;
    var NumGems        = 8;
    var Board          = [];
    var BoardSize      = 8
    var CanClick       = true;
    var AnimationSpeed = 500;
    var NumHints       = 0;
    var GameTracker    = [];
    var IsBoring       = false;
    var $Score         = $("#score");
    var Score          = 0;

    // Coords object for keeping track of gems
    var Coords = function (row, col) {
        this.row = row;
        this.col = col;
    };


    // Keeps track of gems the user has clicked on
    // first & second and DOM elemnts
    var SelectedGems = { 
        first: 0,
        second: 0,
    };


    //////////////////////////////////////////////////////////////////////
    // Misc functions
    //////////////////////////////////////////////////////////////////////

    // Get a random value for the gem
    function newGemVal() {
        return Math.floor(Math.random() * NumGems);
    };

    // A valid swap occurs when the first & second gems are adjacent horizontally or vertically
    function isValidSwap($gem, row, col) {
        var firstRow = $gem.data("row");
        var firstCol = $gem.data("col");
        return (Math.abs(firstRow - row) == 1 && firstCol == col)
                || (Math.abs(firstCol - col) == 1 && firstRow == row)
    };

    //Eliminate the Lawrences and use colors instead
    function beBoring() {
        if (!IsBoring) {
            $(".gem").addClass("boring");
            $("#boring").html("See Colors")
            IsBoring = true;
        }
        else {
            $(".gem").removeClass("boring");
            $("#boring").html("See Faces");
            IsBoring = false;
        }
    }

    //////////////////////////////////////////////////////////////////////
    // Scoring functions
    //////////////////////////////////////////////////////////////////////

    // Calculate the score.  Users are penalize 100 points for a hint
    // and get more points when a swap matches more than 3 gems
    function calculateScore(num) {
        // Penalize for a hint
        if (num == -1)
            return num * 100;
        else
            return ((num - 3) * 20) + num * 10;
    }

    // Update the score span
    function updateScore(num) {
        var oldScore = parseInt($Score.html());
        var newScore = oldScore + calculateScore(num);
        Score = newScore;
        $Score.html(newScore).data("id", newScore);
    }
    // Temp place to update the high score information
    // Most of this will go in the ajax call and will be updated from the server (someday, maybe)
    function updateHighScore() {
        $("#highScore").html(Score).data("id", Score);
        $("#highscore-name").html($("#username").val());
        var tempDate = new Date();
        $("#highscore-date").html(tempDate.format("MM/dd/yyyy"))
        $("#board").append("<div id='new-high-score'></div><div class='new-high-score-text'>New High Score!</div>");
    }

    // Return the current high score
    function getCurrentHighScore() {
        return $("#highScore").data("id");
    }

    // GameTracker keeps track of the moves so we can calculate the score at any time
    //  This helps prevent a use from simple using browser dev tools to update a DOM element
    //  and submit an arbitrary score
    //  This is also checked serverside
    function verifyScore() {
        var score = 0;
        GameTracker.forEach(function (val, i) {
            score += calculateScore(val);

        });
        score -= (100 * NumHints);
        return score == Score;
    }
    //////////////////////////////////////////////////////////////////////
    // Basic game functions
    //////////////////////////////////////////////////////////////////////

    // Reset the SelectedGems and let the user start a new move
    function newMove() {
        SelectedGems = {
            first: 0,
            second: 0,
        };

        CanClick = true;
    };

    // End the game
    function endGame() {
        CanClick = false;
        // I got lazy here with the nesting and DOM manipulation
        if (verifyScore()) {
            if (Score > getCurrentHighScore())
                if (!$("#username").valid()) {
                    $("#score-submit").html("Submit");
                    $("#board").append("<div id='new-high-score'></div><div class='new-high-score-text'>New High Score!<br />Please enter your name and slick submit.</div>");
                }
                else {
                    if ($("#new-high-score").length > -1) {
                        $("#new-high-score").remove();
                        $(".new-high-score-text").remove();
                    }
                    updateHighScore();
                }
            else
                $("#board").append("<div class='game-over'></div><div class='game-over-text'>Game Over</div>");
        }

        else {
            $("#board").append("<div class='game-over'></div><div class='nope'></div>");
            return false;
        }

        return true;
        
    }


    //////////////////////////////////////////////////////////////////////
    // Debugging functions
    //////////////////////////////////////////////////////////////////////

    // Draws the board array for easy reference and updates the gem html
    function drawBoardValues() {
        $("#bv").html("");
        for (row = 0; row < 8; row++) {
            for (col = 0; col < 8; col++) {

                var x = 1;
                $("<span/>",
                {
                    "class": "bv-cell",
                    "html": Board[row][col]
                }).appendTo("#bv");
                $gem = gemAt(row, col);
                $gem.html(row + "," + col + "<br>" + $gem.data("id"))
            }
            $("<div/>",
            {
                "class": "bv-row"
            }).appendTo("#bv");
        }

    };

    //////////////////////////////////////////////////////////////////////
    // Gem DOM Manipulation & Access
    //////////////////////////////////////////////////////////////////////

    // Create a new gem DOM element
    function createGem(row, col, value, top, left) {
        top = top === undefined ? row * OuterGemSize : top;
        var theClass = IsBoring ? "gem boring face-" + value : "gem face-" + value;
        return $("<div/>",
        {
            "id": "gem-" + row + "-" + col,
            "class": theClass,
            "css": { "top": top, "left": col * (GemSize + 2 * BorderSize), "color": "#fff", "textAlign": "center", "fontWeight": "bold" },
            "data-id": value,
            "data-row": row,
            "data-col": col
        });
    }

    // Get a jQuery gem object given row and column
    function gemAt(row, col) {
        return $("#gem-" + row + "-" + col);
    };

    // Takes a jQuery gem object and updates its id, data-id, data-col and data-row properties
    function updateGemProperties($gem, row, col, val) {
        if (row !== undefined)
            $gem.data("row", row);

        if (row !== undefined)
            $gem.data("col", col);

        if ((row !== undefined) && (col !== undefined))
            $gem.attr("id", "gem-" + row + "-" + col)

        if (val !== undefined)
            $gem.data("id", val);

        return $gem;
    }


    //////////////////////////////////////////////////////////////////////
    // Creating the board
    //
    // The board is just a 2d array.  Each value in the array is mapped
    // to a DOM element by virtue of the elements naming convention.
    // Board[x][y] = <div id="gem-x-y" />
    //////////////////////////////////////////////////////////////////////
    
    // Generate the board array.  This is the underlying data of the board
    function makeBoardArray(random) {
        // Normally we want a random board, but sometimes for testing I'll make a board in a weird way
        if (random == true | typeof (random) === "undefined") {
            for (row = 0; row < 8; row++) {
                Board[row] = [];
                for (col = 0; col < 8; col++) {
                    var val = newGemVal();
                    Board[row][col] = val;
                }
            }

            // Make sure the initial board doesn't have any matches
            for (row = 0; row < 8; row++) {
                for (col = 0; col < 8; col++) {
                    var match = checkForMatch(row, col);
                    if (match.length > 0)
                        makeBoardArray(random);
                }
            }
        }

    }

    // Insert DOM elements corresponding to the board array
    function drawBoard() {
        makeBoardArray(true);
        for (row = 0; row < 8; row++) {
            for (col = 0; col < 8; col++) {
                createGem(row, col, Board[row][col]).addClass("toCheck").appendTo("#board");
            }
        }

        // If there aren't any valid moves redraw the board
        // todo -- check the board array instead of selecting DOM elements for this.  
        var anymatches = possibleMatches();
        if (anymatches.length <= 0) drawBoard();

    };


    //////////////////////////////////////////////////////////////////////
    // Swapping Gems
    //////////////////////////////////////////////////////////////////////

    // Initial swapping animation 
    function swapGems() {

        // Local vars to make code easier to read
        var horizDirection     = 0;
        var vertDirection      = 0;
        var firstGem           = {};
        var secondGem          = {};
        firstGem.initialRow    = SelectedGems.first.data("row");
        firstGem.initialCol    = SelectedGems.first.data("col");
        firstGem.initialValue  = SelectedGems.first.data("id");
        secondGem.initialRow   = SelectedGems.second.data("row");
        secondGem.initialCol   = SelectedGems.second.data("col");
        secondGem.initialValue = SelectedGems.second.data("id");

        // Swap values in the board array
        Board[firstGem.initialRow][firstGem.initialCol] = secondGem.initialValue;
        Board[secondGem.initialRow][secondGem.initialCol] = firstGem.initialValue;

        // Find the direction of the swap
        if (firstGem.initialCol != secondGem.initialCol) { // //horizontal swap
            horizDirection = (firstGem.initialCol > secondGem.initialCol) ? 1 : -1; // -1 = first gem to right, 1 = first gem to left
        }
        else {
            vertDirection = (firstGem.initialRow > secondGem.initialRow) ? 1 : -1; // -1 = first gem up, 1 = first gem down
        }

        // Animate the gem swap
        SelectedGems.first.animate({ left: "-=" + OuterGemSize * horizDirection, top: "-=" + OuterGemSize * vertDirection }, AnimationSpeed);
        var secondAnim = SelectedGems.second.animate(
            {
                left: "+=" + OuterGemSize * horizDirection,
                top: "+=" + OuterGemSize * vertDirection
            },
            {
                duration: AnimationSpeed,
            });

        // Wait until the second gem is done moving, then proceed...
        secondAnim.promise().done(function () {

            //See if either gem, once swapped, causes a match
            var gemOneMatch = checkForMatch(secondGem.initialRow, secondGem.initialCol);
            var gemTwoMatch = checkForMatch(firstGem.initialRow, firstGem.initialCol);

            // Get the matches resulting from the swap if any exist
            var matches = utility.arrayUnique(gemOneMatch.concat(gemTwoMatch));

            //If there are matches "complete" the swap
            if (matches.length > 0) {

                //Update the DOM so the gems have correct properties
                SelectedGems.first = updateGemProperties(SelectedGems.first, firstGem.initialRow - vertDirection, firstGem.initialCol - horizDirection);
                SelectedGems.second = updateGemProperties(SelectedGems.second, secondGem.initialRow - (-1 * vertDirection), secondGem.initialCol - (-1 * horizDirection));

                $(".highlight").removeClass("highlight");
                var removal = removeGems(matches);
            }

                // If there are no matches just put the gems back
            else {
                // Reset board values
                Board[firstGem.initialRow][firstGem.initialCol] = firstGem.initialValue;
                Board[secondGem.initialRow][secondGem.initialCol] = secondGem.initialValue;
                // Animate the gems going back to their original position
                SelectedGems.first.animate({ left: "+=" + OuterGemSize * horizDirection, top: "+=" + OuterGemSize * vertDirection }, AnimationSpeed);
                var secondAnim = SelectedGems.second.animate({ left: "-=" + OuterGemSize * horizDirection, top: "-=" + OuterGemSize * vertDirection },
                    {
                        duration: AnimationSpeed,

                    });
                // Reset the game after the gems are back home
                secondAnim.promise().done(function () {
                    $(".highlight").removeClass("highlight");
                    newMove();
                });
            }

        });

    };

    //////////////////////////////////////////////////////////////////////
    // Gem Removal
    //////////////////////////////////////////////////////////////////////
    
    // Removes the gems.  Takes an array of Coords
    function removeGems(gemCoords) {

        // The gems will be kept in this array and animated together.  Theoretically this will make
        //  the animations smoother by letting it all be done at once
        var animationStack = [];

        // At this point only the columns with marked gems matter
        var colsWithMarkedGems = [];

        updateScore(gemCoords.length);

        // Track the state of the game to verify the score
        GameTracker.push(gemCoords.length);

        // Go through the matched gems and update their board values to -1
        for (var i = 0; i < gemCoords.length; i++) {
            Board[gemCoords[i].row][gemCoords[i].col] = -1; // Mark the gem for deletion
            gemAt(gemCoords[i].row, gemCoords[i].col).remove(); // Remove gem from DOM
            if (colsWithMarkedGems.indexOf(gemCoords[i].col) == -1) // If this column hasn't been recorded yet do it here
                colsWithMarkedGems.push(gemCoords[i].col)
        }

        
        // Go through each column with marked gems...
        for (var i = 0; i < colsWithMarkedGems.length; i++) {
            
            var col = colsWithMarkedGems[i];
            var numMarkedGems = 0;

            // Go through each row in that column, starting with the lowest
            for (var row = 7; row >= 0; row--) {

                // If there are no marked gems below the current gem & the current gem has a 
                // value then there is nothing to do
                if (Board[row][col] != -1 && numMarkedGems == 0) continue;

                // If the gem is marked for deletion add one to numMarkedGems
                if (Board[row][col] == -1) numMarkedGems++

                // If the gem has a value and there are marked gems below it then we shift it down
                else {
                    // update the board array & dom
                    Board[row + numMarkedGems][col] = Board[row][col];
                    Board[row][col] = -1

                    // Update the DOM element corresponding to this gem      
                    var $gem = gemAt(row, col);
                    $gem = updateGemProperties($gem, row + numMarkedGems, col).addClass("toCheck");

                    // Keep track of how far this element will "fall" before it ends up in its new home.
                    $gem.data("toFall", (numMarkedGems * OuterGemSize));

                    // Add that gem to the animation stack to animate later
                    animationStack.push($gem);
                }

            }

            // Now create new gems to replace gems in this column that were deleted
            for (var newRow = (numMarkedGems - 1); newRow >= 0; newRow--) {
                var gemVal = newGemVal();

                // The gems are stacked in the correct order & height to make the animation smoother
                var top = -1 * ((numMarkedGems - newRow) * OuterGemSize);

                var $gem = createGem(newRow, col, gemVal, top).addClass("toCheck").appendTo("#board");
                $gem.data("toFall", (numMarkedGems * OuterGemSize));

                // Update the board array with the new gem's value
                Board[newRow][col] = gemVal;
                animationStack.push($gem);
            }

        }
        // Animate all the gems at the same time (more or less)
        var animation = animateGems(animationStack);

        // When the animation is done all the falled gems are checked to see if they make
        //  matches in their new positions
        animation.done(function () {
            checkMarkedGems();
        })
    }

    function animateGems(animationStack) {
        // Use a deffered object so animation can be batched into discrete buckets
        var deferred = new $.Deferred();

        // animate the stack
        for (var j = 0; j < animationStack.length; j++) {
            animationStack[j].animate({ top: "+=" + animationStack[j].data("toFall") }, { duration: AnimationSpeed })
        }

        // Wait until the animation is finished before resolving.
        // Using the animated selector is a quick way to get around setting up something like 
        // a queue of deferred objects.
        $(":animated").promise().done(function () {
            deferred.resolve();
        })
        return deferred.promise();
    }

    //////////////////////////////////////////////////////////////////////
    // Board checking
    //////////////////////////////////////////////////////////////////////

    // Check if a gem at particular coordinates makes a match (a streak of 3 or more gems)
    function checkForMatch(row, col) {
        // This will keep track of the coordinates of matched gems 
        var matchCoords = [];

        var valueToMatch = Board[row][col];

        // Law of identity -- the gem we're checking matches itself
        matchCoords.push(new Coords(row, col));

        //
        // Check Horizontally

        //Check to the left
        if (col > 0) {
            var tempCol = col;
            while (--tempCol >= 0 && Board[row][tempCol] == valueToMatch) {
                matchCoords.push(new Coords(row, tempCol));
            }
        }
        // Check to the right
        if (col < 7) {
            var tempCol = col;
            while (++tempCol <= 7 && Board[row][tempCol] == valueToMatch) {
                matchCoords.push(new Coords(row, tempCol));
            }
        }

        // If there isn't a streak of 3 matching gems, reset matchCoords
        if (matchCoords.length < 3) {
            matchCoords = [];
            matchCoords.push(new Coords(row, col));
        }

        //
        //Check Vertically

        //Check up
        if (row > 0) {
            var tempRow = row;
            while (--tempRow >= 0 && Board[tempRow][col] == valueToMatch) {
                matchCoords.push(new Coords(tempRow, col));
            }
        }

        //check down
        if (row < 7) {
            var tempRow = row;
            while (++tempRow <= 7 && Board[tempRow][col] == valueToMatch) {
                matchCoords.push(new Coords(tempRow, col));
            }
        }

        // If there isn't a streak of 3 matching gems, remove matchCoords.vert
        if (matchCoords.length < 3)
            matchCoords = [];

        return matchCoords;

    }

    // Check all gems with the class "toCheck" to see if they are in a 3+ streak
    function checkMarkedGems() {
        var allMatches = [];
        var flattenedMatches = [];

        $(".toCheck").each(function (val, i) {
            $check = $(".toCheck").first();
            $check.removeClass("toCheck");
            // Add the match coordinates to the allMatches array
            allMatches.push(checkForMatch($check.data("row"), $check.data("col")));
        });

        // Flatten and select only unique values in case a gem has been marked for removal more than once
        // This can happen if 1 gem is used in both a horiz and vert streak
        allMatches.forEach(function (val, i) {
            flattenedMatches = utility.arrayUnique(flattenedMatches.concat(val));
        })
        // If there are gems to remove go do it
        if (flattenedMatches.length > 0)
            removeGems(flattenedMatches);
        // No gems to remove means we reset check for a game over state
        else {
            newMove();
            var anyMoves = possibleMatches();
            if (anyMoves.length <= 0) endGame();
        }
    }

    // Returns coordinates of a gem that could be moved to make a match
    function possibleMatches() {

        for (var row = 0; row < (BoardSize - 1) ; row++) {
            for (var col = 0; col < (BoardSize - 1) ; col++) {
                //check out horiz matches
                if (col < 7) {
                    var orgVal = Board[row][col];
                    Board[row][col] = Board[row][col + 1];
                    Board[row][col + 1] = orgVal;
                    var matchOne = checkForMatch(row, col);
                    var matchTwo = checkForMatch(row, col + 1);
                    //reset board values
                    Board[row][col + 1] = Board[row][col];
                    Board[row][col] = orgVal;
                    if (matchOne.length > 0)
                        return matchOne;
                    if (matchTwo.length > 0) {
                        return matchTwo
                    }
                }
                //check out horiz matches
                if (row < 7) {
                    var orgVal = Board[row][col];
                    Board[row][col] = Board[row + 1][col];
                    Board[row + 1][col] = orgVal;
                    var matchOne = checkForMatch(row, col);
                    var matchTwo = checkForMatch(row + 1, col);
                    //reset board values
                    Board[row + 1][col] = Board[row][col];
                    Board[row][col] = orgVal;
                    if (matchOne.length > 0)
                        return matchOne;
                    if (matchTwo.length > 0) {
                        return matchTwo
                    }
                }
            }
        }
        return [];
    
    }

    // Highlight a gem that, if moved, would make a match
    function getHint() {
        // Keep track of how many hints are used for score verification
        NumHints++;
        var gemCoords = possibleMatches();
        updateScore(-1); // Update the score with penalty

        // Show the gem that could be moved
        $gem = gemAt(gemCoords[0].row, gemCoords[0].col);
        $gem.addClass("hint");
        var faded = false;
        var count = 0;
        var blinker = setInterval(function () {
            var opacity = faded == true ? 1 : .1;
            faded = !faded;
            $gem.fadeTo(400, opacity);
            count++;
            if (count >11) clearInterval(blinker);
        }, 400);

    };

    //////////////////////////////////////////////////////////////////////
    // DOM Events
    //////////////////////////////////////////////////////////////////////

    function bindings() {

        // Bind clicking on the board
        $("#board").on("click", ".gem", function () {
            if (CanClick == true) {
                $this = $(this);
                ClickedRow = $this.data("row");
                ClickedCol = $this.data("col");

                // Set the first gem
                if (SelectedGems.first == 0) {
                    SelectedGems.first = gemAt(ClickedRow, ClickedCol)
                    SelectedGems.first.addClass("highlight");
                }
                else {
                    if (isValidSwap(SelectedGems.first, ClickedRow, ClickedCol)) {

                        CanClick = false;
                        SelectedGems.second = gemAt(ClickedRow, ClickedCol);
                        // Clear the hint highlight if it exists
                        if ($("#board .gem").hasClass("hint")) $("#board .gem").removeClass("hint");

                        // Swap the gems -- this is where the action happens
                        swapGems(SelectedGems);
                    }
                    else {
                        $(".highlight").removeClass("highlight");
                        newMove();
                    }
                }
            }
        });

        // Bind click on the hint link
        $("#hint").on("click", function () { getHint() });

        // Bind boring toggle
        $("#boring").on("click", function () {
            beBoring();
        });
    };

    function init() {
        drawBoard();
        bindings();
    };

    return {
        init: init,
        endGame: endGame,
        gameTracker: GameTracker,
        numHints: NumHints
    };


})();