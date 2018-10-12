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

    it("opens an editable report", () => {
      // TODO we need to clear up the database state before the test
      const details = randomText(16);
      cy.get('[data-test-id="report"]').click();

      cy.url().should("include", "/reports/1");
      cy.get("[data-test-id='grant-name']").should(
        "contain.text",
        "Grant Mitchell"
      );
      cy.get("[data-test-id='report-details-title']").should(
        "contain.text",
        "Grant progress"
      );
      cy.get("[data-test-id='report-save-button']").should("attr", "disabled");

      cy.get('[data-test-id="report-progress-input"] textarea')
        .last()
        .clear()
        .type(details);

      cy.get("[data-test-id='report-save-button']").click();

      cy.visit("/");
      cy.get('[data-test-id="report"]').click();
      cy.get('[data-test-id="report-progress-input"] textarea')
        .last()
        .should("contain.text", details);
    });
  });

  function randomText(length) {
    let text = "";
    const possible
      = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
});
