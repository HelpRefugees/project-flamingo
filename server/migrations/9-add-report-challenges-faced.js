"use strict";

module.exports.id = "add-report-challenges-faced";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          challengesFaced: ""
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
        $unset: { challengesFaced: 1 }
      }
    )
    .then(() => done());
};
