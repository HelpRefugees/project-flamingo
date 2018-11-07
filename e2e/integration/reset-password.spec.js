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
  const resetPasswordPage = new ResetPasswordPage("thisismytoken");
  const resetSuccessPage = new ResetSuccessPage();
  const reportsListingPage = new ReportsListingPage();

  beforeEach(() => {
    cy.seed("one-reset-user.json");
    loginPage.visit();
  });

  it("allows the user to request a reset", () => {
    loginPage.forgottenPasswordButton.click();

    forgotPasswordPage.isAt();

    forgotPasswordPage.requestReset("foo@bar.com");

    resetRequestedPage.isAt();

    resetRequestedPage.message.should(
      "contain.text",
      "If you have a HelpRefugees account linked to this email address, we'll send you instructions to reset your password."
    );

    resetRequestedPage.backToLogin.click();
    loginPage.isAt();
  });

  it("allows the user to reset their password", () => {
    resetPasswordPage.visit();

    resetPasswordPage.resetPassword("new-password");

    resetSuccessPage.isAt();
    resetSuccessPage.backToLogin.click();

    loginPage.isAt();
    loginPage.setUsername("foo@bar.com");
    loginPage.setPassword("new-password");
    loginPage.clickLogin();

    reportsListingPage.isAt();
  });
});
