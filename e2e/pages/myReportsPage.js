import BasePage from "./basePage";

export default class MyReportsPage extends BasePage {
  path = "/myReports";

  reportsSelector = '[data-test-id="report"]';

  get reports() {
    return cy.get(this.reportsSelector);
  }
}
