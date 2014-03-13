

//////////////////////////////////////////////////////////////////////
// Interacting with the API
//////////////////////////////////////////////////////////////////////

var apiStuff = (function () {
    function init() {
        bindSubmit();
    };

    // Bind clicking on the submit button
    function bindSubmit() {

        //Bind enter key on input form
        $("#username").keypress(function (e) {
            if (e.which == 13) {
                $("#score-submit").click();
            }
        });

        $("#score-submit").on("click", function (e) {
            e.preventDefault();
            var score = parseInt($("#score").html().trim());

            // The username field is required, and some sanity checking on score
            if ($("#username").valid() && score > -1 && score < 100000) {
                var name = $("#username").val().trim();
                
                var userscore = {
                    Name: name,
                    Score: score,
                    GameStates: game.gameTracker,
                    NumHints: game.numHints
                };
                if(game.endGame())
                    sendScore(userscore);

                $(this).attr("disabled", "disabled");

                
            }
        });
    };

    function getCurrentHighScore() {
        return $("#highScore").data("id");
    }
    function sendScore(userscore) {
        $.ajax({
            type: "POST",
            url: "/api/scoreapi/",
            data: JSON.stringify(userscore),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true,
            success: function (data) {
                //Place logic for updateHighScore here or as deferred
                // Disapprove of invalid score
                console.log(data);
                if (data == "Invalid score") {
                    $("#game-over .game-over-text").remove();
                    $("#game-over").append("<div class='nope'></div>");
                }
            }
        });
    };


    return {
        init: init
    };
}());