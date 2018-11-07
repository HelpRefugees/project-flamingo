import BasePage from "./basePage";
import { testId } from "./helpers";

export default class LoginPage extends BasePage {
  path = "/";

  setPassword(password) {
    cy.get(`${testId("password-input")} input`).type(password);
  }

  get loginButton() {
    return cy.get(testId("login-button"));
  }

  get usernameInput() {
    return cy.get(`${testId("username-input")} input`);
  }

  get loginError() {
    return cy.get(testId("login-error"));
  }

  get forgottenPasswordButton() {
    return cy.get(testId("forgot-password"));
  }

  setUsername(username) {
    this.usernameInput.type(username);
  }

  clickLogin() {
    this.loginButton.click();
  }
}
