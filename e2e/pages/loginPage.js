import BasePage from "./basePage";

export default class LoginPage extends BasePage {
  path = "/";

  usernameSelector = '[data-test-id="username-input"] input';
  passwordSelector = '[data-test-id="password-input"] input';
  loginButtonSelector = '[data-test-id="login-button"]';
  loginErrorSelector = '[data-test-id="login-error"]';

  setPassword(password) {
    cy.get(this.passwordSelector).type(password);
  }

  get loginButton() {
    return cy.get(this.loginButtonSelector);
  }

  get usernameInput() {
    return cy.get(this.usernameSelector);
  }

  get loginError() {
    return cy.get(this.loginErrorSelector);
  }

  setUsername(username) {
    this.usernameInput.type(username);
  }

  clickLogin() {
    this.loginButton.click();
  }
}
