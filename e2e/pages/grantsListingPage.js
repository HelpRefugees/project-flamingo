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

  grantAt(grantId, callback) {
    return cy
      .get(testId("grant-list"))
      .within(() => callback(new GrantListItemPage(grantId)));
  }
}

export class GrantListItemPage {
  constructor(grantId) {
    this.grantId = grantId;
  }

  selector(field) {
    return `${testId(this.grantId)} ${testId(field)}`;
  }

  get name() {
    return cy.get(this.selector("grant-name"));
  }

  get organisation() {
    return cy.get(this.selector("grant-organisation"));
  }

  get region() {
    return cy.get(this.selector("grant-region"));
  }
}
