"use strict";

module.exports.id = "add-start-end-fields-grants";

module.exports.up = function(done) {
  this.db
    .collection("grants")
    .updateMany(
      {},
      {
        $set: {
          startDate: "2018-11-01T00:00:00.000Z",
          endDate: "2019-10-31T00:00:00.000Z"
        }
      }
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("grants")
    .updateMany(
      {},
      {
        $unset: {
          startDate: 1,
          endDate: 1
        }
      }
    )
    .then(() => done());
};
