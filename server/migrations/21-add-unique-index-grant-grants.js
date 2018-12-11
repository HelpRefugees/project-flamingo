"use strict";

module.exports.id = "add-unique-index-grant-grants";

module.exports.up = function(done) {
  this.db
    .collection("grants")
    .ensureIndex("grant", { unique: true }, () => done());
};

module.exports.down = function(done) {
  this.db.collection("grants").dropIndex("grant", () => done());
};
