import LoginPage from "../pages/loginPage";
import MyReportsPage from "../pages/myReportsPage";
import ReportsListingPage from "../pages/reportsListingPage";

context("Login Page", () => {
  const loginPage = new LoginPage();
  const myReportsPage = new MyReportsPage();
  const reportsListingPage = new ReportsListingPage();

  beforeEach(() => {
    cy.seed("one-incomplete-report.json");
    loginPage.visit();

    cy.logout();
  });

  it("prevents access to the home pages when not logged in", () => {
    myReportsPage.visit();
    myReportsPage.isAt(false);
    reportsListingPage.visit();
    reportsListingPage.isAt(false);
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

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.login("ellen@ip.org", "flamingo");
    });

    it("prevents Ellen's access to the login page", () => {
      myReportsPage.userMenu.should("be.visible");
      myReportsPage.reports.should("be.visible");

      cy.wait(500);
      loginPage.visit();

      myReportsPage.isAt();
    });

    it("redirects Ellen to the login page when clicking logout", () => {
      myReportsPage.logout();

      loginPage.loginButton.should("be.visible");
    });
  });

  context("Daisy is logged in", () => {
    beforeEach(() => {
      cy.login("daisy@hr.org", "chooselove");
    });

    it("prevents Daisy's access to the login page", () => {
      reportsListingPage.userMenu.should("be.visible");

      cy.wait(500);
      loginPage.visit();

      reportsListingPage.isAt();
    });

    it("redirects Daisy to the login page when clicking logout", () => {
      myReportsPage.logout();

      loginPage.loginButton.should("be.visible");
    });
  });

  function loginAs(username, password) {
    loginPage.setUsername(username);
    loginPage.setPassword(password);
    loginPage.clickLogin();
  }
});
