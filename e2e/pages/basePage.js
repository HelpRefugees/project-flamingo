import { testId } from "./helpers";

export default class BasePage {
  userMenuSelector = testId("user-menu");

  visit() {
    cy.visit(this.path);
  }

  isAt(assert = true) {
    cy.url().should(
      assert ? "include" : "not.include",
      this.path,
      `should ${assert ? "" : "not "}go to ${this.path}`
    );
  }

  logout() {
    cy.get("body").then($body => {
      if ($body.find(this.userMenuSelector).length) {
        this.userMenu.click();
        cy.get(testId("logout-menuitem")).click();
      }
    });
  }

  get userName() {
    return cy.get(testId("user-name"));
  }

  get userMenu() {
    return cy.get(this.userMenuSelector);
  }

  get pageTitle() {
    return cy.get(testId("page-title"));
  }

  goToHomePage() {
    cy.get(testId("logo")).click();
  }
}
