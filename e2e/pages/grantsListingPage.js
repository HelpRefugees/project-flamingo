import { testId } from "./helpers";
import BasePage from "./basePage";

export default class GrantsListingPage extends BasePage {
  path = "/grants";

  visit() {
    cy.get(testId("nav-link-grants")).click();
  }

  get addGrantButton() {
    return cy.get(testId("add-grant-button"));
  }

  grantAt(index, callback) {
    return cy
      .get(testId("grant-list"))
      .within(() => callback(new GrantListItemPage(index)));
  }
}

export class GrantListItemPage {
  constructor(index) {
    this.index = index;
  }

  get name() {
    return cy.get(testId("grant-name")).eq(this.index);
  }

  get organisation() {
    return cy.get(testId("grant-organisation")).eq(this.index);
  }

  get username() {
    return cy.get(testId("grant-username")).eq(this.index);
  }
}
