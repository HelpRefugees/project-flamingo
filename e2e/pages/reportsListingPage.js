import BasePage from "./basePage";

export default class ReportsListingPage extends BasePage {
  path = "/reportsListing";
  reportsSelector = this.testId("report");
  noReportsSelector = this.testId("no-reports-title");

  getReports() {
    return cy.get(this.testId("submitted-reports")).get(this.reportsSelector);
  }

  getFirstReport() {
    return this.getReports().first();
  }

  verifyReportData(data) {
    cy.get(this.testId("report-grant")).should("contains.text", data.grantName);
  }

  get noReportsTitle() {
    return cy.get(this.noReportsSelector);
  }
}
