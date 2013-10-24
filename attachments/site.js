
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
    $('#main-container').empty().mustache("index-template");
    var browser = new views.BrowseBiddings();
    browser.render($("#browser"));
};

bidapp.onDbChange = function(data) {
    var doc = data.results[0].doc;
    $('.db-change-listener').trigger('db.changed', doc);
};


bidapp.removeBidding = function(docId) {
    bidapp.db.openDoc(docId,
                      {success: function(doc) {bidapp.db.removeDoc(doc);}});

    var params = {
        startkey: [docId],
        endkey: [docId, {}]
    }
    bidapp.db.view('bidapp/comments', {
        include_docs: true,
        startkey: [docId],
        endkey: [docId, {}],
        success: function(resp) {
            for (var i in resp.rows) {
                bidapp.db.removeDoc(resp.rows[i].doc);
            }
        }
    });
};


$(function () {
    var changes = bidapp.db.changes(null, {include_docs: true});
    changes.onChange(bidapp.onDbChange);

    bidapp.s = $.sammy(
        function () {
            this.get("#new", bidapp.newBid);
            this.get("#show/:docID", bidapp.showDocID);
            this.get('', bidapp.index);
            this.get("#/", bidapp.index);
          });

    $.Mustache.load('./templates.html')
        .done(function() {
            bidapp.index();
            bidapp.s.run(); });
});
