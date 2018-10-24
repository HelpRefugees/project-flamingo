import ReportsListingPage from "../pages/reportsListingPage";
import SubmittedReportPage from "../pages/submittedReportPage";
import ForbiddenPage from "../pages/forbiddenPage";

context("Reports Listing Page", () => {
  const reportsListingPage = new ReportsListingPage();

  context("Daisy is logged in", () => {
    context("One completed report", () => {
      beforeEach(() => {
        cy.seed("one-completed-report.json");
        cy.login("daisy@hr.org", "chooselove");
      });

      it("shows her name 'Daisy Jones'", () => {
        reportsListingPage.userName.should("contains.text", "Daisy Jones");
      });

      it("shows the title 'Reports'", () => {
        reportsListingPage.pageTitle.should("contains.text", "Reports");
      });

      it("shows a table containing the submitted report", () => {
        reportsListingPage.getReports().should("have.length", 1);
        reportsListingPage
          .getFirstReport()
          // eslint-disable-next-line no-unused-vars
          .within($report => {
            reportsListingPage.verifyReportData({
              grantName: "Grant Mitchell"
            });
          });
      });

      it("shows the report details after clicking on a report", () => {
        reportsListingPage.getFirstReport().click();

        const submittedReportPage = new SubmittedReportPage(1);
        submittedReportPage.isAt();

        submittedReportPage.verifyReportData({
          grantName: "Grant Mitchell",
          submissionDate: "15/09/2018"
        });

        const grantProgress = submittedReportPage.grantProgress;
        grantProgress.title.should("contain.text", "Grant progress");
        grantProgress.content.should(
          "contain.text",
          "Mitchell overview completed"
        );
      });

      it("redirects to the Reports Listing page if accessing a details page for an incomplete report", () => {
        new SubmittedReportPage(2).visit();

        reportsListingPage.isAt();
      });

      it("redirects to the Reports Listing page if accessing a details page for a non-existent report", () => {
        new SubmittedReportPage(3).visit();

        reportsListingPage.isAt();
      });
    });

    context("Only incomplete reports", () => {
      beforeEach(() => {
        cy.seed("one-incomplete-report.json");
        cy.login("daisy@hr.org", "chooselove");
      });

      it("shows a message saying there are no reports", () => {
        reportsListingPage.noReportsTitle.should(
          "contains.text",
          "No submitted reports yet!"
        );
      });
    });
  });

  context("Ellen is logged in", () => {
    const forbiddenPage = new ForbiddenPage();

    beforeEach(() => {
      cy.login("ellen@ip.org", "flamingo");
    });

    it("is not able to see the Reports Listing page", () => {
      reportsListingPage.visit();

      forbiddenPage.message.should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });

    it("is not able to see the Submitted Report page", () => {
      new SubmittedReportPage(1).visit();

      forbiddenPage.message.should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });
  });
});
