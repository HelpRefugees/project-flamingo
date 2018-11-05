const dbModule = require("../server/db");
const { stringifyDate } = require("./utils");

class ReportFinder {
  constructor(dbUrl) {
    this.dbUrl = dbUrl;
  }

  async due() {
    const db = await dbModule.connect(this.dbUrl);
    const currentDate = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(currentDate.getDate() + 7);

    const dueReports = await db
      .collection("reports")
      .find({
        completed: false,
        dueDate: {
          $gte: stringifyDate(currentDate),
          $lte: stringifyDate(nextWeek)
        }
      })
      .toArray();

    await dbModule.close();
    return dueReports;
  }
}

module.exports = ReportFinder;
