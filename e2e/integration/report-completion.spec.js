import MyReportsPage from "../pages/myReportsPage";
import ReportPage, { KeyActivity } from "../pages/reportPage";

import { randomAlphaText, randomNumericText } from "../util";

context("completing a report", () => {
  const myReportsPage = new MyReportsPage();
  const reportPage = new ReportPage(1);

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

  beforeEach(() => {
    cy.seed("one-incomplete-report.json");
    cy.login("ellen@ip.org");

    myReportsPage.getFirstUnsubmittedReport(report => report.click());

    reportPage.isAt();
  });

  it("opens and saves an editable report", () => {
    reportPage.grantName.should("contain.text", "Grant Mitchell");

    reportPage.fillOut(newReport);

    myReportsPage.goToHomePage();
    myReportsPage.getFirstUnsubmittedReport(report => report.click());

    reportPage.isAt();
    reportPage.grantName.should("contain.text", "Grant Mitchell");

    reportPage.isDisplaying(newReport);
  });

  it("allows adding and removing key activities sections", () => {
    const newActivity = {
      activityName: "Some Activity",
      numberOfParticipants: "12",
      demographicInfo: "Mostly children",
      impactOutcome: "It went really well"
    };

    reportPage.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection.keyActivities.should("have.length", 1);
      keyActivitiesSection.getKeyActivity(0, keyActivity => {
        keyActivity.removeActivityButton.should("not.exist");
        keyActivity.addActivity();
      });

      keyActivitiesSection.keyActivities.should("have.length", 2);

      keyActivitiesSection.getKeyActivity(1, keyActivity => {
        keyActivity.setContentField(
          KeyActivity.inputs.name,
          newActivity.activityName
        );
        keyActivity.setContentField(
          KeyActivity.inputs.numberOfParticipants,
          newActivity.numberOfParticipants
        );
        keyActivity.setContentField(
          KeyActivity.inputs.demographicInfo,
          newActivity.demographicInfo
        );
        keyActivity.setContentField(
          KeyActivity.inputs.impactOutcome,
          newActivity.impactOutcome
        );
        keyActivity.saveButton.click();
      });
    });

    reportPage.goToHomePage();
    myReportsPage.getFirstUnsubmittedReport(report => report.click());
    reportPage.isAt();

    reportPage.getSection("key-activities", keyActivitiesSection => {
      keyActivitiesSection.keyActivities.should("have.length", 2);

      keyActivitiesSection.getKeyActivity(1, keyActivity => {
        keyActivity
          .getContentField(KeyActivity.inputs.name)
          .should("contain.value", newActivity.activityName);
        keyActivity
          .getContentField(KeyActivity.inputs.numberOfParticipants)
          .should("contain.value", newActivity.numberOfParticipants);
        keyActivity
          .getContentField(KeyActivity.inputs.demographicInfo)
          .should("contain.value", newActivity.demographicInfo);
        keyActivity
          .getContentField(KeyActivity.inputs.impactOutcome)
          .should("contain.text", newActivity.impactOutcome);
        keyActivity.saveButton.should("have.attr", "disabled");
      });

      keyActivitiesSection.getKeyActivity(0, keyActivity => {
        keyActivity.removeActivity();
      });

      keyActivitiesSection.keyActivities.should("have.length", 1);
    });
  });
});
