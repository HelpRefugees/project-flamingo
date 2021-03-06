import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ReviewReportPage extends BasePage {
  submitReportSelector = testId("report-submit-button");
  editReportSelector = testId("report-edit-button");

  constructor(reportId) {
    super();
    this.reportId = reportId;
  }

  get path() {
    return `/my-reports/${this.reportId}/review`;
  }

  get submitButton() {
    return cy.get(this.submitReportSelector);
  }

  get editButton() {
    return cy.get(this.editReportSelector);
  }

  getSection(name, callback) {
    return cy
      .get(testId(name))
      .within((...args) => callback(new ReportSection(), ...args))
      .root();
  }

  verifyReportData(data) {
    cy.get(testId("report-grant-name")).should("contains.text", data.grantName);
    cy.get(testId("report-period")).should("contains.text", data.reportPeriod);
  }
}

export class ReportSection {
  get title() {
    return cy.get(testId("report-section-title"));
  }

  contentFor(name) {
    return cy.get(testId(name));
  }

  getContentField({ selector, type }) {
    return cy.get(testId(selector) + " " + type).last();
  }

  setContentField(field, newContent) {
    this.getContentField(field)
      .clear()
      .type(newContent);
  }
}
