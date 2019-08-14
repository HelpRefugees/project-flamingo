"use strict";

module.exports.id = "add-countries-and-regions-to-reports";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          region: "",
          country: ""
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
        $unset: { region: 1, country: 1 }
      }
    )
    .then(() => done());
};
