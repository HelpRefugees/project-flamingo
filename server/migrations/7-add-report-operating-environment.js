"use strict";

module.exports.id = "add-report-operating-environment";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          operatingEnvironment: {}
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
        $unset: { operatingEnvironment: 1 }
      }
    )
    .then(() => done());
};
