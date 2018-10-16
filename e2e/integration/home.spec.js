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
      const selector
        = '[data-test-id="incomplete-reports"] [data-test-id="report"]';
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

    it("opens and saves an editable report", () => {
      // TODO we need to clear up the database state before the test
      const details = randomText(16);
      cy.get(
        '[data-test-id="incomplete-reports"] [data-test-id="report"]'
      ).click();

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

      cy.get("[data-test-id='logo']").click();
      cy.get(
        '[data-test-id="incomplete-reports"] [data-test-id="report"]'
      ).click();
      cy.get('[data-test-id="report-progress-input"] textarea')
        .last()
        .should("contain.text", details);
    });

    it("submits a report", () => {
      const details = randomText(16);

      cy.get(
        '[data-test-id="incomplete-reports"] [data-test-id="report"]'
      ).click();

      cy.url().should("include", "/reports/1");

      cy.get('[data-test-id="report-progress-input"] textarea')
        .last()
        .clear();
      cy.get("[data-test-id='report-submit-button']").should(
        "attr",
        "disabled"
      );

      cy.get('[data-test-id="report-progress-input"] textarea')
        .last()
        .type(details);
      cy.get("[data-test-id='report-submit-button']").click();

      const selector
        = '[data-test-id="completed-reports"] [data-test-id="report"]';
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
            today()
          );
        });

      cy.get("[data-test-id='report-unsubmit-button']").click();
      cy.get('[data-test-id="incomplete-reports"] [data-test-id="report"]')
        .its("length")
        .should("be", 1);
    });
  });

  function today() {
    const now = new Date();
    const day = now
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}/${now.getFullYear()}`;
  }

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
