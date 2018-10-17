/**
 * Generate a report for the current period, if required.
 */
const dbModule = require("../server/db");

module.exports = async dbUrl => {
  let insertedDocumentCount = 0;
  const reportPeriod = thisMonth();

  const db = await dbModule.connect(dbUrl);
  const reports = await db
    .collection("reports")
    .find({ reportPeriod })
    .toArray();

  if (reports.length === 0) {
    const lastReport = await getLastReport(db);
    const { result } = await db
      .collection("reports")
      .insertMany([createReport(reportPeriod, lastReport)]);
    insertedDocumentCount = result.n;
  }
  await dbModule.close();
  return insertedDocumentCount;
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
