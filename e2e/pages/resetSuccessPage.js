import BasePage from "./basePage";

import { testId } from "./helpers";

export default class ResetSuccessPage extends BasePage {
  path = "/reset-success";

  get backToLogin() {
    return cy.get(testId("back-to-login"));
  }
}
