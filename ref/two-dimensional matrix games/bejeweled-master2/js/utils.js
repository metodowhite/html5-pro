Object.prototype.empty = function() {
    for(var prop in this) {
        if(this.hasOwnProperty(prop))
            return false;
    }

    return true;
};

function sortByNum(a,b) {
    return a - b;
}