const reportsGenerator = require("./reports-generator");
const { generateDueDate, generateReportPeriod } = require("./utils");

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
    await safeDrop("grants");
  });

  describe("with a single user", () => {
    beforeEach(async () => {
      await global.DATABASE.collection("users").insertOne({
        username,
        role: "implementing-partner",
        grant: "Grant Mitchell"
      });

      await global.DATABASE.collection("grants").insertOne({
        owner: username,
        grant: "Grant Mitchell",
        archived: false
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
          dueDate: generateDueDate(reportPeriod),
          owner: username,
          id: 1,
          keyActivities: [{}]
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

      await global.DATABASE.collection("grants").insertMany([
        {
          grant: "Grant Mitchell",
          owner: username,
          archived: false
        },
        {
          grant: "Hugh Grant",
          owner: "helen@ip.org",
          archived: false
        }
      ]);
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
          dueDate: generateDueDate(reportPeriod),
          owner: username,
          id: 13,
          keyActivities: [{}]
        },
        {
          overview: "",
          grant: "Hugh Grant",
          completed: false,
          reportPeriod,
          dueDate: generateDueDate(reportPeriod),
          owner: "helen@ip.org",
          id: 14,
          keyActivities: [{}]
        }
      ]);
    });
  });

  function lastMonth() {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 10);
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 10);
    previousMonth.setMonth(currentMonth.getMonth() - 1);
    return generateReportPeriod(previousMonth);
  }

  function thisMonth() {
    return generateReportPeriod(new Date());
  }
});
