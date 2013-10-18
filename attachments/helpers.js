var helpers = {};

var suitsReplace = {
    's': '<div class="space"></div>',
    'h': '<div class="heart"></div>',
    'c': '<div class="club"></div>',
    'd': '<div class="diamond"></div>'
};

helpers.formatBidding = function(input) {
    var output = new String(input);
    return output;
    // FIXME: do this later.
    // for (suit in suitsReplace) {
    //     output = output.replace(suit, suitsReplace[suit], 'g');
    // }
    // return output;
};


window.helpers = helpers;