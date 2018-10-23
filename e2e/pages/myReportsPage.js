import BasePage from "./basePage";
import { testId } from "./helpers";

export default class MyReportsPage extends BasePage {
  path = "/myReports";

  reportsSelector = testId("report");

  get reports() {
    return cy.get(this.reportsSelector);
  }

  getReports(status) {
    return cy.get(testId(`${status}-reports`)).get(this.reportsSelector);
  }

  getFirstReport(status) {
    return this.getReports(status).first();
  }

  // TODO move these two methods to a Report object
  unsubmitReport() {
    cy.get(testId("report-unsubmit-button")).click();
  }

  verifyReportData(data) {
    cy.get(testId("grant-name")).should("contains.text", data.grantName);
    cy.get(testId("report-period")).should("contains.text", data.reportPeriod);
    cy.get(testId("report-status")).should("contains.text", data.reportStatus);
  }
}
