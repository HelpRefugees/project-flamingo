import BasePage from "./basePage";
import { testId } from "./helpers";

export default class SubmittedReportPage extends BasePage {
  constructor(reportId) {
    super();
    this.reportId = reportId;
  }

  get path() {
    return `/submittedReports/${this.reportId}`;
  }

  verifyReportData(data) {
    cy.get(testId("grant-name")).should("contains.text", data.grantName);
    cy.get(testId("submission-date")).should(
      "contains.text",
      data.submissionDate
    );
  }
  get grantProgress() {
    return new ReportSection("body");
  }
}

export class ReportSection {
  constructor(selector) {
    this.selector = selector;
  }

  get title() {
    return cy.get(this.selector).get(testId("report-details-title"));
  }

  get content() {
    return cy.get(this.selector).get(testId("report-progress"));
  }
}
