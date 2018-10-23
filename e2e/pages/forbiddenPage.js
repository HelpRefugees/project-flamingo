import BasePage from "./basePage";

export default class ForbiddenPage extends BasePage {
  path = "/forbidden";

  get message() {
    return cy.get('[data-test-id="forbidden"]');
  }
}
