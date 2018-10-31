import MyReportsPage from "../pages/myReportsPage";
import ReviewReportPage from "../pages/reviewReportPage";
import ReportPage, { ReportSection } from "../pages/reportPage";
import ForbiddenPage from "../pages/forbiddenPage";
import MyReportPage from "../pages/myReportPage";

context("My Reports Page", () => {
  const myReportsPage = new MyReportsPage();

  const newReport = {
    overview: randomAlphaText(16),
    operatingEnvironment: randomAlphaText(16),
    keyActivity: {
      activityName: randomAlphaText(16),
      numberOfParticipants: randomNumericText(16),
      demographicInfo: randomAlphaText(16),
      impactOutcome: randomAlphaText(16)
    },
    beneficiaryFeedback: randomAlphaText(16),
    challengesFaced: randomAlphaText(16),
    incidents: randomAlphaText(16),
    otherIssues: randomAlphaText(16),
    materialsForFundraising: randomAlphaText(16)
  };

  context("Ellen is logged in", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 7, 15).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows an appropriate title", () => {
      myReportsPage.pageTitle.should("contains.text", "Monthly Report");
    });

    it("shows her name 'Ellen Smith'", () => {
      myReportsPage.userName.should("contains.text", "Ellen Smith");
    });

    it("shows an unsubmitted report", () => {
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "07/09/2018",
          reportPeriod: "August 2018"
        });
      });
    });

    it("opens and saves an editable report", () => {
      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      let reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.grantName.should("contain.text", "Grant Mitchell");

      const completeAndSaveSection = ({ key, title, selector, value }) => {
        reportPage.getSection(key, reportSection => {
          reportSection.title.should("contain.text", title);
          reportSection.saveButton.should("attr", "disabled");
          reportSection.setContentField(selector, value);
          reportSection.saveButton.should("not.have.attr", "disabled");
          reportSection.saveButton.click();
        });
      };

      completeAndSaveSection({
        key: "grant-progress",
        title: "Grant progress",
        selector: ReportSection.sections.grantProgress.progress,
        value: newReport.overview
      });

      completeAndSaveSection({
        key: "operating-environment",
        title: "Operating environment",
        selector: ReportSection.sections.operatingEnvironment.progress,
        value: newReport.operatingEnvironment
      });

      reportPage.getSection("key-activities", keyActivitiesSection => {
        keyActivitiesSection.title.should("contain.text", "Key Activities");
        keyActivitiesSection.saveButton.should("attr", "disabled");
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.name,
          newReport.keyActivity.activityName
        );
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.numberOfParticipants,
          newReport.keyActivity.numberOfParticipants
        );
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.demographicInfo,
          newReport.keyActivity.demographicInfo
        );
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.impactOutcome,
          newReport.keyActivity.impactOutcome
        );
        keyActivitiesSection.saveButton.should("not.have.attr", "disabled");
        keyActivitiesSection.saveButton.click();
      });

      completeAndSaveSection({
        key: "beneficiary-feedback",
        title: "Beneficiary Feedback",
        selector: ReportSection.sections.beneficiaryFeedback.feedback,
        value: newReport.beneficiaryFeedback
      });

      completeAndSaveSection({
        key: "challenges-faced",
        title: "Challenges faced",
        selector: ReportSection.sections.challengesFaced.challenges,
        value: newReport.challengesFaced
      });

      completeAndSaveSection({
        key: "incidents",
        title: "Incidents and near misses",
        selector: ReportSection.sections.incidents.incidents,
        value: newReport.incidents
      });

      completeAndSaveSection({
        key: "other-issues",
        title:
          "Is there anything you would like to use our platform to speak about?",
        selector: ReportSection.sections.otherIssues.issues,
        value: newReport.otherIssues
      });

      completeAndSaveSection({
        key: "materials-for-fundraising",
        title: "Materials for fundraising",
        selector: ReportSection.sections.materialsForFundraising.materials,
        value: newReport.materialsForFundraising
      });

      myReportsPage.goToHomePage();
      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.grantName.should("contain.text", "Grant Mitchell");

      const assertReportSectionInputValue = ({ name, selector, value }) => {
        reportPage.getSection(name, section => {
          section.getContentField(selector).should("contain.text", value);
        });
      };

      assertReportSectionInputValue({
        name: "grant-progress",
        selector: ReportSection.sections.grantProgress.progress,
        value: newReport.overview
      });

      assertReportSectionInputValue({
        name: "operating-environment",
        selector: ReportSection.sections.operatingEnvironment.progress,
        value: newReport.operatingEnvironment
      });

      reportPage.getSection("key-activities", keyActivitiesSection => {
        keyActivitiesSection
          .getContentField(ReportSection.sections.keyActivities.name)
          .should("contain.value", newReport.keyActivity.activityName);
        keyActivitiesSection
          .getContentField(
            ReportSection.sections.keyActivities.numberOfParticipants
          )
          .should("contain.value", newReport.keyActivity.numberOfParticipants);
        keyActivitiesSection
          .getContentField(ReportSection.sections.keyActivities.demographicInfo)
          .should("contain.text", newReport.keyActivity.demographicInfo);
        keyActivitiesSection
          .getContentField(ReportSection.sections.keyActivities.impactOutcome)
          .should("contain.text", newReport.keyActivity.impactOutcome);
        keyActivitiesSection.saveButton.should("have.attr", "disabled");
      });

      assertReportSectionInputValue({
        name: "beneficiary-feedback",
        selector: ReportSection.sections.beneficiaryFeedback.feedback,
        value: newReport.beneficiaryFeedback
      });

      assertReportSectionInputValue({
        name: "challenges-faced",
        selector: ReportSection.sections.challengesFaced.challenges,
        value: newReport.challengesFaced
      });

      assertReportSectionInputValue({
        name: "incidents",
        selector: ReportSection.sections.incidents.incidents,
        value: newReport.incidents
      });

      assertReportSectionInputValue({
        name: "other-issues",
        selector: ReportSection.sections.otherIssues.issues,
        value: newReport.otherIssues
      });

      assertReportSectionInputValue({
        name: "materials-for-fundraising",
        selector: ReportSection.sections.materialsForFundraising.materials,
        value: newReport.materialsForFundraising
      });
    });

    it("sees an error message if the save request fails", () => {
      cy.server({
        method: "PUT",
        status: 500,
        response: {}
      });

      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      const reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.reviewAndSubmitButton.click();

      const reviewReportPage = new ReviewReportPage(1);
      reviewReportPage.isAt();
    });

    it('can review a submitted report', () => {
      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      const reportPage = new ReportPage(1);
      reportPage.isAt();
      reportPage.reviewAndSubmitButton.click();

      const reviewReportPage = new ReviewReportPage(1);
      reviewReportPage.isAt();
      reviewReportPage.verifyReportData({
        grantName: "Grant Mitchell",
        reportPeriod: "August 2018"
      });
    });

    it("submits a report", () => {
      myReportsPage.getFirstUnsubmittedReport(report => report.click());

      const reportPage = new ReportPage(1);
      reportPage.isAt();

      reportPage.getSection("operating-environment", grantProgessSection => {
        grantProgessSection.setContentField(
          ReportSection.sections.operatingEnvironment.progress,
          newReport.operatingEnvironment
        );
      });

      reportPage.getSection("key-activities", keyActivitiesSection => {
        keyActivitiesSection.title.should("contain.text", "Key Activities");
        keyActivitiesSection.saveButton.should("attr", "disabled");
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.name,
          newReport.keyActivity.activityName
        );
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.numberOfParticipants,
          newReport.keyActivity.numberOfParticipants
        );
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.demographicInfo,
          newReport.keyActivity.demographicInfo
        );
        keyActivitiesSection.setContentField(
          ReportSection.sections.keyActivities.impactOutcome,
          newReport.keyActivity.impactOutcome
        );
        keyActivitiesSection.saveButton.should("not.have.attr", "disabled");
        keyActivitiesSection.saveButton.click();
      });

      reportPage.getSection("beneficiary-feedback", grantProgessSection => {
        grantProgessSection.setContentField(
          ReportSection.sections.beneficiaryFeedback.feedback,
          newReport.beneficiaryFeedback
        );
      });

      reportPage.getSection("challenges-faced", grantProgessSection => {
        grantProgessSection.setContentField(
          ReportSection.sections.challengesFaced.challenges,
          newReport.challengesFaced
        );
      });

      reportPage.getSection("incidents", grantProgessSection => {
        grantProgessSection.setContentField(
          ReportSection.sections.incidents.incidents,
          newReport.incidents
        );
      });

      reportPage.getSection("other-issues", grantProgessSection => {
        grantProgessSection.setContentField(
          ReportSection.sections.otherIssues.issues,
          newReport.otherIssues
        );
      });

      reportPage.getSection("materials-for-fundraising", grantProgessSection => {
        grantProgessSection.setContentField(
          ReportSection.sections.materialsForFundraising.materials,
          newReport.materialsForFundraising
        );
      });

      reportPage.reviewAndSubmitButton.should("not.have.attr", "disabled");
      reportPage.reviewAndSubmitButton.click();

      reportPage.submitButton.should("not.have.attr", "disabled");
      reportPage.submitButton.click();

      myReportsPage.isAt();
      myReportsPage.getReports("submitted").should("have.length", 1);
      myReportsPage.getFirstSubmittedReport(report => {
        report.verifyReportData({
          grantName: "Grant Mitchell",
          reportSubmitted: today(),
          reportPeriod: "August 2018"
        });
        report.click();
      });

      const myReportPage = new MyReportPage(1);
      myReportPage.isAt();
      myReportPage.verifyReportData({
        grantName: "Grant Mitchell",
        submissionDate: today()
      });

      const sectionContainsContent = ({
        sectionKey,
        sectionTitle,
        contentKey,
        content
      }) => {
        myReportPage.getSection(sectionKey, section => {
          section.title.should("contain.text", sectionTitle);
          section.contentFor(contentKey).should("contain.text", content);
        });
      };

      sectionContainsContent({
        sectionKey: "grant-progress",
        sectionTitle: "Grant overview",
        contentKey: "report-progress",
        content: "Mitchell Overview"
      });

      myReportPage.getSection(
        "grant-key-activities",
        grantProgressSection => {
          grantProgressSection.title.should(
            "contain.text",
            "Key activities & impact"
          );
          grantProgressSection
            .contentFor("report-key-activity-name")
            .should("contain.text", newReport.keyActivity.activityName);
          grantProgressSection
            .contentFor("report-number-of-participants")
            .should("contain.text", newReport.keyActivity.numberOfParticipants);
          grantProgressSection
            .contentFor("report-demographic-info")
            .should("contain.text", newReport.keyActivity.demographicInfo);
          grantProgressSection
            .contentFor("report-impact-outcome")
            .should("contain.text", newReport.keyActivity.impactOutcome);
        }
      );

      sectionContainsContent({
        sectionKey: "operating-environment",
        sectionTitle: "Operating environment",
        contentKey: "report-operating-environment",
        content: newReport.operatingEnvironment
      });

      sectionContainsContent({
        sectionKey: "beneficiary-feedback",
        sectionTitle: "Beneficiary feedback",
        contentKey: "report-beneficiary-feedback",
        content: newReport.beneficiaryFeedback
      });

      sectionContainsContent({
        sectionKey: "challenges-faced",
        sectionTitle: "Challenges faced and lessons learned",
        contentKey: "report-challenges-faced",
        content: newReport.challengesFaced
      });

      sectionContainsContent({
        sectionKey: "incidents",
        sectionTitle: "Incidents and near misses",
        contentKey: "report-incidents",
        content: newReport.incidents
      });

      sectionContainsContent({
        sectionKey: "other-issues",
        sectionTitle:
          "Is there anything you would like to use our platform to speak about?",
        contentKey: "report-other-issues",
        content: newReport.otherIssues
      });

      sectionContainsContent({
        sectionKey: "materials-for-fundraising",
        sectionTitle: "Materials for fundraising",
        contentKey: "report-materials-for-fundraising",
        content: newReport.materialsForFundraising
      });

      myReportPage.back();

      myReportsPage.getFirstSubmittedReport(report => report.unsubmit());
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
    });
  });

  context("Ellen's report is due", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 8, 2).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows when the report is due ", () => {
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "Due in 5 days",
          reportPeriod: "August 2018"
        });
      });
    });
  });

  context("Ellen's report is late", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 8, 15).getTime());
      cy.seed("one-incomplete-report.json");
      cy.login("ellen@ip.org");
    });

    it("shows how late the report is ", () => {
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
          grantName: "Grant Mitchell",
          reportStatus: "8 days late",
          reportPeriod: "August 2018"
        });
      });
    });
  });

  context("Helen is logged in", () => {
    beforeEach(() => {
      cy.clock(new Date(2018, 7, 15).getTime());
      cy.seed("multiple-incomplete-reports.json");
      cy.login("helen@ip.org");
    });

    it("only sees her own report", () => {
      myReportsPage.getReports("unsubmitted").should("have.length", 1);
      myReportsPage.getFirstUnsubmittedReport(report => {
        report.verifyReportData({
          grantName: "Hugh Grant",
          reportStatus: "07/09/2018",
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

  function randomText(length, source) {
    let text = "";
    for (let i = 0; i < length; i++) {
      text += source.charAt(Math.floor(Math.random() * source.length));
    }
    return text;
  }

  function randomAlphaText(length) {
    return randomText(
      length,
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    );
  }

  function randomNumericText(length) {
    return randomText(length, "0123456789");
  }
});
