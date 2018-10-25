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
  static sections = {
    grantProgress: {
      progress: {
        selector: "report-progress-input",
        type: "textarea"
      }
    },
    keyActivities: {
      name: {
        selector: "report-activity-name-input",
        type: "input"
      },
      numberOfParticipants: {
        selector: "report-participants-number-input",
        type: "input"
      },
      demographicInfo: {
        selector: "report-demographic-info-input",
        type: "textarea"
      },
      impactOutcome: {
        selector: "report-impact-outcome-input",
        type: "textarea"
      }
    }
  };

  get title() {
    return cy.get(testId("section-title"));
  }

  get saveButton() {
    return cy.get(testId("section-save-button"));
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
