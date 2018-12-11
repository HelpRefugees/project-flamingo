"use strict";

module.exports.id = "separate-grants-users";

module.exports.up = function(done) {
  // use this.db for MongoDB communication, and this.log() for logging
  this.db
    .collection("users")
    .find({ role: "implementing-partner" })
    .toArray()
    .then(users => {
      return Promise.all(
        users.map(user => {
          let grant = {
            id: user.id,
            owner: user.username,
            grant: user.grant,
            organization: user.name,
            sector: user.sector,
            description: user.description,
            region: user.region,
            otherInfo: user.otherInfo
          };
          return this.db.collection("grants").insertOne(grant);
        })
      ).then(() => done());
    });
};

module.exports.down = function(done) {
  // use this.db for MongoDB communication, and this.log() for logging
  this.db
    .collection("grants")
    .drop()
    .then(() => done());
};
