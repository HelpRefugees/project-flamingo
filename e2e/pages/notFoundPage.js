import BasePage from "./basePage";

export default class NotFoundPage extends BasePage {
  get notFoundMessage() {
    return cy.get('[data-test-id="not-found"]');
  }
}
