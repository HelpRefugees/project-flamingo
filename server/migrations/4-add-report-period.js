"use strict";

module.exports.id = "add-report-period";

module.exports.up = function(done) {
  const today = new Date();
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          reportPeriod: new Date(
            Date.UTC(today.getFullYear(), today.getMonth())
          ).toISOString()
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
        $unset: { reportPeriod: "" }
      }
    )
    .then(() => done());
};
