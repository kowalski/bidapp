var HandDoc = function(opts) {
    opts = opts || {};
    for (key in opts) {
        this[key] = opts[key];
    }
    this.type = 'hand';
    if (this.auction) {
        // typecast
        this.auction = bidding.Auction.fromElements(this.auction.elements);
    }
};

var docs = {}

window.docs = docs;

docs.HandDoc = HandDoc;

