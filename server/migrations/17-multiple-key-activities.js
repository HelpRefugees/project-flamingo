"use strict";

module.exports.id = "multiple-key-activities";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .find()
    .toArray()
    .then(reports => {
      return Promise.all(
        reports.map(report => {
          report.keyActivities = [report.keyActivity];
          delete report.keyActivity;
          return this.db.collection("reports").save(report);
        })
      ).then(() => done());
    });
};

module.exports.down = function(done) {
  this.db
    .collection("reports")
    .find()
    .toArray()
    .then(reports => {
      return Promise.all(
        reports.map(report => {
          report.keyActivity = report.keyActivities[0];
          delete report.keyActivities;
          return this.db.collection("reports").save(report);
        })
      ).then(() => done());
    });
};
