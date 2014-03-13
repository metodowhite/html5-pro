
var game = (function () {
    // Starting with a manual board for ease of debugging
    var board = [];
    board[0] = [0, 1, 1, 0, 3, 5, 6, 7];
    board[1] = [1, 3, 4, 1, 3, 0, 7, 6];
    board[2] = [2, 7, 2, 7, 3, 2, 0, 1];
    board[3] = [3, 4, 0, 3, 1, 5, 1, 2];
    board[4] = [3, 3, 3, 5, 3, 6, 2, 3];
    board[5] = [5, 6, 0, 0, 1, 1, 3, 4];
    board[6] = [2, 2, 2, 1, 1, 1, 1, 1];
    board[7] = [7, 0, 7, 2, 4, 0, 0, 0];

    //
    // Globals for game

    // Setup
    var NumGems = 8;
    var GemSize = 80;
    var BorderSize = 2;
    var OuterGemSize = GemSize + (2 * BorderSize);
    var score = 0;
    var animationSpeed = 200;
    var CanClick = true; // Whether or not a user can select a gem -- false when animating
    var ClickedRow, ClickedCol; // Coordinates of the clicked gems
    var SelectedGems = { // Keeps track of gems the user has clicked on
        first: 0,
        second: 0,
    };

    var MatchCoords = function () {
        this.horiz = [];
        this.vert = [];
    };

    MatchCoords.prototype.hasMatches = function () {
        if (this.horiz.length == 0 && this.vert.length == 0)
            return false;
        else return true;
    };

    var $board = $("#board");

    //
    // Remove gems that match horizonatally
    function removeGemsHoriz(coordsArray) {
        var deferred = new $.Deferred();

        var checkNext = function (i) {
            if (i++ == coordsArray.length) {
                deferred.resolve();
                return deferred.promise();
            }
        }

        if (coordsArray.length == 0) {
            deferred.resolve();
            return deferred.promise();
        }

        for (i = 0; i < coordsArray.length; i++) {
            score += calculateScore(coordsArray.length);
            var row = coordsArray[i][0]; // for readability
            var col = coordsArray[i][1];

            // Remove the matched Gem
            gemAt(row, col).remove();

            // Shift gems down one row
            while (row > 0) {
                var $gem = gemAt(row - 1, col);
                $gem = updateGemProperties($gem, row, col).addClass("toCheck");
                board[row][col] = $gem.data("id"); //Synce the board array 

                // Animate the shifted gem, 
                $gem.animate({ top: "+=" + OuterGemSize },
                                {
                                    duration: animationSpeed,
                                    //complete: function () {
                                    //    checkNext(i);
                                    //}
                                }
                            );
                row--;
            }

            // Create a new Gem to replaced the removed gem
            var val = newGemVal();
            var newGem = createGem(0, col, val, -(OuterGemSize)).addClass("toCheck").appendTo("#board");


            board[0][col] = val; // Update board array
            // Animate the new Gem
            // When this gem is complete check the see if it's in the last one.  
            var p = newGem.animate({ top: "+=" + OuterGemSize },
             {
                 duration: animationSpeed,
                 complete: function () { checkNext(i); }
             });

            $("#score").html(score);
        }
        return deferred.promise();
    }

    //
    // Remove gems that match vertically
    var removeGemsVert = function (coordsArray) {

        var deferred = new $.Deferred();
        var numToAnimate = 0;

        var checkResolve = function (i) {
            // Resolve when each gem column is finished animating
            if (i == numToAnimate) {
                deferred.resolve();
                return deferred.promise();
            }
        }

        // If there is nothing to remove just return
        if (coordsArray.length == 0) {
            deferred.resolve();
            return deferred.promise();
        }

        score += calculateScore(coordsArray.length);

        // Sort the coordinates so the animation looks better 
        coordsArray = coordsArray.sort(Comparator);
        var topRow = coordsArray[0][0];
        var col = coordsArray[0][1];

        var gemStack = [];

        // Create a new gem for each gem that is to be removed and push it onto the gemStack
        for (i = 0; i < coordsArray.length; i++) {
            var row = coordsArray[i][0];
            var col = coordsArray[i][1];
            var gemVal = newGemVal();

            // An overly complicated way to put the gems in a row so the whole stack slides down at once
            var top = -1 * ((coordsArray.length * OuterGemSize) - (i * OuterGemSize + OuterGemSize)) - OuterGemSize;
            var distanceToFall = Math.abs(top) + OuterGemSize;

            //Create the gem & append to the board
            //$gem = getGem(i, col, gemVal, top).addClass("toCheck").appendTo("#board");
            $gem = createGem(i, col, gemVal, top).addClass("toCheck").appendTo("#board");

            gemStack.push($gem); // Don't animate yet, just push the value on the stack

            // Set the board array value to match the value of the newly created gem
            board[i][col] = gemVal;
            gemAt(row, col).remove();
        }

        //Move down remaining gems
        //  Start at the row above the uppermode removed gem
        //  Update that gem to have a new row value that is equal to the number of gems removed
        //    ex: if gems (7,0), (6,0), (5,0) were removed then the gem at (4,0) get a new row of (4+3,0) = (7,0)
        var tempRow = coordsArray[0][0];
        while (--tempRow >= 0) {
            var replacementRow = tempRow + coordsArray.length;
            var $gem = gemAt(tempRow, col);
            board[replacementRow][col] = $gem.data("id"); // update board array to match the gem's new position
            $gem = updateGemProperties($gem, replacementRow, col).addClass("toCheck");

            gemStack.push($gem); // Just add to the stack, wait to animate.
        }
        numToAnimate = gemStack.length;
        //Animate the gemStack
        var count = 0;
        while (gemStack.length > 0) {
            count++;
            var $gem = gemStack.pop();
            var toFall = coordsArray.length * OuterGemSize;
            $gem.animate({ top: "+=" + toFall },
                {
                    duration: animationSpeed,
                    complete: function () {
                        checkResolve(count);
                    }
                });
        }

        $("#score").html(score);
        return deferred.promise();
    }

    // Remove pieces in a row
    var removeMatchedPieces = function (coords) {
        // Indicates whether the function for removing gems has completed yet
        var removedVert, removedHoriz = false;
        var removalH = removeGemsHoriz(coords.horiz); // Remove horizontal matches
        var removalV = removeGemsVert(coords.vert);   // Remove vertical matches
        var deferred = new $.Deferred();

        removalH.then(function () {
            removedHoriz = true
            // if removed Vert finished then this removal is done
            if (removedVert == true)
                deferred.resolve();
        });

        removalV.then(function () {
            removedVert = true;
            // if removed horizontal finished then this removal is done
            if (removedHoriz == true)
                deferred.resolve();
        });

        return deferred.promise();
    }

    /*
    * Utility Functions 
    */

    // Get a jQuery gem object given row and column
    function gemAt(row, col) {
        return $("#gem-" + row + "-" + col);
    }

    // Get a random value for the gem
    function newGemVal() {
        return Math.floor(Math.random() * NumGems);
    }

    // In case the highlight behavior gets more advanced
    function highlightGem($gem) {
        $gem.addClass("highlight");
    }

    // Create a new gem 
    function createGem(row, col, value, top, left) {
        top = top === undefined ? row * OuterGemSize : top;
        return $("<div/>",
        {
            "id": "gem-" + row + "-" + col,
            "class": "gem face-" + value,
            "css": { "top": top, "left": col * (GemSize + 2 * BorderSize), "color": "#fff", "textAlign": "center", "fontWeight": "bold" },
            "data-id": value,
            "data-row": row,
            "data-col": col
        });
    }

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

    // Calculate the score for a match
    //  The user is rewarded for making longer matches
    function calculateScore(num) {
        if (num == 3)
            return 30;
        else return (num * 10) + (num - 3) * 5
    }


    // Generate the board array.  This is the underlying data of the board
    function makeBoardArray(random) {
        // Normally we want a random board, but sometimes for testing I'll make a board in a weird way
        if (random == true | typeof (random) === "undefined") {
            for (row = 0; row < 8; row++) {
                for (col = 0; col < 8; col++) {
                    var val = newGemVal();
                    board[row][col] = val;
                }
            }

            // Make sure the initial board doesn't have any matches
            for (row = 0; row < 8; row++) {
                for (col = 0; col < 8; col++) {
                    var match = checkBoardForMatches(row, col);
                    if (match.hasMatches())
                        makeBoardArray(random);
                }
            }
        }

    }

    // Insert DOM elements corresponding to the board array
    function drawBoard() {
        makeBoardArray(false);
        for (row = 0; row < 8; row++) {
            for (col = 0; col < 8; col++) {
                createGem(row, col, board[row][col]).addClass("toCheck").appendTo("#board");
            }
        }

        // If there aren't any valid moves redraw the board
        // todo -- check the board array instead of selecting DOM elements for this.  
        if (!boardHasMatches()) drawBoard();

        // setInterval(function () { checkMarkedGems() }, 300);
    };

    function Comparator(a, b) {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    }

    // Check the board to see if it's possible to make a match by swapping gems
    // todo -- look at board[] instead of DOM.  
    // todo -- rename this 
    function boardHasMatches() {
        var hasMatch = false;
        $(".gem").each(function () {
            var row = $(this).data("row");
            var col = $(this).data("col");
            //check out horiz matches
            if (col < 7) {
                var orgVal = board[row][col];
                board[row][col] = board[row][col + 1];
                board[row][col + 1] = orgVal;
                var matchOne = checkBoardForMatches(row, col);
                var matchTwo = checkBoardForMatches(row, col + 1);

                //reset board values
                board[row][col + 1] = board[row][col];
                board[row][col] = orgVal;
                if (matchOne.hasMatches() || matchTwo.hasMatches()) {
                    hasMatch = true;
                    return (false);
                }
            }

            //check out vert matches
            if (row < 7) {
                var orgVal = board[row][col];
                board[row][col] = board[row + 1][col];
                board[row + 1][col] = orgVal;
                var matchOne = checkBoardForMatches(row, col);
                var matchTwo = checkBoardForMatches(row + 1, col);

                //reset board values
                board[row + 1][col] = board[row][col];
                board[row][col] = orgVal;
                if (matchOne.hasMatches() || matchTwo.hasMatches()) {
                    hasMatch = true;
                    return (false);
                }
            }

        });
        return hasMatch;
    }

    function swapGems() {
        // Local vars to make code easier to read
        var firstGem = {};
        var secondGem = {};
        firstGem.initialRow = parseInt(SelectedGems.first.data("row"));
        firstGem.initialCol = parseInt(SelectedGems.first.data("col"));
        firstGem.initialValue = parseInt(SelectedGems.first.data("id"));
        secondGem.initialRow = parseInt(SelectedGems.second.data("row"));
        secondGem.initialCol = parseInt(SelectedGems.second.data("col"));
        secondGem.initialValue = parseInt(SelectedGems.second.data("id"));

        // Swap values in the board array
        board[firstGem.initialRow][firstGem.initialCol] = secondGem.initialValue;
        board[secondGem.initialRow][secondGem.initialCol] = firstGem.initialValue;

        // First swap
        var horizDirection = 0;
        var vertDirection = 0;

        // Check is swap is horizontal
        if (firstGem.initialCol != secondGem.initialCol) {
            //Get Direction; -1 =  moving first to right, 1 = moving first to left
            horizDirection = (firstGem.initialCol > secondGem.initialCol) ? 1 : -1;
        }
            // Check is swap is vertical
        else {
            //Get Direction; -1 =  moving first up, 1 = moving first down
            vertDirection = (firstGem.initialRow > secondGem.initialRow) ? 1 : -1;
        }

        // Animate the gem swap
        SelectedGems.first.animate({ left: "-=" + OuterGemSize * horizDirection, top: "-=" + OuterGemSize * vertDirection }, animationSpeed);
        SelectedGems.second.animate(
            {
                left: "+=" + OuterGemSize * horizDirection,
                top: "+=" + OuterGemSize * vertDirection
            },
            {
                duration: animationSpeed,
                complete: function () {
                    // Check if swapped values cause a match
                    var gemOneMatch = checkBoardForMatches(secondGem.initialRow, secondGem.initialCol);
                    var gemTwoMatch = checkBoardForMatches(firstGem.initialRow, firstGem.initialCol);
                    // Put the gems back if there aren't any matches
                    if (!gemOneMatch.hasMatches() && !gemTwoMatch.hasMatches()) {
                        resetSwap(firstGem, secondGem, horizDirection, vertDirection);
                    }
                        // Complete the swap if there are matches
                    else {
                        completeSwap(firstGem, secondGem, horizDirection, vertDirection, gemOneMatch, gemTwoMatch);
                    }
                }
            }
        );

        //todo -- where should I put this?
        if (!boardHasMatches()) endGame();
        CanClick = true;
    }

    function completeSwap(firstGem, secondGem, horizDirection, vertDirection, gemOneMatch, gemTwoMatch) {
        //Update the DOM so the gems have correct properties
        SelectedGems.first = updateGemProperties(SelectedGems.first, firstGem.initialRow - vertDirection, firstGem.initialCol - horizDirection);
        SelectedGems.second = updateGemProperties(SelectedGems.second, secondGem.initialRow - (-1 * vertDirection), secondGem.initialCol - (-1 * horizDirection));

        $(".highlight").removeClass("highlight");
        var removalOne = removeMatchedPieces(gemOneMatch);

        SelectedGems = {
            first: 0,
            second: 0,
        };

        removalOne.then(function () {
            if (!boardHasMatches()) endGame();
            var removalTwo = removeMatchedPieces(gemTwoMatch);
            removalTwo.then(function () {
                checkMarkedGems();
                CanClick = true;
            });
        });


    }

    // Puts swapped gems back to their original position if there aren't any matches
    function resetSwap(firstGem, secondGem, horizDirection, vertDirection) {
        // Reset board values
        board[firstGem.initialRow][firstGem.initialCol] = firstGem.initialValue;
        board[secondGem.initialRow][secondGem.initialCol] = secondGem.initialValue;

        // Animate the gems going back to their original position
        SelectedGems.first.animate({ left: "+=" + OuterGemSize * horizDirection, top: "+=" + OuterGemSize * vertDirection }, animationSpeed);
        SelectedGems.second.animate({ left: "-=" + OuterGemSize * horizDirection, top: "-=" + OuterGemSize * vertDirection },
            {
                duration: animationSpeed,
                complete: function () {
                    $(".highlight").removeClass("highlight");

                    // Unset both gems
                    SelectedGems = {
                        first: 0,
                        second: 0,
                    };

                    CanClick = true; // Let the user click again
                }
            });
    }

    // End the game
    // todo -- show if the user has a high score
    function endGame() {
        CanClick = false;
        $("#board").append("<div class='game-over'></div><div class='game-over-text'>Game Over</div>");
    }

    var removeStack = []
    //
    // Check all gems with the class "toCheck" and see if they are in a streak
    function checkMarkedGems() {
        if ($(".toCheck").length > 0) {
            while ($(".toCheck").length > 0) {
                $check = $(".toCheck").first();
                $check.removeClass("toCheck");
                var match = checkBoardForMatches($check.data("row"), $check.data("col"));
                if (match.hasMatches()) {
                    $check.addClass("remove");
                    removeStack.push(match);
                }
            }
            removeMarkedGems();
        }

    }
    function removeMarkedGems() {
        if (removeStack.length > 0) {
            var match = removeStack.pop();
            var removal = removeMatchedPieces(match);
            removal.then(function () {
                removeMarkedGems();
            });
        }
    }

    // Check the board for matches at the specified coordinates
    //
    // Returns: MatchCoords with arrays of coordinates that correspond to matching gems
    function checkBoardForMatches(startingRow, startingCol) {
        var matchCoords = new MatchCoords();

        valueToMatch = board[startingRow][startingCol];
        var matchLength = 1;

        //Check Horizontally
        matchCoords.horiz.push([startingRow, startingCol]);

        //Check to the left
        if (startingCol > 0) {
            var tempCol = startingCol;
            while (--tempCol >= 0 && board[startingRow][tempCol] == valueToMatch) {
                matchCoords.horiz.push([startingRow, tempCol]);
            }
        }
        // Check to the right
        if (startingCol < 7) {
            var tempCol = startingCol;
            while (++tempCol <= 7 && board[startingRow][tempCol] == valueToMatch) {
                matchCoords.horiz.push([startingRow, tempCol]);
            }
        }

        // If there isn't a streak of 3 matching gems, remove matchCoords.horiz
        if (matchCoords.horiz.length < 3)
            matchCoords.horiz = [];

        //Check Vertically
        matchCoords.vert.push([startingRow, startingCol]);

        //Check up
        if (startingRow > 0) {
            var tempRow = startingRow;
            while (--tempRow >= 0 && board[tempRow][startingCol] == valueToMatch) {
                matchCoords.vert.push([tempRow, startingCol]);
                //tempRow--;            
            }
        }
        //check down
        if (startingRow < 7) {
            var tempRow = startingRow;
            while (++tempRow <= 7 && board[tempRow][startingCol] == valueToMatch) {
                matchCoords.vert.push([tempRow, startingCol]);
                //tempRow++;
            }
        }

        // If there isn't a streak of 3 matching gems, remove matchCoords.vert
        if (matchCoords.vert.length < 3)
            matchCoords.vert = [];

        return matchCoords;

    }

    // A valid swap occurs when the first & second gems are adjacent horizontally or vertically
    function isValidSwap($gem, row, col) {
        var firstRow = $gem.data("row");
        var firstCol = $gem.data("col");
        return (Math.abs(firstRow - row) == 1 && firstCol == col)
                || (Math.abs(firstCol - col) == 1 && firstRow == row)
    }

    function bindBoardClick() {
        $("#board").on("click", ".gem", function () {
            if (CanClick == true) {
                $this = $(this);
                ClickedRow = $this.data("row");
                ClickedCol = $this.data("col");

                // Set the first gem
                if (SelectedGems.first == 0) {
                    SelectedGems.first = gemAt(ClickedRow, ClickedCol)
                    highlightGem(SelectedGems.first);
                }
                else {
                    if (isValidSwap(SelectedGems.first, ClickedRow, ClickedCol)) {
                        CanClick = false;
                        SelectedGems.second = gemAt(ClickedRow, ClickedCol);
                        swapGems(SelectedGems);
                    }
                }
            }
        });
    }


    //
    // Public initialization function
    function init() {

        drawBoard();
        //drawBoardValues();
        bindBoardClick();
        $("#score").html(score);
    }

    return {
        init: init,
        CanClick: CanClick,
        endGame: endGame,
        checkMarkedGems: checkMarkedGems
    };
}());


