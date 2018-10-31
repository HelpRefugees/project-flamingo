import MyReportsPage from "../pages/myReportsPage";
import ReportPage, { ReportSection, KeyActivity } from "../pages/reportPage";

import { randomAlphaText, randomNumericText } from "./helpers";

context("completing a report", () => {
  const myReportsPage = new MyReportsPage();
  const reportPage = new ReportPage(1);

  beforeEach(() => {
    cy.seed("one-incomplete-report.json");
    cy.login("ellen@ip.org");

    myReportsPage.getFirstReport("incomplete").click();

    reportPage.isAt();
  });

  it("opens and saves an editable report", () => {
    const newReport = {
      overview: randomAlphaText(16),
      operatingEnvironment: randomAlphaText(16),
      keyActivity: {
        activityName: randomAlphaText(16),
        numberOfParticipants: randomNumericText(16),
        demographicInfo: randomAlphaText(16),
        impactOutcome: randomAlphaText(16)
      },
      beneficiaryFeedback: randomAlphaText(16),
      challengesFaced: randomAlphaText(16),
      incidents: randomAlphaText(16),
      otherIssues: randomAlphaText(16),
      materialsForFundraising: randomAlphaText(16)
    };
    reportPage.grantName.should("contain.text", "Grant Mitchell");

    const completeAndSaveSection = ({ key, title, selector, value }) => {
      reportPage.getSection(key, reportSection => {
        reportSection.title.should("contain.text", title);
        reportSection.saveButton.should("attr", "disabled");
        reportSection.setContentField(selector, value);
        reportSection.saveButton.should("not.have.attr", "disabled");
        reportSection.saveButton.click();
      });
    };

    completeAndSaveSection({
      key: "grant-progress",
      title: "Grant progress",
      selector: ReportSection.sections.grantProgress.progress,
      value: newReport.overview
    });

    completeAndSaveSection({
      key: "operating-environment",
      title: "Operating environment",
      selector: ReportSection.sections.operatingEnvironment.progress,
      value: newReport.operatingEnvironment
    });

    reportPage.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection.title.should("contain.text", "Key Activities");
      keyActivitiesSection.saveButton.should("attr", "disabled");
      keyActivitiesSection.setContentField(
        KeyActivity.inputs.name,
        newReport.keyActivity.activityName
      );
      keyActivitiesSection.setContentField(
        KeyActivity.inputs.numberOfParticipants,
        newReport.keyActivity.numberOfParticipants
      );
      keyActivitiesSection.setContentField(
        KeyActivity.inputs.demographicInfo,
        newReport.keyActivity.demographicInfo
      );
      keyActivitiesSection.setContentField(
        KeyActivity.inputs.impactOutcome,
        newReport.keyActivity.impactOutcome
      );
      keyActivitiesSection.saveButton.should("not.have.attr", "disabled");
      keyActivitiesSection.saveButton.click();
    });

    completeAndSaveSection({
      key: "beneficiary-feedback",
      title: "Beneficiary Feedback",
      selector: ReportSection.sections.beneficiaryFeedback.feedback,
      value: newReport.beneficiaryFeedback
    });

    completeAndSaveSection({
      key: "challenges-faced",
      title: "Challenges faced",
      selector: ReportSection.sections.challengesFaced.challenges,
      value: newReport.challengesFaced
    });

    completeAndSaveSection({
      key: "incidents",
      title: "Incidents and near misses",
      selector: ReportSection.sections.incidents.incidents,
      value: newReport.incidents
    });

    completeAndSaveSection({
      key: "other-issues",
      title:
        "Is there anything you would like to use our platform to speak about?",
      selector: ReportSection.sections.otherIssues.issues,
      value: newReport.otherIssues
    });

    completeAndSaveSection({
      key: "materials-for-fundraising",
      title: "Materials for fundraising",
      selector: ReportSection.sections.materialsForFundraising.materials,
      value: newReport.materialsForFundraising
    });

    myReportsPage.goToHomePage();
    myReportsPage.getFirstReport("incomplete").click();

    reportPage.isAt();
    reportPage.grantName.should("contain.text", "Grant Mitchell");

    const assertReportSectionInputValue = ({ name, selector, value }) => {
      reportPage.getSection(name, section => {
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

    reportPage.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection
        .getContentField(KeyActivity.inputs.name)
        .should("contain.value", newReport.keyActivity.activityName);
      keyActivitiesSection
        .getContentField(KeyActivity.inputs.numberOfParticipants)
        .should("contain.value", newReport.keyActivity.numberOfParticipants);
      keyActivitiesSection
        .getContentField(KeyActivity.inputs.demographicInfo)
        .should("contain.text", newReport.keyActivity.demographicInfo);
      keyActivitiesSection
        .getContentField(KeyActivity.inputs.impactOutcome)
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
  });

  it("allows adding and removing key activities sections", () => {
    reportPage.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection.keyActivities.should("have.length", 1);
      keyActivitiesSection.getKeyActivity(0, keyActivity => {
        keyActivity.removeActivityButton.should("not.exist");
        keyActivity.addActivity();
      });
      keyActivitiesSection.keyActivities.should("have.length", 2);
    });
  });
});
