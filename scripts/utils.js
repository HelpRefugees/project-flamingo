module.exports = {
  generateReportPeriod: date =>
    new Date(Date.UTC(date.getFullYear(), date.getMonth())).toISOString()
};
