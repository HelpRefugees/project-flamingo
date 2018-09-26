context("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows application title", () => {
    cy.get("h1").should("have.text", "Impact Tracker");
  });

  it("reject invalid credentials", () => {
    // arrange
    cy.get('[data-test-id="username-input"] input').type("ellen@ip.org");
    cy.get('[data-test-id="password-input"] input').type("worngpassword");
    cy.get('[data-test-id="login-error"]').should("not.exist");

    // act
    cy.get('[data-test-id="login-button"]').click();

    // assert
    cy.get('[data-test-id="login-error"]').should(
      "contains.text",
      "Invalid credentials"
    );
  });
});
