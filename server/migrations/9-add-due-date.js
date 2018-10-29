"use strict";
const { generateDueDate } = require("../../scripts/utils");

module.exports.id = "add-due-date";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .find()
    .toArray()
    .then(reports => {
      return Promise.all(
        reports.map(report => {
          report.dueDate = generateDueDate(report.reportPeriod);
          return this.db.collection("reports").save(report);
        })
      ).then(() => done());
    });
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .updateMany(
      {},
      {
        $unset: { dueDate: 1 }
      }
    )
    .then(() => done());
};
