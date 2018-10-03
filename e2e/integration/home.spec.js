context.only("Home Page", () => {
  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.login("ellen@ip.org", "flamingo");
    });

    it("shows an appropriate title", () => {
      cy.get('[data-test-id="page-title"]').should(
        "contains.text",
        "Monthly Report"
      );
    });

    it("shows an incomplete report", () => {
      const selector = '[data-test-id="report"]';
      cy.get(selector)
        .its("length")
        .should("be", 1);
      cy.get(selector)
        .first()
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          cy.get('[data-test-id="grant-name"]').should(
            "contains.text",
            "Grant Mitchell"
          );
          cy.get('[data-test-id="report-status"]').should(
            "contains.text",
            "Incomplete"
          );
        });
    });
  });
});
