import BasePage from "./basePage";
import { testId } from "./helpers";

export default class ForbiddenPage extends BasePage {
  path = "/forbidden";

  get message() {
    return cy.get(testId("forbidden"));
  }
}
