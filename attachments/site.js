
var bidapp = {};
bidapp.index = function() {
    document.title = "Bid App";
    $.Mustache.load('./templates/index.html')
        .done(function() {
            $('#main-container').mustache("index-template");
            var input = new bidding.InputWidget($('.bidding-input'));
        });
}


$(function () {
      bidapp.s = $.sammy(
          function () {
              // Index of all databases
              this.get('', bidapp.index);
              this.get("#/", bidapp.index);
          });
    bidapp.s.run();
});
