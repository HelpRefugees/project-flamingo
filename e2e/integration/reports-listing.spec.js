context("Reports Listing Page", () => {
  context("Only incomplete reports", () => {
    beforeEach(() => {
      cy.seed("one-incomplete-report.json");
      cy.login("daisy@hr.org", "chooselove");
    });

    it("shows her name 'Daisy Jones'", () => {
      cy.get('[data-test-id="user-name"]').should(
        "contains.text",
        "Daisy Jones"
      );
    });

    it("shows the title 'Reports'", () => {
      cy.get('[data-test-id="page-title"]').should("contains.text", "Reports");
    });

    it("shows a message saying there are no reports", () => {
      cy.get('[data-test-id="no-reports-title"]').should(
        "contains.text",
        "No submitted reports yet!"
      );
    });
  });

  context("One completed report", () => {
    beforeEach(() => {
      cy.seed("one-completed-report.json");
      cy.login("daisy@hr.org", "chooselove");
    });

    it("shows a list of submitted reports", () => {
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
  });
});
