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

    /*
     * Widget showing individual auction
     */

    views.ShowBidding = function(handDoc) {
        this.doc = handDoc || new docs.HandDoc();
    };

    views.ShowBidding.prototype.render = function(target) {
        this.target = target;
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


        // Initialize the comments pane, but only if we don't have it yet
        // and we have the document set
        var newCommentButton = target.find('button[name="comment"]');
        if (!this.comments && this.doc._id) {
            this.comments = new views.CommentsPane(this.doc._id);
            this.comments.render(this.target.find('.comments-pane'));
            newCommentButton.bind('click',
                                  handler.call(this.comments,
                                               this.comments.newComment));
        };

        if (!this.comments) {
            newCommentButton.attr('disabled', 'disabled');
        } else {
            newCommentButton.attr('disabled', null);
        }
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

    /*
     * Widget showing the list of auctions in database with search field
     * and controls.
     */

    views.BrowseBiddings = function() {
    };

    views.BrowseBiddings.prototype.render = function(target) {
        this.target = target;
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


    /*
     * Widget showing the list comments save for auction and allowing
     * changing them.
     */

    views.CommentsPane = function(handID) {
        this.handID = handID;
    };

    views.CommentsPane.prototype.render = function(target) {
        this.target = target;
        this.target
            .empty()
            .mustache('comments-pane-template');
    };

    views.CommentsPane.prototype.newComment = function(ev) {
        if (this.target.find('.add-comment').length === 0) {
            (new views.NewComment(this)).render();
        }
    };

    /*
     * New comment form.
     */

    views.NewComment = function(commentsPane) {
        this.commentsPane = commentsPane;
    };

    views.NewComment.prototype.render = function () {
        this.target = this.commentsPane.target
            .find('.comments-history')
            .mustache('new-comment-template')
            .find('.add-comment');

        this.target.find('button[name="close"]')
            .bind('click', handler.call(this, this.close));
    };

    views.NewComment.prototype.close = function() {
        this.target.remove();
    };


})(window, jQuery);