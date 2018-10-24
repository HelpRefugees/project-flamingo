"use strict";

module.exports.id = "re-add-report-key-activity";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      { keyActivity: { $exists: false } },
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
