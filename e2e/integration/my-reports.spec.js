import MyReportsPage from "../pages/myReportsPage";
import ReviewReportPage from "../pages/reviewReportPage";
import ReportPage, { ReportSection } from "../pages/reportPage";
import ForbiddenPage from "../pages/forbiddenPage";
import { today } from "./helpers";

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

    it("submits a report", () => {
      myReportsPage.getFirstReport("incomplete").click();

      const reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.submitButton.click();

      const reviewReportPage = new ReviewReportPage(1);
      reviewReportPage.isAt();

      reviewReportPage.verifyReportData({
        grantName: "Grant Mitchell",
        reportPeriod: "August 2018"
      });

      reviewReportPage.getSection("grant-progress", grantProgressSection => {
        grantProgressSection.title.should("contain.text", "Grant overview");
        grantProgressSection
          .contentFor("report-progress")
          .should("contain.text", "Mitchell Overview");
      });

      reviewReportPage.editButton.click();
      reportPage.isAt();
      reportPage.submitButton.click();
      reviewReportPage.submitButton.click();
      myReportsPage.isAt();

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
});
