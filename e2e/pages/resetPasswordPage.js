import BasePage from "./basePage";

import { testId } from "./helpers";

export default class ResetPasswordPage extends BasePage {
  constructor(token) {
    super();
    this.token = token;
  }

  get path() {
    return `/reset-password?token=${this.token}`;
  }

  resetPassword(password) {
    cy.get(`${testId("password-input-one")} input`).type(password);
    cy.get(`${testId("password-input-two")} input`).type(password);
    cy.get(testId("save-password-button")).click();
  }
}
