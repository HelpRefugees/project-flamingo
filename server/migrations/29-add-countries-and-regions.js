"use strict";

module.exports.id = "add-countries-and-regions";

module.exports.up = function(done) {
  this.db
    .collection("settings")
    .insertOne({
      id: 2,
      name: "countriesAndRegions",
      values: [
        {
          country: "Cairo",
          regions: ["Smart", "MCCP", "Horizon"]
        },
        {
          country: "Hurghada",
          regions: ["Paradise", "Cherry"]
        }
      ]
    })
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("settings")
    .drop()
    .then(() => done());
};
