import GrantsListingPage from "../pages/grantsListingPage";
import LoginPage from "../pages/loginPage";

context("Grants Listing Page", () => {
  let loginPage;
  let grantsListingPage;

  beforeEach(() => {
    cy.seed("one-completed-report.json");
    loginPage = new LoginPage();
    grantsListingPage = new GrantsListingPage();
    loginPage.login("daisy@hr.org", "chooselove");
    grantsListingPage.visit();
  });

  it("shows a list of grants", () => {
    grantsListingPage.isAt();
    grantsListingPage.pageTitle.should("contain.text", "Grants");
    grantsListingPage.grantAt("grant-mitchell", grantListItem => {
      grantListItem.name.should("contain.text", "Grant Mitchell");
      grantListItem.organisation.should("contain.text", "Ellen Smith");
    });
    grantsListingPage.grantAt("hugh-grant", grantListItem => {
      grantListItem.name.should("contain.text", "Hugh Grant");
      grantListItem.organisation.should("contain.text", "Helen Brown");
    });
  });
});
