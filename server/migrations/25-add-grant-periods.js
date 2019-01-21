"use strict";

module.exports.id = "add-grant-periods";

module.exports.up = function(done) {
  this.db
    .collection("grants")
    .find()
    .toArray()
    .then(grants => {
      return Promise.all(
        grants.map(grant => {
          grant.periods = [
            { startDate: grant.startDate, endDate: grant.endDate }
          ];
          return this.db.collection("grants").save(grant);
        })
      ).then(() => done());
    });
};

module.exports.down = function(done) {
  this.db
    .collection("grants")
    .find()
    .toArray()
    .then(grants => {
      return Promise.all(
        grants.map(grant => {
          delete grant.periods;
          return this.db.collection("grants").save(grant);
        })
      ).then(() => done());
    });
};
