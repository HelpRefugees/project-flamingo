"use strict";

module.exports.id = "initial-setup";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .insertOne({
      id: 1,
      completed: false,
      overview: "",
      grant: "Grant Mitchell"
    })
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .drop()
    .then(() => done());
};
