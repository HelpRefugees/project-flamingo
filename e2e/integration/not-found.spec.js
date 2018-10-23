import NotFoundPage from "../pages/notFoundPage";

context("Not Found Page", () => {
  const notFoundPage = new NotFoundPage();

  it("shows not found page when navigating to invalid path", () => {
    cy.visit("/invalidpath");

    notFoundPage.notFoundMessage.should(
      "contains.text",
      "404 Sorry! Page not found."
    );
  });

  it("does not show not found page when navigating to valid path", () => {
    cy.visit("/");

    notFoundPage.notFoundMessage.should("not.exist");
  });
});
