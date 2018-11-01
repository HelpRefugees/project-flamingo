import BasePage from "./basePage";
import { testId } from "./helpers";

export default class MyReportsPage extends BasePage {
  path = "/my-reports";

  reportSelector = testId("report");

  get reports() {
    return cy.get(this.reportSelector);
  }

  getReports(status) {
    return cy.get(`${testId(`${status}-reports`)} ${this.reportSelector}`);
  }

  getFirstReport(status, callback) {
    if (typeof status !== "string") {
      throw new Error(
        `selector must be of type string, was of type ${typeof status}`
      );
    }
    return cy
      .get(testId(`${status}-reports`))
      .within(() => {
        cy.get(this.reportSelector).within(callback);
      })
      .root();
  }

  getFirstUnsubmittedReport(callback) {
    return this.getFirstReport("unsubmitted", () =>
      callback(new UnsubmittedReport())
    );
  }

  getFirstSubmittedReport(callback) {
    return this.getFirstReport("submitted", () =>
      callback(new SubmittedReport())
    );
  }
}

export class UnsubmittedReport {
  click() {
    cy.get(testId("report-grant-name")).click();
  }

  verifyReportData(data) {
    cy.get(testId("report-grant-name")).should("contains.text", data.grantName);
    cy.get(testId("report-period")).should("contains.text", data.reportPeriod);
    cy.get(testId("report-status")).should("contains.text", data.reportStatus);
  }
}

export class SubmittedReport {
  click() {
    cy.get(testId("report-grant")).click();
  }

  unsubmit() {
    cy.get(testId("report-unsubmit-button")).click();
  }

  verifyReportData(data) {
    cy.get(testId("report-grant")).should("contains.text", data.grantName);
    cy.get(testId("report-period")).should("contains.text", data.reportPeriod);
    cy.get(testId("report-submitted")).should(
      "contains.text",
      data.reportSubmitted
    );
  }
}
