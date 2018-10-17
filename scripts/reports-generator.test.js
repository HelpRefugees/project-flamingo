const reportsGenerator = require("./reports-generator");

describe("Report generation script", () => {
  beforeEach(async () => {
    try {
      await global.DATABASE.collection("reports").drop();
    } catch (err) {
      // ignore missing collection
    }
  });

  it("should do nothing if the report exists", async () => {
    const reportPeriod = thisMonth();
    const report = {
      reportPeriod,
      overview: "this month is going fine"
    };
    await global.DATABASE.collection("reports").insertOne(report);

    await reportsGenerator(global.DATABASE_URL);

    const reports = await global.DATABASE.collection("reports")
      .find()
      .toArray();
    expect(reports).toEqual([report]);
  });

  it("should create a new report if the report does not exist", async () => {
    const reportPeriod = thisMonth();

    await reportsGenerator(global.DATABASE_URL);

    const reports = await global.DATABASE.collection("reports")
      .find()
      .toArray()
      .then(reports => reports.map(({ _id, ...report }) => report));
    expect(reports).toEqual([
      {
        overview: "",
        grant: "Grant Mitchell",
        completed: false,
        reportPeriod,
        id: 1
      }
    ]);
  });

  it("should have the right ID", async () => {
    await global.DATABASE.collection("reports").insertOne({
      id: 1,
      reportPeriod: lastMonth(),
      overview: "things were fine last month"
    });

    await reportsGenerator(global.DATABASE_URL);

    const reports = await global.DATABASE.collection("reports")
      .find()
      .toArray();
    expect(reports).toHaveLength(2);
    expect(reports.filter(report => report.id === 1)).toHaveLength(1);
    expect(reports.filter(report => report.id === 2)).toHaveLength(1);
  });

  function lastMonth() {
    const now = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(now.getMonth() - 1);
    return new Date(
      Date.UTC(previousMonth.getFullYear(), previousMonth.getMonth())
    ).toISOString();
  }

  function thisMonth() {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth())).toISOString();
  }
});
