"use strict";

module.exports.id = "multiple-demographic-info";

module.exports.up = function(done) {
  this.db
    .collection("reports")
    .find()
    .toArray()
    .then(reports => {
      return Promise.all(
        reports.map(report => {
          report.keyActivities = report.keyActivities.map(keyActivity => {
            keyActivity.demographicInfo = [keyActivity.demographicInfo];
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
            keyActivity.demographicInfo = keyActivity.demographicInfo[0];
            return keyActivity;
          });
          return this.db.collection("reports").save(report);
        })
      ).then(() => done());
    });
};
