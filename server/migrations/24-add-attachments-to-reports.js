"use strict";

module.exports.id = "add-attachments-to-reports";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          attachments: []
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
        $unset: { attachments: 1 }
      }
    )
    .then(() => done());
};
