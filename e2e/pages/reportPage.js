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

  getSection(name, callback) {
    return cy
      .get(testId(name))
      .within((...args) => callback(new ReportSection(), ...args))
      .root();
  }

  get submitButton() {
    return cy.get(this.submitReportSelector);
  }
}

export class ReportSection {
  get title() {
    return cy.get(testId("section-title"));
  }

  get saveButton() {
    return cy.get(testId("section-save-button"));
  }

  getContentField(fieldName) {
    return cy.get(testId(fieldName) + " textarea").last();
  }

  setContent(fieldName, newContent) {
    this.getContentField(fieldName)
      .clear()
      .type(newContent);
  }

  getContentFieldInput(fieldName) {
    return cy.get(testId(fieldName) + " input").last();
  }

  setContentFieldInput(fieldName, newContent) {
    this.getContentFieldInput(fieldName)
      .clear()
      .type(newContent);
  }
}
