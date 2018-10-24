const reportsGenerator = require("./reports-generator");

const safeDrop = async collection => {
  try {
    await global.DATABASE.collection(collection).drop();
  } catch (err) {
    // ignore missing collection
  }
};

describe("Report generation script", () => {
  const username = "ellen@ip.org";
  beforeEach(async () => {
    await safeDrop("reports");
    await safeDrop("users");
  });

  describe("with a single user", () => {
    beforeEach(async () => {
      await global.DATABASE.collection("users").insertOne({
        username,
        role: "implementing-partner",
        grant: "Grant Mitchell"
      });
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
          owner: username,
          id: 1,
          keyActivity: {}
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

    it("should return the number of reports created", async () => {
      const count = await reportsGenerator(global.DATABASE_URL);
      expect(count).toBe(1);
    });
  });

  describe("with multiple users", () => {
    beforeEach(async () => {
      await global.DATABASE.collection("users").insertMany([
        {
          username,
          role: "implementing-partner",
          grant: "Grant Mitchell"
        },
        {
          username: "helen@ip.org",
          role: "implementing-partner",
          grant: "Hugh Grant"
        },
        {
          username: "daisy@hr.org",
          role: "help-refugees"
        }
      ]);
      await global.DATABASE.collection("reports").insertOne({
        id: 12
      });
    });

    it("should create a new report per implementing partner", async () => {
      const reportPeriod = thisMonth();

      await reportsGenerator(global.DATABASE_URL);

      const reports = await global.DATABASE.collection("reports")
        .find()
        .toArray()
        .then(reports =>
          reports
            .filter(report => report.reportPeriod === reportPeriod)
            .map(({ _id, ...report }) => report)
        );
      expect(reports).toEqual([
        {
          overview: "",
          grant: "Grant Mitchell",
          completed: false,
          reportPeriod,
          owner: username,
          id: 13,
          keyActivity: {}
        },
        {
          overview: "",
          grant: "Hugh Grant",
          completed: false,
          reportPeriod,
          owner: "helen@ip.org",
          id: 14,
          keyActivity: {}
        }
      ]);
    });
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
