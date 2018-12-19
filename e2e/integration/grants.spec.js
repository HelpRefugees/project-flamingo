import GrantsListingPage from "../pages/grantsListingPage";
import LoginPage from "../pages/loginPage";
import AddGrantPage from "../pages/addGrantPage";
import { testId } from "../pages/helpers";

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
