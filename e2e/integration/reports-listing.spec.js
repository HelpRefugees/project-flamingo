import ReportsListingPage from "../pages/reportsListingPage";
import SubmittedReportPage from "../pages/submittedReportPage";
import ForbiddenPage from "../pages/forbiddenPage";
import NotFoundPage from "../pages/notFoundPage";

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
        reportsListingPage
          .getReportsTable("submitted-reports")
          .should("have.length", 1);
        reportsListingPage
          .getFirstReport("submitted-reports")
          // eslint-disable-next-line no-unused-vars
          .within($report => {
            reportsListingPage.verifyReportData({
              grantName: "Grant Mitchell"
            });
          });
      });

      it("shows the report details after clicking on a report", () => {
        reportsListingPage.getFirstReport("submitted-reports").click();

        const submittedReportPage = new SubmittedReportPage(1);
        submittedReportPage.isAt();

        submittedReportPage.verifyReportData({
          grantName: "Grant Mitchell",
          submissionDate: "15/09/2018"
        });

        const sectionContainsContent = ({
          sectionKey,
          sectionTitle,
          contentKey,
          content
        }) => {
          submittedReportPage.getSection(sectionKey, section => {
            section.title.should("contain.text", sectionTitle);
            section.contentFor(contentKey).should("contain.text", content);
          });
        };

        sectionContainsContent({
          sectionKey: "grant-progress",
          sectionTitle: "Grant overview",
          contentKey: "report-progress",
          content: "Mitchell overview completed"
        });

        submittedReportPage.getSection(
          "grant-key-activities",
          grantProgressSection => {
            grantProgressSection.title.should(
              "contain.text",
              "Key activities & impact"
            );
            grantProgressSection
              .contentFor("report-key-activity-name")
              .should("contain.text", "activityName");
            grantProgressSection
              .contentFor("report-number-of-participants")
              .should("contain.text", "123");
            grantProgressSection
              .contentFor("report-demographic-info")
              .should("contain.text", "demographicInfo");
            grantProgressSection
              .contentFor("report-impact-outcome")
              .should("contain.text", "impactOutcome");
          }
        );

        sectionContainsContent({
          sectionKey: "operating-environment",
          sectionTitle: "Operating environment",
          contentKey: "report-operating-environment",
          content: "operatingEnvironment"
        });

        sectionContainsContent({
          sectionKey: "beneficiary-feedback",
          sectionTitle: "Beneficiary feedback",
          contentKey: "report-beneficiary-feedback",
          content: "beneficiaryFeedback"
        });

        sectionContainsContent({
          sectionKey: "challenges-faced",
          sectionTitle: "Challenges faced and lessons learned",
          contentKey: "report-challenges-faced",
          content: "challengesFaced"
        });

        sectionContainsContent({
          sectionKey: "incidents",
          sectionTitle: "Incidents and near misses",
          contentKey: "report-incidents",
          content: "incidents"
        });

        sectionContainsContent({
          sectionKey: "other-issues",
          sectionTitle:
            "Is there anything you would like to use our platform to speak about?",
          contentKey: "report-other-issues",
          content: "otherIssues"
        });

        sectionContainsContent({
          sectionKey: "materials-for-fundraising",
          sectionTitle: "Materials for fundraising",
          contentKey: "report-materials-for-fundraising",
          content: "materialsForFundraising"
        });
      });

      it("redirects to the not found page if accessing a details page for a non-existent report", () => {
        new SubmittedReportPage(123).visit();

        new NotFoundPage().message.should(
          "contains.text",
          "404 Sorry! Page not found."
        );
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

    context("Multiple completed reports", () => {
      beforeEach(() => {
        cy.seed("multiple-completed-reports.json"); // TODO from different grants
        cy.login("daisy@hr.org", "chooselove");
      });

      it("allows filtering by grant", () => {
        reportsListingPage
          .getReportsTable("submitted-reports")
          .should("have.length", 2);

        reportsListingPage.filterBy("mitch");

        reportsListingPage
          .getReportsTable("submitted-reports")
          .should("have.length", 1);

        reportsListingPage.clearFilter();

        reportsListingPage
          .getReportsTable("submitted-reports")
          .should("have.length", 2);
      });

      context("No overdue reports", () => {
        beforeEach(() => {
          cy.login("daisy@hr.org", "chooselove");
        });

        it("overdue reports tab shows no overdue reports message", () => {
          reportsListingPage.goToReportTab("overdue-reports-tab");
          reportsListingPage.noReportsTitle.should(
            "contains.text",
            "Good news!"
          );
        });
      });
    });

    context("show completed and overdue reports", () => {
      beforeEach(() => {
        cy.seed("multiple-completed-overdue-reports.json");
        cy.login("daisy@hr.org", "chooselove");
      });

      it("show overdue report", () => {
        reportsListingPage.visit();
        reportsListingPage.isAt();
        reportsListingPage.goToReportTab("overdue-reports-tab");
        reportsListingPage.getFirstReport("overdue-reports");
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
