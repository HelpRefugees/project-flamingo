import LoginPage from "../pages/loginPage";
import MyReportsPage from "../pages/myReportsPage";
import ReportsListingPage from "../pages/reportsListingPage";

context("Login Page", () => {
  const loginPage = new LoginPage();
  const myReportsPage = new MyReportsPage();
  const reportsListingPage = new ReportsListingPage();

  beforeEach(() => {
    loginPage.visit();

    cy.logout();
  });

  it("prevents access to the home page when not logged in", () => {
    myReportsPage.visit();
    myReportsPage.isAt(false);
  });

  it("rejects invalid credentials", () => {
    loginPage.loginError.should("not.exist");

    loginAs("ellen@ip.org", "wrongpassword");

    loginPage.loginError.should("contains.text", "Invalid credentials");

    cy.reload();

    loginPage.loginError.should("not.exist");
  });

  it("accepts Ellen's valid credentials", () => {
    loginAs("ellen@ip.org", "flamingo");

    myReportsPage.isAt();
  });

  it("accepts Daisy's valid credentials", () => {
    loginAs("daisy@hr.org", "chooselove");

    reportsListingPage.isAt();
  });

  it("redirects to the login page when clicking logout", () => {
    loginAs("ellen@ip.org", "flamingo");

    cy.logout();

    loginPage.loginButton.should("be.visible");
  });

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.login("ellen@ip.org", "flamingo");
    });

    it("prevents access to the login page", () => {
      myReportsPage.userMenu.should("be.visible");
      myReportsPage.reports.should("be.visible");

      cy.wait(500);
      loginPage.visit();

      myReportsPage.isAt();
    });
  });

  function loginAs(username, password) {
    loginPage.setUsername(username);
    loginPage.setPassword(password);
    loginPage.clickLogin();
  }
});
