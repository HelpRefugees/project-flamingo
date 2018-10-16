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
});
