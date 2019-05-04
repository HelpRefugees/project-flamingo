"use strict";

module.exports.id = "add-report-demo-info";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .find()
    .toArray()
    .then(reports => {
      return Promise.all(
        reports.map(report => {
          report.keyActivities = report.keyActivities.map(keyActivity => {
            keyActivity.demographicInfo = {
              number: 0,
              type: "",
              note: keyActivity.demographicInfo || ""
            };
            return keyActivity;
          });
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
          report.keyActivities = report.keyActivities.map(keyActivity => {
            keyActivity.demographicInfo = keyActivity.demographicInfo.note;
            return keyActivity;
          });
          return this.db.collection("reports").save(report);
        })
      ).then(() => done());
    });
};
