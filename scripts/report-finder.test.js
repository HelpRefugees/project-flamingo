const MockDate = require("mockdate");

const ReportFinder = require("./report-finder");
const { stringifyDate } = require("./utils");

describe("report finder", () => {
  const dueReport = {
    dueDate: stringifyDate(new Date(2018, 10, 7)),
    completed: false
  };
  const lateReport = {
    dueDate: stringifyDate(new Date(2018, 10, 1)),
    completed: false
  };
  const completedReport = {
    dueDate: stringifyDate(new Date(2018, 10, 7)),
    completed: true
  };
  const earlyReport = {
    dueDate: stringifyDate(new Date(2018, 10, 13)),
    completed: false
  };

  const reports = [earlyReport, completedReport, dueReport, lateReport];

  let reportFinder;

  beforeEach(async () => {
    try {
      await global.DATABASE.collection("reports").drop();
    } catch (err) {
      /* pass */
    }
    await global.DATABASE.collection("reports").insertMany(reports);
    MockDate.set(new Date(2018, 10, 3, 5, 0, 0));
    reportFinder = new ReportFinder(global.DATABASE_URL);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("lists unsubmitted reports due in the next week", async () => {
    const dueReports = await reportFinder.due();

    expect(dueReports).toEqual([dueReport]);
  });
});
