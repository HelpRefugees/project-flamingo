import GrantsListingPage from "../pages/grantsListingPage";
import LoginPage from "../pages/loginPage";
import AddGrantPage from "../pages/addGrantPage";

context("Grants Listing Page", () => {
  let loginPage;
  let grantsListingPage;
  let addGrantPage;

  beforeEach(() => {
    cy.seed("one-completed-report.json");
    loginPage = new LoginPage();
    grantsListingPage = new GrantsListingPage();
    addGrantPage = new AddGrantPage();
    loginPage.login("daisy@hr.org", "chooselove");
    grantsListingPage.visit();
    grantsListingPage.isAt();
  });

  it("shows a list of grants", () => {
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

  it("adds a new grant", () => {
    grantsListingPage.addGrantButton.click();
    addGrantPage.isAt();
  });
});

context("Add new grant Page", () => {
  let loginPage;
  let addGrantPage;

  beforeEach(() => {
    cy.seed("one-completed-report.json");
    loginPage = new LoginPage();
    addGrantPage = new AddGrantPage();
    loginPage.login("daisy@hr.org", "chooselove");
    addGrantPage.visit();
  });

  it("shows add grant form", () => {
    addGrantPage.pageTitle.should("contains", "Add a new grant");
    addGrantPage.formCheck();
  });
});
