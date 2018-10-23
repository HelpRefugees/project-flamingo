export default class BasePage {
  userMenuSelector = '[data-test-id="user-menu"]';
  logoutMenuItemSelector = '[data-test-id="logout-menuitem"]';

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
        cy.get(this.logoutMenuItemSelector).click();
      }
    });
  }

  get userMenu() {
    return cy.get(this.userMenuSelector);
  }
}
