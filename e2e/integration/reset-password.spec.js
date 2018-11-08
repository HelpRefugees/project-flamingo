import LoginPage from "../pages/loginPage";
import ForgotPasswordPage from "../pages/forgotPasswordPage";
import ResetSubmittedPage from "../pages/resetSubmittedPage";
import ResetPasswordPage from "../pages/resetPasswordPage";
import ResetSuccessPage from "../pages/resetSuccessPage";
import ReportsListingPage from "../pages/reportsListingPage";

describe("resetting a password", () => {
  const loginPage = new LoginPage();
  const forgotPasswordPage = new ForgotPasswordPage();
  const resetRequestedPage = new ResetSubmittedPage();
  const resetSuccessPage = new ResetSuccessPage();
  const reportsListingPage = new ReportsListingPage();

  beforeEach(() => {
    cy.seed("one-incomplete-report.json");
    cy.request("DELETE", `${Cypress.env("WEBHOOK")}/_calls`);
    loginPage.visit();
  });

  it("allows the user to reset their password", () => {
    loginPage.forgottenPasswordButton.click();

    forgotPasswordPage.isAt();

    forgotPasswordPage.requestReset("daisy@hr.org");

    resetRequestedPage.isAt();

    resetRequestedPage.message.should(
      "contain.text",
      "If you have a HelpRefugees account linked to this email address, we'll send you instructions to reset your password."
    );

    resetRequestedPage.backToLogin.click();
    loginPage.isAt();

    cy.request(`${Cypress.env("WEBHOOK")}/_calls`).then(({ body }) => {
      expect(body.length).to.eq(1);
      expect(body[0].resetToken).to.match(/[0-9a-f]{32}/);
      expect(body[0].recipients).to.deep.eq(["daisy@hr.org"]);
      expect(body[0].task).to.eq("reset-password");

      const resetPasswordPage = new ResetPasswordPage(body[0].resetToken);
      resetPasswordPage.visit();

      resetPasswordPage.setNewPassword("new-password");

      resetSuccessPage.isAt();
      resetSuccessPage.backToLogin.click();

      loginPage.isAt();
      loginPage.setUsername("daisy@hr.org");
      loginPage.setPassword("new-password");
      loginPage.clickLogin();

      reportsListingPage.isAt();
    });
  });
});
