"use strict";

module.exports.id = "add-report-beneficiary-feedback";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          beneficiaryFeedback: {}
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
        $unset: { beneficiaryFeedback: 1 }
      }
    )
    .then(() => done());
};
