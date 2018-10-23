import BasePage from "./basePage";
import { testId } from "./helpers";

export default class NotFoundPage extends BasePage {
  get message() {
    return cy.get(testId("not-found"));
  }
}
