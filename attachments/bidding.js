(function(window, Mustache) {

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

    var bidding = {};

    bidding.InputWidget = function(target, value) {
        this.target = target;
        this.target.keyup('bind', this.handlerFactory(this.keyupHandler));
        this.value = value || new bidding.Auction();
        this.target.val(this.value.toString());
    };

    bidding.InputWidget.prototype.handlerFactory = handlerFactory;

    bidding.InputWidget.prototype.markInvalid = function() {
        this.target.addClass('invalid');
    };

    bidding.InputWidget.prototype.markValid = function() {
        this.target.removeClass('invalid');
    };

    bidding.InputWidget.prototype.keyupHandler = function(ev) {
        try {
            var value = bidding.parse(this.target.val());
            this.markValid();
        } catch (e) {
            this.markInvalid();
            return;
        }
        if (this.value.elements.toString() != value.elements.toString()) {
            this.value = value;
            this.target.val(value.toString());
            this.target.trigger('bidding.changed', value);
        }
    };

    bidding.nonDblPattern = new RegExp('^([1-7][cdhs]|p|x|[1-7]nt)', 'i');
    bidding.dblPattern = new RegExp('^([1-7][cdhs]|p|xx|[1-7]nt)', 'i');

    bidding.parse = function(value) {
        var n = value.length;
        var output = new bidding.Auction();
        var match;
        var doubled = false;
        var pattern;
        while (value.length) {
            value = value.trimLeft();
            if (doubled) {
                pattern = bidding.dblPattern;
            } else {
                pattern = bidding.nonDblPattern;
            }
            match = value.match(pattern);
            if (value != "" && !match) {
                throw new bidding.ParseError(value);
            }
            output.elements.push(match[0]);
            if (match[0] == 'p') {
                //pass changes nothing
            } else if (match[0] == 'x') {
                doubled = true;
            } else {
                doubled = false;
            }

            value = value.substr(match[0].length);
            value = value.trimLeft();
        };
        return output;
    };


    bidding.Auction = function(description) {
        this.elements = [];
    };

    bidding.Auction.fromElements = function(elements) {
        var res = new bidding.Auction();
        res.elements = elements;
        return res;
    };

    bidding.Auction.prototype.toString = function() {
        return this.elements.join(" ");
    };

    bidding.ParseError = function(parsed) {
        this.name = "ParseError";
        this.message = "Cannot parse: " + parsed;
        this.toString = function(){return this.name + ": " + this.message}
    };

    bidding.AuctionWidget = function(target, auction) {
        this.target = target;
        this.draw(auction);
    };

    bidding.AuctionWidget.template = (
        "<table class='auction'><thead>" +
        "<th>N</th><th>E</th><th>S</th><th>W</th></thead>" +
        "<tbody>{{#rows}}<tr>{{#.}}<td>{{.}}</td>{{/.}}</tr>{{/rows}}" +
        "</tbody></table>");

    bidding.AuctionWidget.prototype.draw = function(auction){
        this.target.empty();
        var rows = [];
        var current;

        if (auction) {
            for (x in auction.elements){
                if (x % 4 == 0) {
                    current = [];
                    rows.push(current);
                }
                current.push(helpers.formatBidding(auction.elements[x]));
            }
        }
        var html = Mustache.render(bidding.AuctionWidget.template,
                                   {rows: rows});
        this.target.html(html);
    };

    window.bidding = bidding;

})(window, Mustache);