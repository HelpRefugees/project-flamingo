const cfServices = require("cf-services");

const stringifyDate = date => new Date(date).toISOString();

const getDatabaseUrl = () => {
  try {
    return cfServices("flamongo-db").credentials.uri;
  } catch (err) {
    return process.env.DATABASE_URL || "mongodb://localhost:27017/flamingo";
  }
};

module.exports = {
  generateReportPeriod: date =>
    stringifyDate(Date.UTC(date.getFullYear(), date.getMonth())),
  generateDueDate: reportPeriod => {
    const date = new Date(reportPeriod);
    return stringifyDate(Date.UTC(date.getFullYear(), date.getMonth() + 1, 7));
  },
  getDatabaseUrl
};
