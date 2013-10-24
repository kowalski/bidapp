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


helpers.timestamp = function() {
    return function(epoch, render) {
        var v = new Date(parseInt(render(epoch) * 1000));
        return ('<span class="timeago" title="' + v.toISOString() + '">' +
                v.toLocaleFormat() +
                '</span>');
    };
};

window.helpers = helpers;