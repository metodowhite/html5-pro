var OuterGemSize = 84;
var GemSize = 80;
var BorderSize = 2;
var NumGems = 5;
var board = [];
var CanClick = true;
var animationSpeed = 350;

var Coords = function (row, col) {
    this.row = row;
    this.col = col;
};

var SelectedGems = { // Keeps track of gems the user has clicked on
    first: 0,
    second: 0,
};

// A gem object.  What you click on
var Gem = function (row, col, val, top) {
    this.row = row;
    this.col = col;
    this.val = val;
    this.top = (top === undefined ? row * OuterGemSize : top);

    // Create a DOM representation of the gem
    this.createEl = function () {
        return $("<div/>",
        {
            "id": "gem-" + this.row + "-" + this.col,
            "class": "gem face-" + this.val,
            "css": { "top": this.top, "left": this.col * (GemSize + 2 * BorderSize), "color": "#fff", "textAlign": "center", "fontWeight": "bold" },
            "data-id": this.val,
            "data-row": this.row,
            "data-col": this.col
        });
    }

    // Get the DOM representation of this gem
    this.getGem = function () {
        return $("#gem-" + this.row + "-" + this.col);
    }
};

// Takes a gemId of the form gem-x-y and returns an array of [gem,x,y]
//  where x & y represent the board row and column
function getGemById(gemId) {
    var vals = gemId.split("-");
    return vals;
}

// Get a random value for the gem
function newGemVal() {
    return Math.floor(Math.random() * NumGems);
}

// Generate the board array.  This is the underlying data of the board
function makeBoardArray(random) {
    // Normally we want a random board, but sometimes for testing I'll make a board in a weird way
    if (random == true | typeof (random) === "undefined") {
        for (row = 0; row < 8; row++) {
            board[row] = [];
            for (col = 0; col < 8; col++) {
                var val = newGemVal();
                board[row][col] = new Gem(row, col, val);
            }
        }

        //// Make sure the initial board doesn't have any matches
        //for (row = 0; row < 8; row++) {
        //    for (col = 0; col < 8; col++) {
        //        var match = checkBoardForMatches(row, col);
        //        if (match.hasMatches())
        //            makeBoardArray(random);
        //    }
        //}
    }

}

// Insert DOM elements corresponding to the board array
function drawBoard() {
    makeBoardArray(true);
    for (row = 0; row < 8; row++) {
        for (col = 0; col < 8; col++) {
            board[row][col].createEl().addClass("toCheck").appendTo("#board");
        }
    }

    //// If there aren't any valid moves redraw the board
    //// todo -- check the board array instead of selecting DOM elements for this.  
    //if (!boardHasMatches()) drawBoard();
    ////checkMarkedGems()
    //setInterval(function () {
    //    if ($board.find(":animated").length < 1)
    //        checkMarkedGems()
    //}, 500);
};

function swapGems() {
    // Local vars to make code easier to read
    var firstGem = SelectedGems.i;
    var secondGem = {};


    // Swap values in the board array
    board[SelectedGems.first.row][SelectedGems.first.col] = SelectedGems.second.val;
    board[SelectedGems.second.row][SelectedGems.second.col] = SelectedGems.first.val;

    // First swap
    var horizDirection = 0;
    var vertDirection = 0;

    // Check if swap is horizontal
    if (SelectedGems.first.col != SelectedGems.second.col) {
        //Get Direction; -1 =  moving first to right, 1 = moving first to left
        horizDirection = (SelectedGems.first.col > SelectedGems.second.col) ? 1 : -1;
    }
    // Check if swap is vertical
    else {
        //Get Direction; -1 =  moving first up, 1 = moving first down
        vertDirection = (SelectedGems.first.row > SelectedGems.second.row) ? 1 : -1;
    }

    //// Animate the gem swap
    SelectedGems.first.getGem().animate({ left: "-=" + OuterGemSize * horizDirection, top: "-=" + OuterGemSize * vertDirection }, animationSpeed);
    var secondAnim = SelectedGems.second.getGem().animate(
        {
            left: "+=" + OuterGemSize * horizDirection,
            top: "+=" + OuterGemSize * vertDirection
        },
        {
            duration: animationSpeed,
            //complete: function () {
            //    // Check if swapped values cause a match
            //    var gemOneMatch = checkBoardForMatches(secondGem.initialRow, secondGem.initialCol);
            //    var gemTwoMatch = checkBoardForMatches(firstGem.initialRow, firstGem.initialCol);
            //    // Put the gems back if there aren't any matches
            //    if (!gemOneMatch.hasMatches() && !gemTwoMatch.hasMatches()) {
            //        resetSwap(firstGem, secondGem, horizDirection, vertDirection);
            //    }
            //        // Complete the swap if there are matches
            //    else {
            //        completeSwap(firstGem, secondGem, horizDirection, vertDirection, gemOneMatch, gemTwoMatch);
            //    }
            //}
        }
    );

    // Wait until the second gem is done moving, then proceed...
    secondAnim.promise().done(function () {

        //See if either gem, once swapped, causes a match
            var gemOneMatch = checkForMatch(secondGem.initialRow, secondGem.initialCol);
            var gemTwoMatch = checkForMatch(firstGem.initialRow, firstGem.initialCol);
    })

    ////todo -- where should I put this?
    //if (!boardHasMatches()) endGame();
    //CanClick = true;
}

function bindBoardClick() {
    $("#board").on("click", ".gem", function () {
        if (CanClick == true) {
            $this = $(this);
            var clickedRow  = $this.data("row");
            var clickedCol = $this.data("col");

            // Set the first gem
            if (SelectedGems.first == 0) {
                SelectedGems.first = board[clickedRow][clickedCol]
                //highlightGem(SelectedGems.first);
            }
            else {
                //if (isValidSwap(SelectedGems.first, ClickedRow, ClickedCol)) {
                    CanClick = false;
                    SelectedGems.second = board[clickedRow][clickedCol];
                    swapGems(SelectedGems);
                //}
            }
        }
    });
}

function init() {
    drawBoard();
    bindBoardClick();
}

init();