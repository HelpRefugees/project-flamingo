import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ForgotPasswordPage extends BasePage {
  path = "/forgotten-password";

  requestReset(email) {
    cy.get(`${testId("username-input")} input`).type(email);
    cy.get(testId("reset-password")).click();
  }
}
