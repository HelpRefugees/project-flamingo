import BasePage from "./basePage";

export default class MyReportsPage extends BasePage {
  path = "/myReports";

  reportsSelector = '[data-test-id="report"]';

  get reports() {
    return cy.get(this.reportsSelector);
  }

  getReports(status) {
    return cy
      .get(`[data-test-id="${status}-reports"]`)
      .get(this.reportsSelector);
  }

  getFirstReport(status) {
    return this.getReports(status).first();
  }

  // TODO move these two methods to a Report object
  unsubmitReport() {
    cy.get("[data-test-id='report-unsubmit-button']").click();
  }

  verifyReportData(data) {
    cy.get('[data-test-id="grant-name"]').should(
      "contains.text",
      data.grantName
    );
    cy.get('[data-test-id="report-period"]').should(
      "contains.text",
      data.reportPeriod
    );
    cy.get('[data-test-id="report-status"]').should(
      "contains.text",
      data.reportStatus
    );
  }
}
