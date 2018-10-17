/**
 * Generate a report for the current period, if required.
 */
const dbModule = require("../server/db");

module.exports = async dbUrl => {
  const reportPeriod = thisMonth();

  const db = await dbModule.connect(dbUrl);
  const reports = await db
    .collection("reports")
    .find({ reportPeriod })
    .toArray();

  if (reports.length === 0) {
    const lastReport = await getLastReport(db);
    await db
      .collection("reports")
      .insertOne(createReport(reportPeriod, lastReport));
  }
  await dbModule.close();
};

function createReport(reportPeriod, lastReport) {
  return {
    overview: "",
    grant: "Grant Mitchell",
    completed: false,
    reportPeriod,
    id: (lastReport ? lastReport.id : 0) + 1
  };
}

function getLastReport(db) {
  return db.collection("reports").findOne({}, { sort: { id: -1 } });
}

function thisMonth() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth())).toISOString();
}
