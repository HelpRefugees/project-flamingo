/**
 * Generate a report for the current period, if required.
 */
const { generateDueDate, generateReportPeriod } = require("./utils");
const dbModule = require("../server/db");
const moment = require("moment");

module.exports = async dbUrl => {
  let insertedDocumentCount = 0;
  const reportPeriod = generateReportPeriod(new Date());

  const db = await dbModule.connect(dbUrl);
  const reports = await db
    .collection("reports")
    .find({ reportPeriod })
    .toArray();
  if (reports.length === 0) {
    const grants = await db
      .collection("grants")
      .find({ archived: false })
      .toArray();

    const filteredGrants = grants.filter(grant => {
      const expiryDate = moment(grant.endDate);
      const delta = expiryDate.diff(moment(), "days");
      if (delta > 0) {
        return grant;
      }
    });

    if (filteredGrants !== undefined && filteredGrants.length !== 0) {
      const lastReport = await getLastReport(db);
      const newReports = createReports(
        reportPeriod,
        lastReport,
        filteredGrants
      );
      const { result } = await db.collection("reports").insertMany(newReports);
      insertedDocumentCount = result.n;
    }
  }
  await dbModule.close();
  return insertedDocumentCount;
};

function createReports(reportPeriod, lastReport, grants) {
  const firstId = (lastReport ? lastReport.id : 0) + 1;
  return grants.map((grant, index) =>
    createReport(reportPeriod, firstId + index, grant)
  );
}

function createReport(reportPeriod, id, grant) {
  return {
    completed: false,
    dueDate: generateDueDate(reportPeriod),
    grant: grant.grant,
    region: grant.region,
    country: grant.country,
    owner: grant.owner,
    reportPeriod,
    id,
    overview: "",
    keyActivities: [
      {
        demographicInfo: {
          number: 0,
          type: "",
          note: ""
        }
      }
    ],
    incidents: "",
    challengesFaced: "",
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    otherIssues: "",
    materialsForFundraising: "",
    attachments: []
  };
}

function getLastReport(db) {
  return db.collection("reports").findOne({}, { sort: { id: -1 } });
}
