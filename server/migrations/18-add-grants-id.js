"use strict";

module.exports.id = "add-grants-id";

module.exports.up = function(done) {
  this.db
    .collection("users")
    .find()
    .toArray()
    .then(users => {
      return Promise.all(
        users.map((user, key) => {
          user.id = key;
          return this.db.collection("users").save(user);
        })
      ).then(() => done());
    });
};

module.exports.down = function(done) {
  this.db
    .collection("users")
    .find()
    .toArray()
    .then(users => {
      return Promise.all(
        users.map(user => {
          delete user.id;
          return this.db.collection("users").save(user);
        })
      ).then(() => done());
    });
};
