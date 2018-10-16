context.only("Not Found Page", () => {
  it("shows not found page when navigating to invalid path", () => {
    cy.visit("/invalidpath");

    cy.get('[data-test-id="not-found"]').should(
      "contains.text",
      "404 Sorry page not found."
    );
  });

  it("does not show not found page when navigating to valid path", () => {
    cy.visit("/");

    cy.get('[data-test-id="not-found"]').should(
      "not.contains.text",
      "404 Sorry page not found."
    );
  });
});
