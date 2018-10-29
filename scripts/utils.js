const stringifyDate = date => new Date(date).toISOString();

module.exports = {
  generateReportPeriod: date =>
    stringifyDate(Date.UTC(date.getFullYear(), date.getMonth())),
  generateDueDate: reportPeriod => {
    const date = new Date(reportPeriod);
    return stringifyDate(Date.UTC(date.getFullYear(), date.getMonth() + 1, 7));
  }
};
