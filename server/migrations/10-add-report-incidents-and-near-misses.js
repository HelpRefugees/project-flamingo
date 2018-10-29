"use strict";

module.exports.id = "add-report-incidents-and-near-misses";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          incidents: ""
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
        $unset: { incidents: 1 }
      }
    )
    .then(() => done());
};
