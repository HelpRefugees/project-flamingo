import MyReportsPage from "../pages/myReportsPage";
import ReviewReportPage from "../pages/reviewReportPage";
import ReportPage from "../pages/reportPage";
import ForbiddenPage from "../pages/forbiddenPage";
import MyReportPage from "../pages/myReportPage";
import { randomAlphaText, randomNumericText, today } from "../util";

context("My Reports Page", () => {
  const myReportsPage = new MyReportsPage();

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

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 7, 15).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows her name 'Ellen Smith'", () => {
      myReportsPage.userName.should("contains.text", "Ellen Smith");
    });

    it("shows an unsubmitted report", () => {
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "07/09/2018",
          reportPeriod: "August 2018"
        });
      });
    });

    it("can review a submitted report", () => {
      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      const reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.reviewAndSubmitButton.click();

      const reviewReportPage = new ReviewReportPage(1);
      reviewReportPage.isAt();
      reviewReportPage.verifyReportData({
        grantName: "Grant Mitchell",
        reportPeriod: "August 2018"
      });
    });

    it("submits a report", () => {
      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      const reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.fillOut(newReport);
      reportPage.reviewAndSubmitButton.should("not.have.attr", "disabled");
      reportPage.reviewAndSubmitButton.click();
      reportPage.submitButton.should("not.have.attr", "disabled");
      reportPage.submitButton.click();

      myReportsPage.isAt();
      myReportsPage.getReports("submitted").should("have.length", 1);
      myReportsPage.getFirstSubmittedReport(report => {
        report.verifyReportData({
          grantName: "Grant Mitchell",
          reportSubmitted: today(),
          reportPeriod: "August 2018"
        });
        report.click();
      });

      const myReportPage = new MyReportPage(1);
      myReportPage.isAt();
      myReportPage.verifyReportData({
        grantName: "Grant Mitchell",
        submissionDate: today()
      });
      myReportPage.isDisplaying(newReport);
      myReportPage.backButton.should("exist");
      myReportPage.backButton.click();
      myReportsPage.getFirstSubmittedReport(report => report.unsubmit());
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
    });
  });

  context("Ellen's report is due", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 8, 2).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows when the report is due ", () => {
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
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
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
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
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
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

      forbiddenPage.isAt();
    });

    it("is not able to see the Submit Report page", () => {
      cy.wait(250);
      new ReportPage(1).visit();

      forbiddenPage.isAt();
    });
  });
});
