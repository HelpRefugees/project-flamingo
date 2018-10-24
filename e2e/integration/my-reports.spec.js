import MyReportsPage from "../pages/myReportsPage";
import ReportPage from "../pages/reportPage";
import ForbiddenPage from "../pages/forbiddenPage";

context("My Reports Page", () => {
  const myReportsPage = new MyReportsPage();

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org", "flamingo");
    });

    it("shows an appropriate title", () => {
      myReportsPage.pageTitle.should("contains.text", "Monthly Report");
    });

    it("shows her name 'Ellen Smith'", () => {
      myReportsPage.userName.should("contains.text", "Ellen Smith");
    });

    it("shows an incomplete report", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage
        .getFirstReport("incomplete")
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          myReportsPage.verifyReportData({
            grantName: "Grant Mitchell",
            reportStatus: "Incomplete",
            reportPeriod: "August 2018"
          });
        });
    });

    it("opens and saves an editable report", () => {
      const details = randomText(16);
      myReportsPage.getFirstReport("incomplete").click();

      const reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.grantName.should("contain.text", "Grant Mitchell");

      const grantProgessSection = reportPage.grantProgress;
      grantProgessSection.title.should("contain.text", "Grant progress");
      grantProgessSection.saveButton.should("attr", "disabled");

      grantProgessSection.setContent(details);
      grantProgessSection.saveButton.click();

      myReportsPage.goToHomePage();

      myReportsPage.getFirstReport("incomplete").click();
      grantProgessSection.content.should("contain.text", details);
    });

    it("submits a report", () => {
      const details = randomText(16);

      myReportsPage.getFirstReport("incomplete").click();

      const reportPage = new ReportPage(1);
      reportPage.isAt();

      const grantProgessSection = reportPage.grantProgress;
      grantProgessSection.content.clear();
      reportPage.submitButton.should("attr", "disabled");

      grantProgessSection.setContent(details);
      reportPage.submitButton.click();

      myReportsPage.getReports("completed").should("have.length", 1);
      myReportsPage
        .getFirstReport("completed")
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          myReportsPage.verifyReportData({
            grantName: "Grant Mitchell",
            reportStatus: today(),
            reportPeriod: "August 2018"
          });
        });

      myReportsPage.unsubmitReport();
      myReportsPage.getReports("incomplete").should("have.length", 1);
    });
  });

  context("Helen is logged in", () => {
    beforeEach(() => {
      cy.seed("multiple-incomplete-reports.json");
      cy.login("helen@ip.org");
    });

    it("only sees her own report", () => {
      myReportsPage.getReports("incomplete").should("have.length", 1);
      myReportsPage
        .getFirstReport("incomplete")
        // eslint-disable-next-line no-unused-vars
        .within($report => {
          myReportsPage.verifyReportData({
            grantName: "Hugh Grant",
            reportStatus: "Incomplete",
            reportPeriod: "August 2018"
          });
        });
    });
  });

  context("Daisy is logged in", () => {
    const forbiddenPage = new ForbiddenPage();

    beforeEach(() => {
      cy.seed("one-incomplete-report.json");
      cy.login("daisy@hr.org", "chooselove");
    });

    it("is not able to see the My Reports page", () => {
      myReportsPage.visit();

      forbiddenPage.message.should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });

    it("is not able to see the Submit Report page", () => {
      cy.wait(250);
      new ReportPage(1).visit();

      forbiddenPage.message.should(
        "contains.text",
        "403 Sorry! You don’t have permission to access this page."
      );
    });
  });

  function today() {
    const now = new Date();
    const day = now
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}/${now.getFullYear()}`;
  }

  function randomText(length) {
    let text = "";
    const possible
      = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
});
