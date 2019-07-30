import BasePage from "./basePage";
import { testId } from "./helpers";

export default class NotFoundPage extends BasePage {
  isAt() {
    cy.get(testId("not-found"));
  }
  get message() {
    return cy.get(testId("not-found"));
  }
}
