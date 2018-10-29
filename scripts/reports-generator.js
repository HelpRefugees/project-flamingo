/**
 * Generate a report for the current period, if required.
 */
const { generateDueDate, generateReportPeriod } = require("./utils");
const dbModule = require("../server/db");

module.exports = async dbUrl => {
  let insertedDocumentCount = 0;
  const reportPeriod = generateReportPeriod(new Date());

  const db = await dbModule.connect(dbUrl);
  const reports = await db
    .collection("reports")
    .find({ reportPeriod })
    .toArray();

  if (reports.length === 0) {
    const users = await db
      .collection("users")
      .find({ role: "implementing-partner" })
      .toArray();
    const lastReport = await getLastReport(db);
    const newReports = createReports(reportPeriod, lastReport, users);
    const { result } = await db.collection("reports").insertMany(newReports);
    insertedDocumentCount = result.n;
  }
  await dbModule.close();
  return insertedDocumentCount;
};

function createReports(reportPeriod, lastReport, users) {
  const firstId = (lastReport ? lastReport.id : 0) + 1;
  return users.map((user, index) =>
    createReport(reportPeriod, firstId + index, user)
  );
}

function createReport(reportPeriod, id, user) {
  return {
    overview: "",
    grant: user.grant,
    completed: false,
    reportPeriod,
    dueDate: generateDueDate(reportPeriod),
    owner: user.username,
    id,
    keyActivity: {}
  };
}

function getLastReport(db) {
  return db.collection("reports").findOne({}, { sort: { id: -1 } });
}
