
var bidapp = {};

bidapp.db = $.couch.db('bidapp');


bidapp.showDocID = function() {
    var docID = this.params['docID'];
    bidapp.db.openDoc(docID, {
        success: function(resp) {
            var doc = new docs.HandDoc(resp);
            bidapp.showBidding(doc);},
        error: function(resp) {
            alert('missing');
        }
    });
};


bidapp.showBidding = function(handDoc) {
    $.Mustache.load('./templates/auction.html')
        .done(function() {
            console.log('done showbidd', handDoc);
            var doc = handDoc || new docs.HandDoc();
            var auction = $('#main-container')
                .empty()
                .mustache("auction-template");
            var input = new bidding.InputWidget(
                auction.find('.bidding-input'),
                doc.auction);

            var widget = new bidding.AuctionWidget(auction.find('#auction'));

            $('.bidding-input')
                .bind('bidding.changed', function(ev) {
                    widget.draw(input.value); })
                .trigger('bidding.changed');

            auction.find('button[name="save"]').bind('click', function() {
                var value = input.value;
                if (!value.elements.length) {
                    input.markInvalid();
                    return;
                }
                input.markValid();
                doc.auction = value;

                bidapp.db.saveDoc(doc, {
                    success: function(data) {
                        doc._id = data.id;
                        doc._rev = data.rev;
                        bidapp.showBidding(doc);
                    }
                });
            });
        });
};


bidapp.newBid = function () {
    bidapp.showBidding();
};

bidapp.index = function() {
    document.title = "Bid App";
    $.Mustache.load('./templates/index.html')
        .done(function() {
            $('#main-container').empty().mustache("index-template");
        });
}


$(function () {
      bidapp.s = $.sammy(
          function () {
              // Index of all databases
              this.get("#new", bidapp.newBid);
              this.get("#show/:docID", bidapp.showDocID);
              this.get('', bidapp.index);
              this.get("#/", bidapp.index);
          });
    bidapp.s.run();
});
