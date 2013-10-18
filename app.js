 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =
  { _id:'_design/bidapp'
  , rewrites :
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {};

ddoc.views['biddings'] = {
    'map': function(doc) {
        if (doc.type == 'hand') {
            var mapping = ['1c', '1d', '1h', '1s', '1nt',
                           '2c', '2d', '2h', '2s', '2nt',
                           '3c', '3d', '3h', '3s', '3nt',
                           '4c', '4d', '4h', '4s', '4nt',
                           '5c', '5d', '5h', '5s', '5nt',
                           '6c', '6d', '6h', '6s', '6nt',
                           '7c', '7d', '7h', '7s', '7nt']
            var value = doc.auction.elements.join(" ");
            var key = [];
            for (i in doc.auction.elements) {
                key.push(mapping.indexOf(
                    doc.auction.elements[i].toLowerCase()));
            }
            emit(key, value);
        }
    }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  }
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;