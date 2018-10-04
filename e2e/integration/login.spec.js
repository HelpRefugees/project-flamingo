context("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("prevents access to the home page when not logged in", () => {
    cy.visit("/home");

    cy.url().should("not.include", "/home", "should not go to home page");
  });

  it("rejects invalid credentials", () => {
    cy.get('[data-test-id="login-error"]').should("not.exist");

    loginAs("ellen@ip.org", "wrongpassword");

    cy.get('[data-test-id="login-error"]').should(
      "contains.text",
      "Invalid credentials"
    );

    cy.reload();

    cy.get('[data-test-id="login-error"]').should("not.exist");
  });

  it("accepts the valid credentials", () => {
    loginAs("ellen@ip.org", "flamingo");

    cy.url().should("include", "/home", "should redirect to home page");
  });

  it("redirects to the login page when clicking logout", () => {
    loginAs("ellen@ip.org", "flamingo");
    logout();

    cy.get('[data-test-id="login-button"]').should("be.visible");
  });

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.visit("/");
      loginAs("ellen@ip.org", "flamingo");
    });

    afterEach(() => {
      logout();
    });

    it("prevents access to the login page", () => {
      cy.visit("/");

      cy.url().should("include", "/home", "should redirect to home page");
    });
  });

  function loginAs(username, password) {
    cy.get('[data-test-id="username-input"] input').type(username);
    cy.get('[data-test-id="password-input"] input').type(password);
    cy.get('[data-test-id="login-button"]').click();
  }

  function logout() {
    cy.get('[data-test-id="user-menu"]').click();
    cy.get('[data-test-id="logout-menuitem"]').click();
  }
});
