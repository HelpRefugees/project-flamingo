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

import LoginPage from "../pages/loginPage";
import BasePage from "../pages/basePage";

const loginPage = new LoginPage();
const basePage = new BasePage();

const credentials = {
  "daisy@hr.org": "chooselove",
  "ellen@ip.org": "flamingo",
  "helen@ip.org": "eatshrimp"
};

Cypress.Commands.add("login", (username, password) => {
  loginPage.visit();
  cy.logout();

  loginPage.setUsername(username);
  loginPage.setPassword(password || credentials[username]);
  loginPage.clickLogin();

  basePage.userMenu.should("be.visible");
  cy.wait(250);
});

Cypress.Commands.add("logout", () => {
  basePage.logout();
  loginPage.usernameInput.should("exist");
});

Cypress.Commands.add("seed", seedFile =>
  cy.exec(`node ./e2e/data/loader.js ./e2e/data/${seedFile}`)
);
