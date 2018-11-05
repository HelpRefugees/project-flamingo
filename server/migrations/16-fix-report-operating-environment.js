"use strict";

module.exports.id = "fix-report-operating-environment";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      { operatingEnvironment: {} },
      {
        $set: {
          operatingEnvironment: ""
        }
      }
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      { operatingEnvironment: "" },
      {
        $set: { operatingEnvironment: {} }
      }
    )
    .then(() => done());
};
