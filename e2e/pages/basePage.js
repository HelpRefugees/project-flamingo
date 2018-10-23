export default class BasePage {
  userMenuSelector = '[data-test-id="user-menu"]';
  logoutMenuItemSelector = '[data-test-id="logout-menuitem"]';
  pageTitleSelector = this.testId("page-title");
  userNameSelector = this.testId("user-name");
  logoSelector = this.testId("logo");

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

  testId(testIdName) {
    return `[data-test-id="${testIdName}"]`;
  }

  get userName() {
    return cy.get(this.userNameSelector);
  }

  get userMenu() {
    return cy.get(this.userMenuSelector);
  }

  get pageTitle() {
    return cy.get(this.pageTitleSelector);
  }

  goToHomePage() {
    cy.get(this.logoSelector).click();
  }
}
