"use strict";

module.exports.id = "add-materials-for-fundraising";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          materialsForFundraising: ""
        }
      }
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $unset: { materialsForFundraising: 1 }
      }
    )
    .then(() => done());
};
