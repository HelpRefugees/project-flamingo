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
    grantsListingPage.grantAt(0).should("contain.text", "Ellen Smith");
    grantsListingPage.grantAt(1).should("contain.text", "Helen Brown");
  });
});
