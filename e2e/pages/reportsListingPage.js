import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ReportsListingPage extends BasePage {
  path = "/reports";

  goToReportTab(tabName) {
    cy.get(testId(tabName)).click();
  }

  getReportsTable(reportsType) {
    return cy.get(testId(reportsType)).get(testId("report"));
  }

  getFirstReport(reportsType) {
    return this.getReportsTable(reportsType).first();
  }

  verifyReportData(data) {
    cy.get(testId("report-grant")).should("contains.text", data.grantName);
  }

  filterBy(name) {
    cy.get(testId("grant-name-filter")).within(() => {
      cy.get("input").type(`${name}{enter}`, { force: true });
    });
  }

  clearFilter() {
    cy.get(testId("grant-name-filter")).within(() => {
      cy.get("svg")
        .first()
        .click();
    });
  }

  get noReportsTitle() {
    return cy.get(testId("no-reports-title"));
  }
}
