import { testId } from "./helpers";
import BasePage from "./basePage";

export default class GrantsListingPage extends BasePage {
  path = "/grants";

  visit() {
    cy.get(testId("nav-link-grants")).click();
  }

  grantAt(index) {
    return cy
      .get('[data-test-id="grant-list"] [data-test-id="grant-name"]')
      .eq(index);
  }
}
