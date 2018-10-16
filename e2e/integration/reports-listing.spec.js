context("Reports Listing Page", () => {
  context("Daisy is logged in", () => {
    beforeEach(() => {
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
  });
});
