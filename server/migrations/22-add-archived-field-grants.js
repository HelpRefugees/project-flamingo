"use strict";

module.exports.id = "add-archived-field-grants";

module.exports.up = function(done) {
  this.db
    .collection("grants")
    .updateMany(
      {},
      {
        $set: {
          archived: true
        }
      }
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("grants")
    .updateMany(
      {},
      {
        $unset: { archived: 1 }
      }
    )
    .then(() => done());
};
