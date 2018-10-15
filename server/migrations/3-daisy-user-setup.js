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
      password: bcrypt.hashSync("chooselove", salt)
    })
    .then(() =>
      this.db
        .collection("users")
        .updateOne(
          { username: "ellen@ip.org" },
          { $set: { name: "Ellen Smith" } }
        )
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("users")
    .deleteOne({ username: "daisy@hr.org" })
    .then(() => done());
};
