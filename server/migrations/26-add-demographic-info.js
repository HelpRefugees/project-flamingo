"use strict";

module.exports.id = "add-demographic-info";

module.exports.up = function(done) {
  this.db
    .collection("settings")
    .insertOne({
      id: 1,
      name: "demographicInfo",
      values: ["Men", "women", "Girls", "Boys"]
    })
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("settings")
    .drop()
    .then(() => done());
};
