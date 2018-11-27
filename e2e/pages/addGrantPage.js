import { testId } from "./helpers";
import BasePage from "./basePage";
export default class AddGrantPage extends BasePage {
  path = "/grants/new";

  grantInfoTitleSelector = "grant-info-title";
  grantInfoSubTitleSelector = "grant-info-subtitle";
  grantNameSelector = "grant-name-text";
  organizationNameSelector = "organization-name-text";
  sectorSelector = "sector-text";
  grantdescriptionSelector = "grant-description-text";
  regionSelector = "region-text";
  startDateSelector = "grant-start-date";
  endDateSelector = "grant-end-date";
  otherInfoSelector = "other-info-text";

  accountEmail = "account-email";

  visit() {
    cy.visit(this.path);
  }

  get form() {
    return cy.get(testId("add-grant-form"));
  }

  formCheck() {
    this.form.within(() => {
      cy.get(this.grantInfoTitleSelector).should(
        "contains",
        "Grant information"
      );
      cy.get(this.grantInfoSubTitleSelector).should(
        "contains",
        "Please fill out the form below with the grant information."
      );

      cy.get(this.grantNameSelector).should("be.visible");

      cy.get(this.organizationNameSelector).should("be.visible");

      cy.get(this.grantNameSelector).should("be.visible");

      cy.get(this.sectorSelector).should("be.visible");

      cy.get(this.grantdescriptionSelector).should("be.visible");

      cy.get(this.regionSelector).should("be.visible");

      cy.get(this.startDateSelector).should("be.visible");

      cy.get(this.endDateSelector).should("be.visible");

      cy.get(this.otherInfoSelector).should("be.visible");
    });
  }
}
