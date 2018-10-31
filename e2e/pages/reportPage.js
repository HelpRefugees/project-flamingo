import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ReportPage extends BasePage {
  grantNameSelector = testId("report-grant-name");
  submitReportSelector = testId("report-submit-button");
  reviewAndSubmitButtonSelector = testId("report-review-and-submit-button");

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

  get reviewAndSubmitButton() {
    return cy.get(this.reviewAndSubmitButtonSelector);
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
    operatingEnvironment: {
      progress: {
        selector: "operating-environment-input",
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
    },
    beneficiaryFeedback: {
      feedback: {
        selector: "beneficiary-feedback-input",
        type: "textarea"
      }
    },
    challengesFaced: {
      challenges: {
        selector: "challenges-faced-input",
        type: "textarea"
      }
    },
    incidents: {
      incidents: {
        selector: "incidents-input",
        type: "textarea"
      }
    },
    otherIssues: {
      issues: {
        selector: "other-issues-input",
        type: "textarea"
      }
    },
    materialsForFundraising: {
      materials: {
        selector: "materials-for-fundraising-input",
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
