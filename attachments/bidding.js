(function() {

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

    bidding.InputWidget = function(target) {
        this.target = target;
        this.target.keyup('bind', this.handlerFactory(this.keyupHandler));
        this.value = new bidding.Auction();
    };


    bidding.InputWidget.prototype.handlerFactory = handlerFactory;


    bidding.InputWidget.prototype.keyupHandler = function(ev) {
        try {
            var value = bidding.parse(this.target.val());
            this.target.removeClass('invalid');
        } catch (e) {
            this.target.addClass('invalid');
            return;
        }
        if (this.value.elements != value.element) {
            this.value = value;
            this.target.val(value.toString());
            this.target.trigger('bidding.changed', value);
        }
    };

    bidding.bidPattern = new RegExp('^([1-7][cdhs]|p|x|xx|[1-7]nt)', 'i');

    bidding.parse = function(value) {
        var n = value.length;
        var output = new bidding.Auction();
        var match;
        while (value.length) {
            value = value.trimLeft();
            match = value.match(bidding.bidPattern);
            if (value != "" && !match) {
                throw new bidding.ParseError(value);
            }
            output.elements.push(match[0]);
            value = value.substr(match[0].length);
        };
        return output;
    };


    bidding.Auction = function(description) {
        this.elements = [];
    };

    bidding.Auction.prototype.toString = function() {
        return this.elements.join(" ");
    };

    bidding.ParseError = function(parsed) {
        this.name = "ParseError";
        this.message = "Cannot parse: " + parsed;
        this.toString = function(){return this.name + ": " + this.message}
    };

    window.bidding = bidding;

})(window);