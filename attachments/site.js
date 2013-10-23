
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
    var view = new views.ShowBidding(handDoc);
    view.render($('#main-container #content'));
};

bidapp.newBid = function () {
    bidapp.showBidding();
};

bidapp.index = function() {
    document.title = "Bid App";
    $.Mustache.load('./templates/index.html')
        .done(function() {
            $('#main-container').empty().mustache("index-template");
            var browser = new views.BrowseBiddings();
            browser.render($("#browser"));
        });
};


$(function () {
    bidapp.s = $.sammy(
        function () {
            this.get("#new", bidapp.newBid);
            this.get("#show/:docID", bidapp.showDocID);
            this.get('', bidapp.index);
            this.get("#/", bidapp.index);
          });

    bidapp.index();
    bidapp.s.run();
});
