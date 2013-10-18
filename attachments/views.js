(function(window, $) {

    function handlerFactory() {
        var self = this;
        var callback = arguments[0];
        var args = arguments;

        function handler() {
            callback.apply(self,
                           Array.prototype.concat(
                               Array.prototype.slice.call(arguments),
                               Array.prototype.slice.call(args, 1)));
        }

        return handler;
    };

    views = {};
    window.views = views;

    views.ShowBidding = function(handDoc) {
        this.doc = handDoc || new docs.HandDoc();
    };

    views.ShowBidding.prototype.handlerFactory = handlerFactory;

    views.ShowBidding.prototype.saveHandler = function() {
    };

    views.ShowBidding.prototype.render = function(target) {
        $.Mustache.load('./templates/auction.html').done(
            this.handlerFactory(this._render, target));
    };

    views.ShowBidding.prototype._render = function(data, success, xhr, target){
        target.empty().mustache("auction-template");

        this.input = new bidding.InputWidget(
            target.find('.bidding-input'), this.doc.auction);

        this.auction = new bidding.AuctionWidget(target.find('#auction'));

        var self = this;
        target.find('.bidding-input')
            .bind('bidding.changed', function(ev) {
                self.auction.draw(self.input.value); })
            .trigger('bidding.changed');

        target.find('button[name="save"]').bind(
            'click', this.handlerFactory(this.saveHandler));

    };

    views.ShowBidding.prototype.saveHandler = function() {
        var value = this.input.value;
        if (!value.elements.length) {
            this.input.markInvalid();
            return;
        }
        this.input.markValid();
        this.doc.auction = value;

        var self = this;
        bidapp.db.saveDoc(this.doc, {
            success: this.handlerFactory(this._savedCB)});

    };

    views.ShowBidding.prototype._savedCB = function(data) {
        this.doc._id = data.id;
        this.doc._rev = data.rev;
    };


    views.BrowseBiddings = function() {
    };

    views.BrowseBiddings.prototype.render = function(target) {
        this.target = target;
        $.Mustache.load('./templates/auction.html').done(
            handlerFactory.call(this, this._render, target));
    };

    views.BrowseBiddings.prototype._render = function(data, success, xhr){
        this.target.mustache('browse-bidding-template');
        var self = this;
        bidapp.db.view('bidapp/biddings', {
            success: function(resp) {
                for (i in resp.rows) {
                    self.target.mustache('bidding-template', resp.rows[i]);
                }
            }
        });
    };

})(window, jQuery);