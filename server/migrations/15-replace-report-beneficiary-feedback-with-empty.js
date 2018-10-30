"use strict";

module.exports.id = "replace-report-beneficiary-feedback-with-empty";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {
        beneficiaryFeedback: {}
      },
      {
        $set: {
          beneficiaryFeedback: ""
        }
      }
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {
        beneficiaryFeedback: ""
      },
      {
        $set: { beneficiaryFeedback: {} }
      }
    )
    .then(() => done());
};
