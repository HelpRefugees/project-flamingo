context("Reports Listing Page", () => {
  context("Daisy is logged in", () => {
    context("One completed report", () => {
      beforeEach(() => {
        cy.seed("one-completed-report.json");
        cy.login("daisy@hr.org", "chooselove");
      });

      it("shows her name 'Daisy Jones'", () => {
        cy.get('[data-test-id="user-name"]').should(
          "contains.text",
          "Daisy Jones"
        );
      });

      it("shows the title 'Reports'", () => {
        cy.get('[data-test-id="page-title"]').should(
          "contains.text",
          "Reports"
        );
      });

      it("shows a table containing the submitted report", () => {
        const selector
          = '[data-test-id="submitted-reports"] [data-test-id="report"]';
        cy.get(selector)
          .its("length")
          .should("be", 1);
        cy.get(selector)
          .first()
          // eslint-disable-next-line no-unused-vars
          .within($report => {
            cy.get('[data-test-id="report-grant"]').should(
              "contains.text",
              "Grant Mitchell"
            );
          });
      });

      it("shows the report details after clicking on a report", () => {
        cy.get(
          '[data-test-id="submitted-reports"] [data-test-id="report"]'
        ).click();

        cy.url().should("include", "/submittedReports/1");
        cy.get("[data-test-id='grant-name']").should(
          "contain.text",
          "Grant Mitchell"
        );
        cy.get('[data-test-id="submission-date"]').should(
          "contain.text",
          "15/09/2018"
        );
        cy.get("[data-test-id='report-details-title']").should(
          "contain.text",
          "Grant progress"
        );
        cy.get('[data-test-id="report-progress"]')
          .last()
          .should("contain.text", "Mitchell overview completed");
      });

      it("redirects to the Reports Listing page if accessing a details page for an incomplete report", () => {
        cy.visit("/submittedReports/2");

        cy.url().should("include", "/reportsListing");
      });

      it("redirects to the Reports Listing page if accessing a details page for a non-existing report", () => {
        cy.visit("/submittedReports/3");

        cy.url().should("include", "/reportsListing");
      });
    });

    context("Only incomplete reports", () => {
      beforeEach(() => {
        cy.seed("one-incomplete-report.json");
        cy.login("daisy@hr.org", "chooselove");
      });

      it("shows a message saying there are no reports", () => {
        cy.get('[data-test-id="no-reports-title"]').should(
          "contains.text",
          "No submitted reports yet!"
        );
      });
    });
  });

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.login("ellen@ip.org", "flamingo");
    });

    it("is not able to see the Reports Listing page", () => {
      cy.visit("/reportsListing");

      cy.get('[data-test-id="forbidden"]').should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });

    it("is not able to see the Submitted Report page", () => {
      cy.visit("/submittedReports/1");

      cy.get('[data-test-id="forbidden"]').should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });
  });
});
