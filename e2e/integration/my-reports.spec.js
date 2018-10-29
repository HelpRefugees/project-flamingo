import MyReportsPage from "../pages/myReportsPage";
import ReportPage, { ReportSection } from "../pages/reportPage";
import ForbiddenPage from "../pages/forbiddenPage";

context("My Reports Page", () => {
  const myReportsPage = new MyReportsPage();

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 7, 15).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows an appropriate title", () => {
      myReportsPage.pageTitle.should("contains.text", "Monthly Report");
    });

    it("shows her name 'Ellen Smith'", () => {
      myReportsPage.userName.should("contains.text", "Ellen Smith");
    });

    it("shows an incomplete report", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage.getFirstReport("incomplete").within(() => {
        myReportsPage.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "07/09/2018",
          reportPeriod: "August 2018"
        });
      });
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
        beneficiaryFeedback: randomAlphaText(16)
      };

      myReportsPage.getFirstReport("incomplete").click();

      let reportPage = new ReportPage(1);
      reportPage.isAt();
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
      });

      completeAndSaveSection({
        key: "beneficiary-feedback",
        title: "Beneficiary Feedback",
        selector: ReportSection.sections.beneficiaryFeedback.feedback,
        value: newReport.beneficiaryFeedback
      });

      myReportsPage.goToHomePage();
      myReportsPage.getFirstReport("incomplete").click();

      reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.grantName.should("contain.text", "Grant Mitchell");

      reportPage.getSection("grant-progress", grantProgessSection => {
        grantProgessSection
          .getContentField(ReportSection.sections.grantProgress.progress)
          .should("contain.text", newReport.overview);
      });

      reportPage.getSection(
        "operating-environment",
        operatingEnvironmentSection => {
          operatingEnvironmentSection
            .getContentField(
              ReportSection.sections.operatingEnvironment.progress
            )
            .should("contain.text", newReport.operatingEnvironment);
        }
      );

      reportPage.getSection(
        "beneficiary-feedback",
        beneficiaryFeedbackSection => {
          beneficiaryFeedbackSection
            .getContentField(
              ReportSection.sections.beneficiaryFeedback.feedback
            )
            .should("contain.text", newReport.beneficiaryFeedback);
        }
      );

      reportPage.getSection("key-activities", keyActivitiesSection => {
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
        grantProgessSection.setContentField(
          ReportSection.sections.grantProgress.progress,
          newReport.overview
        );
      });

      reportPage.submitButton.should("not.have.attr", "disabled");

      reportPage.getSection("key-activities", keyActivitiesSection => {
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
      });

      reportPage.submitButton.should("not.have.attr", "disabled");
      reportPage.submitButton.click();

      myReportsPage.getReports("completed").should("have.length", 1);
      myReportsPage.getFirstReport("completed").within(() => {
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

  context("Ellen's report is due", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 8, 2).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows when the report is due ", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage.getFirstReport("incomplete").within(() => {
        myReportsPage.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "Due in 5 days",
          reportPeriod: "August 2018"
        });
      });
    });
  });

  context("Ellen's report is late", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 8, 15).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows how late the report is ", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage.getFirstReport("incomplete").within(() => {
        myReportsPage.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "8 days late",
          reportPeriod: "August 2018"
        });
      });
    });
  });

  context("Helen is logged in", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 7, 15).getTime());
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
            reportStatus: "07/09/2018",
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
