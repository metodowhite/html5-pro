// returns request animation frame, and if it isn't available, just use standard
// timeouts
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback, element) {
            return window.setTimeout(
                function() {
                    callback(Date.now());
                }, 1000 / 60
            );
        };
})();

// same thing as above, except for canceling animation update
window.cancelRequestAnimationFrame = (function() {
    return window.cancelRequestAnimationFrame
        || window.webkitCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || window.clearTimeout;
})();