"use strict";

module.exports.id = "add-unique-index-username-users";

module.exports.up = function(done) {
  this.db
    .collection("users")
    .ensureIndex("username", { unique: true }, () => done());
};

module.exports.down = function(done) {
  this.db.collection("users").dropIndex("username", () => done());
  done();
};
