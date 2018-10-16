"use strict";
const bcrypt = require("bcrypt");

module.exports.id = "daisy-user-setup";

module.exports.up = function(done) {
  let salt = bcrypt.genSaltSync();
  this.db
    .collection("users")
    .insertOne({
      username: "daisy@hr.org",
      name: "Daisy Jones",
      password: bcrypt.hashSync("chooselove", salt),
      role: "help-refugees"
    })
    .then(() =>
      this.db
        .collection("users")
        .updateOne(
          { username: "ellen@ip.org" },
          { $set: { name: "Ellen Smith", role: "implementing-partner" } }
        )
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("users")
    .deleteOne({ username: "daisy@hr.org" })
    .then(() =>
      this.db
        .collection("users")
        .updateOne(
          { username: "ellen@ip.org" },
          { $set: { name: undefined, role: undefined } }
        )
    )
    .then(() => done());
};
