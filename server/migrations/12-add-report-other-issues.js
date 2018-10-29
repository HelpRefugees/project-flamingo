"use strict";

module.exports.id = "add-report-other-issues";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          otherIssues: ""
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
        $unset: { otherIssues: 1 }
      }
    )
    .then(() => done());
};
