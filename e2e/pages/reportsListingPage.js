import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ReportsListingPage extends BasePage {
  path = "/reportsListing";

  getReports() {
    return cy.get(testId("submitted-reports")).get(testId("report"));
  }

  getFirstReport() {
    return this.getReports().first();
  }

  verifyReportData(data) {
    cy.get(testId("report-grant")).should("contains.text", data.grantName);
  }

  get noReportsTitle() {
    return cy.get(testId("no-reports-title"));
  }
}
