import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ReportPage extends BasePage {
  grantNameSelector = testId("grant-name");
  reportDetailsTitleSelector = testId("report-details-title");
  submitReportSelector = testId("report-submit-button");

  constructor(reportId) {
    super();
    this.reportId = reportId;
  }

  get path() {
    return `/reports/${this.reportId}`;
  }

  get grantName() {
    return cy.get(this.grantNameSelector);
  }

  get grantProgress() {
    return new ReportSection("body");
  }

  get submitButton() {
    return cy.get(this.submitReportSelector);
  }
}

export class ReportSection {
  constructor(selector) {
    this.selector = selector;
  }

  get title() {
    return cy.get(this.selector).get(testId("section-title"));
  }

  get saveButton() {
    return cy.get(this.selector).get(testId("section-save-button"));
  }

  get content() {
    return cy
      .get(this.selector)
      .get(`${testId("report-progress-input")} textarea`)
      .last();
  }

  setContent(newContent) {
    this.content.clear().type(newContent);
  }
}
