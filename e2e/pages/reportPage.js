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

  completeAndSaveSection({ key, title, selector, value }) {
    this.getSection(key, reportSection => {
      reportSection.title.should("contain.text", title);
      reportSection.saveButton.should("attr", "disabled");
      reportSection.setContentField(selector, value);
      reportSection.saveButton.should("not.have.attr", "disabled");
      reportSection.saveButton.click();
    });
  }

  fillOut(newReport) {
    this.completeAndSaveSection({
      key: "grant-progress",
      title: "Grant progress",
      selector: ReportSection.sections.grantProgress.progress,
      value: newReport.overview
    });

    this.completeAndSaveSection({
      key: "operating-environment",
      title: "Operating environment",
      selector: ReportSection.sections.operatingEnvironment.progress,
      value: newReport.operatingEnvironment
    });

    this.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection.title.should("contain.text", "Key Activities");
      keyActivitiesSection.saveButton.should("attr", "disabled");
      keyActivitiesSection.setContentField(
        ReportSection.sections.keyActivities.name,
        newReport.keyActivity.activityName
      );
      keyActivitiesSection.setContentField(
        ReportSection.sections.keyActivities.numberOfParticipants,
        newReport.keyActivity.numberOfParticipants
      );
      keyActivitiesSection.setContentField(
        ReportSection.sections.keyActivities.demographicInfo,
        newReport.keyActivity.demographicInfo
      );
      keyActivitiesSection.setContentField(
        ReportSection.sections.keyActivities.impactOutcome,
        newReport.keyActivity.impactOutcome
      );
      keyActivitiesSection.saveButton.should("not.have.attr", "disabled");
      keyActivitiesSection.saveButton.click();
      keyActivitiesSection.saveButton.should("have.attr", "disabled");
    });

    this.completeAndSaveSection({
      key: "beneficiary-feedback",
      title: "Beneficiary Feedback",
      selector: ReportSection.sections.beneficiaryFeedback.feedback,
      value: newReport.beneficiaryFeedback
    });

    this.completeAndSaveSection({
      key: "challenges-faced",
      title: "Challenges faced",
      selector: ReportSection.sections.challengesFaced.challenges,
      value: newReport.challengesFaced
    });

    this.completeAndSaveSection({
      key: "incidents",
      title: "Incidents and near misses",
      selector: ReportSection.sections.incidents.incidents,
      value: newReport.incidents
    });

    this.completeAndSaveSection({
      key: "other-issues",
      title:
        "Is there anything you would like to use our platform to speak about?",
      selector: ReportSection.sections.otherIssues.issues,
      value: newReport.otherIssues
    });

    this.completeAndSaveSection({
      key: "materials-for-fundraising",
      title: "Materials for fundraising",
      selector: ReportSection.sections.materialsForFundraising.materials,
      value: newReport.materialsForFundraising
    });
  }

  isDisplaying(newReport) {
    const assertReportSectionInputValue = ({ name, selector, value }) => {
      this.getSection(name, section => {
        section.getContentField(selector).should("contain.text", value);
      });
    };

    assertReportSectionInputValue({
      name: "grant-progress",
      selector: ReportSection.sections.grantProgress.progress,
      value: newReport.overview
    });

    assertReportSectionInputValue({
      name: "operating-environment",
      selector: ReportSection.sections.operatingEnvironment.progress,
      value: newReport.operatingEnvironment
    });

    this.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection
        .getContentField(ReportSection.sections.keyActivities.name)
        .should("contain.value", newReport.keyActivity.activityName);
      keyActivitiesSection
        .getContentField(
          ReportSection.sections.keyActivities.numberOfParticipants
        )
        .should("contain.value", newReport.keyActivity.numberOfParticipants);
      keyActivitiesSection
        .getContentField(ReportSection.sections.keyActivities.demographicInfo)
        .should("contain.text", newReport.keyActivity.demographicInfo);
      keyActivitiesSection
        .getContentField(ReportSection.sections.keyActivities.impactOutcome)
        .should("contain.text", newReport.keyActivity.impactOutcome);
      keyActivitiesSection.saveButton.should("have.attr", "disabled");
    });

    assertReportSectionInputValue({
      name: "beneficiary-feedback",
      selector: ReportSection.sections.beneficiaryFeedback.feedback,
      value: newReport.beneficiaryFeedback
    });

    assertReportSectionInputValue({
      name: "challenges-faced",
      selector: ReportSection.sections.challengesFaced.challenges,
      value: newReport.challengesFaced
    });

    assertReportSectionInputValue({
      name: "incidents",
      selector: ReportSection.sections.incidents.incidents,
      value: newReport.incidents
    });

    assertReportSectionInputValue({
      name: "other-issues",
      selector: ReportSection.sections.otherIssues.issues,
      value: newReport.otherIssues
    });

    assertReportSectionInputValue({
      name: "materials-for-fundraising",
      selector: ReportSection.sections.materialsForFundraising.materials,
      value: newReport.materialsForFundraising
    });
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
