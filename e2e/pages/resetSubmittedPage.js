import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ResetSubmittedPage extends BasePage {
  path = "/reset-submitted";

  get backToLogin() {
    return cy.get(testId("back-to-login"));
  }

  get message() {
    return cy.get(testId("message"));
  }
}
