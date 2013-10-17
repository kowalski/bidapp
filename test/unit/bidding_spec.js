describe('parsing Bidding', function() {
    it('should be defined', function() {
        chai.expect(bidding).to.not.be.undefined;
        chai.expect(bidding.parse).to.not.be.undefined;
    });

    it('should parse "1s 2h"', function() {
        var res = bidding.parse('1s 2h');
        expect(res).to.be.an.instanceOf(bidding.Auction);
        expect(res.elements.length).to.equal(2);
        expect(res.elements).to.have.deep.property('[0]', '1s');
        expect(res.elements).to.have.deep.property('[1]', '2h');
    });

    it('should parse "1s "', function() {
        var res = bidding.parse('1s ');
        expect(res).to.be.an.instanceOf(bidding.Auction);
        expect(res.elements.length).to.equal(1);
        expect(res.elements).to.have.deep.property('[0]', '1s');
    });

    it('should parse "pp 1h2c x"', function() {
        var res = bidding.parse('pp 1h2c x');
        expect(res).to.be.an.instanceOf(bidding.Auction);
        expect(res.elements.length).to.equal(5);
        expect(res.elements).to.have.deep.property('[0]', 'p');
        expect(res.elements).to.have.deep.property('[1]', 'p');
        expect(res.elements).to.have.deep.property('[2]', '1h');
        expect(res.elements).to.have.deep.property('[3]', '2c');
        expect(res.elements).to.have.deep.property('[4]', 'x');
        expect(res.toString()).to.equal('p p 1h 2c x');
    });

    it('should parse "1h x xx 2h"', function() {
        var res = bidding.parse('1h x xx 2h');
        expect(res).to.be.an.instanceOf(bidding.Auction);
        expect(res.elements.length).to.equal(4);
        expect(res.elements).to.have.deep.property('[0]', '1h');
        expect(res.elements).to.have.deep.property('[1]', 'x');
        expect(res.elements).to.have.deep.property('[2]', 'xx');
        expect(res.elements).to.have.deep.property('[3]', '2h');
    });

    var invocation = function() {
        var args = arguments;
        return function() {bidding.parse.apply(this, args)};
    }

    it('should fail sometimes', function() {
        expect(invocation("1")).to.throw(bidding.ParseError);
        expect(invocation("1s k")).to.throw(bidding.ParseError);
        expect(invocation("1p")).to.throw(bidding.ParseError);
        expect(invocation("dupa")).to.throw(bidding.ParseError);
    });

    it('should not allow dubleing twice', function() {
        expect(invocation("1h x x 2h")).to.throw(bidding.ParseError);
    })

});