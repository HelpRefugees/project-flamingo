context("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows the application title", () => {
    cy.get("h1").should("have.text", "Impact Tracker");
  });

  it("rejects invalid credentials", () => {
    // arrange
    cy.get('[data-test-id="username-input"] input').type("ellen@ip.org");
    cy.get('[data-test-id="password-input"] input').type("wrongpassword");
    cy.get('[data-test-id="login-error"]').should("not.exist");

    // act
    cy.get('[data-test-id="login-button"]').click();

    // assert
    cy.get('[data-test-id="login-error"]').should(
      "contains.text",
      "Invalid credentials"
    );
  });

  it("accepts the valid credentials", () => {
    // arrange
    cy.get('[data-test-id="username-input"] input').type("ellen@ip.org");
    cy.get('[data-test-id="password-input"] input').type("flamingo");

    // act
    cy.get('[data-test-id="login-button"]').click();

    // assert
    cy.url().should("include", "/home", "should navigate to home page");
  });
});
