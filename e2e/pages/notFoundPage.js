import BasePage from "./basePage";

export default class NotFoundPage extends BasePage {
  get message() {
    return cy.get('[data-test-id="not-found"]');
  }
}
