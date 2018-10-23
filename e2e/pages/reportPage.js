import BasePage from "./basePage";

export default class ReportPage extends BasePage {
  grantNameSelector = this.testId("grant-name");
  reportDetailsTitleSelector = this.testId("report-details-title");
  submitReportSelector = this.testId("report-submit-button");

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
    return cy.get(this.selector).get('[data-test-id="section-title"]');
  }

  get saveButton() {
    return cy.get(this.selector).get("[data-test-id='section-save-button']");
  }

  get content() {
    return cy
      .get(this.selector)
      .get('[data-test-id="report-progress-input"] textarea')
      .last();
  }

  setContent(newContent) {
    this.content.clear().type(newContent);
  }
}
