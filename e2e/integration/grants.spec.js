import GrantsListingPage from "../pages/grantsListingPage";
import LoginPage from "../pages/loginPage";

context("Grants Listing Page", () => {
  beforeEach(() => {
    cy.seed("one-completed-report.json");
  });

  it("shows a list of grants", () => {
    const loginPage = new LoginPage();

    loginPage.login("daisy@hr.org", "chooselove");

    const grantsListingPage = new GrantsListingPage();

    grantsListingPage.visit();
    grantsListingPage.isAt();
    grantsListingPage.pageTitle.should("contain.text", "Grants");
    grantsListingPage.grantAt(0, grantListItem => {
      grantListItem.name.should("contain.text", "Ellen Smith");
      grantListItem.organisation.should("contain.text", "Grant Mitchell");
      grantListItem.username.should("contain.text", "ellen@ip.org");
    });
    grantsListingPage.grantAt(1, grantListItem => {
      grantListItem.name.should("contain.text", "Helen Brown");
      grantListItem.organisation.should("contain.text", "Hugh Grant");
      grantListItem.username.should("contain.text", "helen@ip.org");
    });
  });
});
