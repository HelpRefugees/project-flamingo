"use strict";

module.exports.id = "add-report-key-activity";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          keyActivity: {}
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
        $unset: { keyActivity: 1 }
      }
    )
    .then(() => done());
};
