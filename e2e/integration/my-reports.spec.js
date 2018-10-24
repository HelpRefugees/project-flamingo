import MyReportsPage from "../pages/myReportsPage";
import ReportPage from "../pages/reportPage";
import ForbiddenPage from "../pages/forbiddenPage";

context("My Reports Page", () => {
  const myReportsPage = new MyReportsPage();

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org", "flamingo");
    });

    it("shows an appropriate title", () => {
      myReportsPage.pageTitle.should("contains.text", "Monthly Report");
    });

    it("shows her name 'Ellen Smith'", () => {
      myReportsPage.userName.should("contains.text", "Ellen Smith");
    });

    it("shows an incomplete report", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage
        .getFirstReport("incomplete")
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          myReportsPage.verifyReportData({
            grantName: "Grant Mitchell",
            reportStatus: "Incomplete",
            reportPeriod: "August 2018"
          });
        });
    });

    it("opens and saves an editable report", () => {
      const newReport = {
        overview: randomAlphaText(16),
        keyActivity: {
          activityName: randomAlphaText(16),
          numberOfParticipants: randomNumericText(16),
          demographicInfo: randomAlphaText(16),
          impactOutcome: randomAlphaText(16)
        }
      };

      myReportsPage.getFirstReport("incomplete").click();

      let reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.grantName.should("contain.text", "Grant Mitchell");

      reportPage.getSection("grant-progress", grantProgessSection => {
        grantProgessSection.title.should("contain.text", "Grant progress");
        grantProgessSection.saveButton.should("attr", "disabled");
        grantProgessSection.setContent(
          "report-progress-input",
          newReport.overview
        );
        grantProgessSection.saveButton.should("not.have.attr", "disabled");
        grantProgessSection.saveButton.click();
      });

      reportPage.getSection("key-activities", keyActivitiesSection => {
        keyActivitiesSection.title.should("contain.text", "Key Activities");
        keyActivitiesSection.saveButton.should("attr", "disabled");
        keyActivitiesSection.setContentFieldInput(
          "report-activity-name-input",
          newReport.keyActivity.activityName
        );
        keyActivitiesSection.setContentFieldInput(
          "report-participants-number-input",
          newReport.keyActivity.numberOfParticipants
        );
        keyActivitiesSection.setContent(
          "report-demographic-info-input",
          newReport.keyActivity.demographicInfo
        );
        keyActivitiesSection.setContent(
          "report-impact-outcome-input",
          newReport.keyActivity.impactOutcome
        );
        keyActivitiesSection.saveButton.should("not.have.attr", "disabled");
        keyActivitiesSection.saveButton.click();
      });

      myReportsPage.goToHomePage();
      myReportsPage.getFirstReport("incomplete").click();

      reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.grantName.should("contain.text", "Grant Mitchell");

      reportPage.getSection("grant-progress", grantProgessSection => {
        grantProgessSection
          .getContentField("report-progress-input")
          .should("contain.text", newReport.overview);
      });

      reportPage.getSection("key-activities", keyActivitiesSection => {
        keyActivitiesSection
          .getContentFieldInput("report-activity-name-input")
          .should("contain.value", newReport.keyActivity.activityName);
        keyActivitiesSection
          .getContentFieldInput("report-participants-number-input")
          .should("contain.value", newReport.keyActivity.numberOfParticipants);
        keyActivitiesSection
          .getContentField("report-demographic-info-input")
          .should("contain.text", newReport.keyActivity.demographicInfo);
        keyActivitiesSection
          .getContentField("report-impact-outcome-input")
          .should("contain.text", newReport.keyActivity.impactOutcome);
        keyActivitiesSection.saveButton.should("have.attr", "disabled");
      });
    });

    it("submits a report", () => {
      const newReport = {
        overview: randomAlphaText(16),
        keyActivity: {
          activityName: randomAlphaText(16),
          numberOfParticipants: randomNumericText(16),
          demographicInfo: randomAlphaText(16),
          impactOutcome: randomAlphaText(16)
        }
      };

      myReportsPage.getFirstReport("incomplete").click();

      const reportPage = new ReportPage(1);
      reportPage.isAt();

      reportPage.getSection("grant-progress", grantProgessSection => {
        grantProgessSection.getContentField("report-progress-input");
        grantProgessSection.setContent(
          "report-progress-input",
          newReport.overview
        );
      });

      reportPage.submitButton.should("not.have.attr", "disabled");

      reportPage.getSection("key-activities", keyActivitiesSection => {
        keyActivitiesSection.setContentFieldInput(
          "report-activity-name-input",
          newReport.keyActivity.activityName
        );
        keyActivitiesSection.setContentFieldInput(
          "report-participants-number-input",
          newReport.keyActivity.numberOfParticipants
        );
        keyActivitiesSection.setContent(
          "report-demographic-info-input",
          newReport.keyActivity.demographicInfo
        );
        keyActivitiesSection.setContent(
          "report-impact-outcome-input",
          newReport.keyActivity.impactOutcome
        );
      });

      reportPage.submitButton.should("not.have.attr", "disabled");
      reportPage.submitButton.click();

      myReportsPage.getReports("completed").should("have.length", 1);
      myReportsPage
        .getFirstReport("completed")
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          myReportsPage.verifyReportData({
            grantName: "Grant Mitchell",
            reportStatus: today(),
            reportPeriod: "August 2018"
          });
        });

      myReportsPage.unsubmitReport();
      myReportsPage.getReports("incomplete").should("have.length", 1);
    });
  });

  context("Helen is logged in", () => {
    beforeEach(() => {
      cy.seed("multiple-incomplete-reports.json");
      cy.login("helen@ip.org");
    });

    it("only sees her own report", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage
        .getFirstReport("incomplete")
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          myReportsPage.verifyReportData({
            grantName: "Hugh Grant",
            reportStatus: "Incomplete",
            reportPeriod: "August 2018"
          });
        });
    });
  });

  context("Daisy is logged in", () => {
    const forbiddenPage = new ForbiddenPage();

    beforeEach(() => {
      cy.seed("one-incomplete-report.json");
      cy.login("daisy@hr.org", "chooselove");
    });

    it("is not able to see the My Reports page", () => {
      myReportsPage.visit();

      forbiddenPage.message.should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });

    it("is not able to see the Submit Report page", () => {
      cy.wait(250);
      new ReportPage(1).visit();

      forbiddenPage.message.should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });
  });

  function today() {
    const now = new Date();
    const day = now
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}/${now.getFullYear()}`;
  }

  function randomText(length, source) {
    let text = "";
    for (var i = 0; i < length; i++) {
      text += source.charAt(Math.floor(Math.random() * source.length));
    }
    return text;
  }

  function randomAlphaText(length) {
    return randomText(
      length,
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    );
  }

  function randomNumericText(length) {
    return randomText(length, "0123456789");
  }
});
