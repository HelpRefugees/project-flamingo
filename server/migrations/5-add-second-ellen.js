"use strict";
const bcrypt = require("bcrypt");
const { generateReportPeriod } = require("../../scripts/utils");

module.exports.id = "add-second-ellen";

const newUser = {
  username: "helen@ip.org",
  name: "Helen Brown",
  password: "eatshrimp",
  role: "implementing-partner",
  grant: "Hugh Grant"
};

const ellen = "ellen@ip.org";

module.exports.up = function(done) {
  const salt = bcrypt.genSaltSync();

  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $set: {
          owner: ellen
        }
      }
    )
    .then(() =>
      this.db.collection("users").updateOne(
        {
          username: ellen
        },
        {
          $set: {
            grant: "Grant Mitchell"
          }
        }
      )
    )
    .then(() =>
      this.db.collection("users").insertOne({
        ...newUser,
        password: bcrypt.hashSync(newUser.password, salt)
      })
    )
    .then(() => this.db.collection("reports").findOne({}, { sort: { id: -1 } }))
    .then(lastReport =>
      this.db.collection("reports").insertOne({
        overview: "",
        grant: newUser.grant,
        completed: false,
        reportPeriod: generateReportPeriod(new Date()),
        id: lastReport.id + 1,
        owner: newUser.username
      })
    )
    .then(() => done());
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .deleteMany({ owner: newUser.username })
    .then(() =>
      this.db.collection("users").deleteOne({ username: newUser.username })
    )
    .then(() =>
      this.db.collection("users").updateOne(
        { username: ellen },
        {
          $set: {
            grant: undefined
          }
        }
      )
    )
    .then(() =>
      this.db.collection("reports").updateMany(
        {},
        {
          $set: {
            owner: undefined
          }
        }
      )
    )
    .then(() => done());
};
