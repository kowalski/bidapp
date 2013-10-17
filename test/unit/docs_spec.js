describe('HandDoc', function() {
    it('should parse doc in database format', function() {
        var doc = new docs.HandDoc({_id: '123', _rev: '1-2030',
                                    auction: {
                                        elements: ['1s', '2h', 'p', 'x']}});
        expect(doc).to.be.an.instanceOf(docs.HandDoc);
        expect(doc.auction).to.be.an.instanceOf(bidding.Auction);
        expect(doc._id).to.equal('123');
        expect(doc._rev).to.equal('1-2030');
    });
});