(function(window, $) {

    function handler() {
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

    views.ShowBidding.prototype.render = function(target) {
        this.target = target;
        $.Mustache.load('./templates/auction.html').done(
            handler.call(this, this._render, target));
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
            'click', handler.call(this, this.saveHandler));
        target.find('#auction').addClass('db-change-listener')
            .bind('db.changed', handler.call(this, this.dbChangedHandler));
    };

    views.ShowBidding.prototype.dbChangedHandler = function(ev, doc) {
        if (doc && doc._id == this.doc._id) {
            this.doc = new docs.HandDoc(doc);
            this.render(this.target);
        };
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
        bidapp.db.saveDoc(this.doc);
    };

    views.BrowseBiddings = function() {
    };

    views.BrowseBiddings.prototype.render = function(target) {
        this.target = target;
        $.Mustache.load('./templates/auction.html').done(
            handler.call(this, this._render, target));
    };

    views.BrowseBiddings.prototype._render = function(data, success, xhr){
        this.target.mustache('browse-bidding-template');

        this.input = this.target.find('.bidding-input');
        this.search = new bidding.InputWidget(this.input);
        this.select = this.target.find('select');
        this.showButton = this.target.find('button.show-bidding');
        this.newButton = this.target.find('button.new-bidding');

        var self = this;
        this.input
            .bind('bidding.changed', handler.call(this, this.redrawList))
            .trigger('bidding.changed');

        this.select.bind('change', handler.call(this, this.selectionChanged));
        this.selectionChanged();
        this.select.addClass('db-change-listener')
            .bind('db.changed', handler.call(this, this.dbChangedHandler));

        this.showButton.bind('click', handler.call(this, this.showClicked));
        this.newButton.bind('click',
                            function() {window.location.hash = 'new';});
    };

    views.BrowseBiddings.prototype.dbChangedHandler = function(ev, doc) {
        if (doc && doc.type == "hand") {
            this.redrawList();
        }
    };

    views.BrowseBiddings.prototype.showClicked = function() {
        var val = this.select.val();
        if (val) {
            window.location.hash = 'show/' + val;
        }
    };

    views.BrowseBiddings.prototype.getSelectedBidding = function() {
        var val = this.select.val();
        if (val && val.length === 1) {
            return val[0];
        }
    };

    views.BrowseBiddings.prototype.selectionChanged = function() {
        var val = this.getSelectedBidding();
        if (!val) {
            this.showButton.attr('disabled', 'disabled');
        } else {
            this.showButton.attr('disabled', null);
        }
    };

    views.BrowseBiddings.prototype.redrawList = function() {
        var self = this;
        var auction = this.search.value;
        var value = this.getSelectedBidding();

        var params = {
            limit: 50,
            success: function(resp) {
                var target = self.target.find('.biddings');
                target.empty();
                for (i in resp.rows) {
                    target.mustache('bidding-template', resp.rows[i]);
                }
                if (value) {
                    target.val([value]);
                }
            }
        };

        if (auction) {
            params['startkey'] = auction.toDbKey();
            params['endkey'] = Array.prototype.concat(auction.toDbKey(), [{}]);
        }

        bidapp.db.view('bidapp/biddings', params);
    };

})(window, jQuery);