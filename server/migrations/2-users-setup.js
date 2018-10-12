"use strict";

const bcrypt = require("bcrypt");

module.exports.id = "users-setup";

module.exports.up = function(done) {
  let salt = bcrypt.genSaltSync();
  this.db
    .collection("users")
    .insertOne({
      username: "ellen@ip.org",
      password: bcrypt.hashSync("flamingo", salt)
    })
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("users")
    .drop()
    .then(() => done());
};
