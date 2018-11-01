import BasePage from "./basePage";
import { testId } from "./helpers";

export default class MyReportPage extends BasePage {
  constructor(reportId) {
    super();
    this.reportId = reportId;
  }

  get path() {
    return `/my-reports/${this.reportId}`;
  }

  get backButton() {
    return cy.get(testId('report-back-button'));
  }

  getSection(name, callback) {
    return cy
      .get(testId(name))
      .within((...args) => callback(new ReportSection(), ...args))
      .root();
  }

  verifyReportData(data) {
    cy.get(testId("report-grant-name")).should("contains.text", data.grantName);
    cy.get(testId("submission-date")).should(
      "contains.text",
      data.submissionDate
    );
  }

  isDisplaying(newReport) {
    const sectionContainsContent = ({
      sectionKey,
      sectionTitle,
      contentKey,
      content
    }) => {
      this.getSection(sectionKey, section => {
        section.title.should("contain.text", sectionTitle);
        section.contentFor(contentKey).should("contain.text", content);
      });
    };

    sectionContainsContent({
      sectionKey: "grant-progress",
      sectionTitle: "Grant overview",
      contentKey: "report-progress",
      content: newReport.overview
    });

    this.getSection(
      "grant-key-activities",
      grantProgressSection => {
        grantProgressSection.title.should(
          "contain.text",
          "Key activities & impact"
        );
        grantProgressSection
          .contentFor("report-key-activity-name")
          .should("contain.text", newReport.keyActivity.activityName);
        grantProgressSection
          .contentFor("report-number-of-participants")
          .should("contain.text", newReport.keyActivity.numberOfParticipants);
        grantProgressSection
          .contentFor("report-demographic-info")
          .should("contain.text", newReport.keyActivity.demographicInfo);
        grantProgressSection
          .contentFor("report-impact-outcome")
          .should("contain.text", newReport.keyActivity.impactOutcome);
      }
    );

    sectionContainsContent({
      sectionKey: "operating-environment",
      sectionTitle: "Operating environment",
      contentKey: "report-operating-environment",
      content: newReport.operatingEnvironment
    });

    sectionContainsContent({
      sectionKey: "beneficiary-feedback",
      sectionTitle: "Beneficiary feedback",
      contentKey: "report-beneficiary-feedback",
      content: newReport.beneficiaryFeedback
    });

    sectionContainsContent({
      sectionKey: "challenges-faced",
      sectionTitle: "Challenges faced and lessons learned",
      contentKey: "report-challenges-faced",
      content: newReport.challengesFaced
    });

    sectionContainsContent({
      sectionKey: "incidents",
      sectionTitle: "Incidents and near misses",
      contentKey: "report-incidents",
      content: newReport.incidents
    });

    sectionContainsContent({
      sectionKey: "other-issues",
      sectionTitle:
        "Is there anything you would like to use our platform to speak about?",
      contentKey: "report-other-issues",
      content: newReport.otherIssues
    });

    sectionContainsContent({
      sectionKey: "materials-for-fundraising",
      sectionTitle: "Materials for fundraising",
      contentKey: "report-materials-for-fundraising",
      content: newReport.materialsForFundraising
    });
  }
}

export class ReportSection {
  get title() {
    return cy.get(testId("report-section-title"));
  }

  contentFor(name) {
    return cy.get(testId(name));
  }
}
