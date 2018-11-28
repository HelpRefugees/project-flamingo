import { testId } from "./helpers";
import BasePage from "./basePage";

export default class AddGrantPage extends BasePage {
  constructor() {
    super();
  }
  path = "/grants/new";

  grantInfoTitleSelector = "grant-info-title";
  grantInfoSubTitleSelector = "grant-info-subtitle";
  grantNameSelector = "grant-name-text";
  organizationNameSelector = "organization-name-text";
  sectorSelector = "sector-text";
  grantDescriptionSelector = "grant-description-text";
  regionSelector = "region-text";
  countrySelector = "country-text";
  otherInfoSelector = "other-info-text";

  accoutInfoTitle = "account-info-title";
  accoutInfoSubTitle = "account-info-subtitle";

  accountEmail = "account-email";
  accountPassword = "account-password";

  visit() {
    cy.visit(this.path);
  }

  get form() {
    return cy.get(testId("add-grant-form"));
  }

  editForm(newGrant) {
    this.form.within(() => {
      cy.get(testId(this.grantInfoTitleSelector)).should(
        "contain.text",
        "Grant information"
      );

      cy.get(testId(this.grantInfoSubTitleSelector)).should(
        "contain.text",
        "Please fill out the form below with the grant information."
      );

      cy.get(testId(this.grantNameSelector) + " input").type(
        newGrant.grantName
      );

      cy.get(testId(this.organizationNameSelector) + " input").type(
        newGrant.organizationName
      );

      cy.get(testId(this.sectorSelector) + " input").type(newGrant.sector);

      cy.get(testId(this.grantDescriptionSelector) + " input").type(
        newGrant.grantDescription
      );

      cy.get(testId(this.regionSelector) + " input").type(newGrant.region);

      cy.get(testId(this.countrySelector) + " input").type(newGrant.country);

      cy.get(testId(this.otherInfoSelector) + " input").type(
        newGrant.otherInfo
      );

      cy.get(testId(this.accoutInfoTitle)).should(
        "contain.text",
        "Account information"
      );

      cy.get(testId(this.accoutInfoSubTitle)).should(
        "contain.text",
        "By adding an email address you are inviting a user to this grant. There can be only a single email added."
      );
      cy.get(testId(this.accountEmail) + " input").type(newGrant.accountEmail);

      cy.get(testId(this.accountPassword) + " input").type(
        newGrant.accountPassword
      );
    });
  }
}
