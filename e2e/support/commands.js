// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/");
  cy.logout();
  cy.get('[data-test-id="username-input"] input').type(username);
  cy.get('[data-test-id="password-input"] input').type(password);
  cy.get('[data-test-id="login-button"]').click();
  cy.get('[data-test-id="user-menu"]').should("be.visible");
});

Cypress.Commands.add("logout", () => {
  cy.get("body").then($body => {
    if ($body.find('[data-test-id="user-menu"]').length) {
      cy.get('[data-test-id="user-menu"]').click();
      cy.get('[data-test-id="logout-menuitem"]').click();
    }
  });
  cy.get('[data-test-id="username-input"]').should("exist");
});
