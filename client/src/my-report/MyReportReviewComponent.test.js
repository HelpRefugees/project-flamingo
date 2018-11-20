import React from "react";
import { shallow } from "enzyme";
import Deferred from "promise-deferred";

import { MyReportReviewComponent } from "./MyReportReviewComponent";
import MyReportHeader from "./MyReportHeader";
import type { Report } from "./models";
import ReportViewComponent from "./ReportViewComponent";
import type { Account } from "../authentication/models";
import { assertLater } from "../testHelpers";

describe("MyReportReviewComponent", () => {
  let wrapper;
  let mockLogout;
  let mockHistoryPush;
  let mockUpdateReport;
  let mockLoadReport;
  let deferred;

  const report: $Shape<Report> = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: false,
    reportPeriod: "2018-09-01T00:00:00.000Z",
    submissionDate: "2018-10-03T00:00:00.000Z",
    keyActivities: [
      {
        activityName: "Test activity",
        numberOfParticipants: "200",
        demographicInfo: "any value",
        impactOutcome: "impact"
      }
    ],
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: ""
  };

  const account: Account = {
    username: "steve@ip.org",
    name: "Steve Jones",
    role: "help-refugees"
  };

  beforeEach(() => {
    deferred = new Deferred();
    mockHistoryPush = jest.fn();
    mockLogout = jest.fn();
    mockUpdateReport = jest.fn().mockImplementation(() => Promise.resolve());
    mockLoadReport = jest.fn().mockReturnValue(deferred.promise);

    wrapper = shallow(
      <MyReportReviewComponent
        logout={mockLogout}
        match={{ params: { id: "1" } }}
        classes={{}}
        report={report}
        account={account}
        history={{ push: mockHistoryPush }}
        updateReport={mockUpdateReport}
        isLoading={false}
        loadReport={mockLoadReport}
      />
    );
  });

  it("requests report when mounting", () => {
    expect(mockLoadReport).toHaveBeenCalledWith(1);
  });

  it("redirects if report load fails", done => {
    deferred.resolve(false);

    assertLater(done, () => {
      expect(mockHistoryPush).toHaveBeenCalledWith("/not-found");
    });
  });

  it("shows a loading placeholder if report is undefined", () => {
    wrapper.setProps({ report: undefined });

    expect(wrapper.find(`[data-test-id="loading-placeholder"]`).exists()).toBe(
      true
    );
  });

  it("renders a header component and passes the logout method and the account to it", () => {
    expect(wrapper.find(MyReportHeader).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(MyReportHeader).prop("account")).toBe(account);
  });

  it("renders the report view compoennt", () => {
    expect(wrapper.find(ReportViewComponent).prop("report")).toBe(report);
  });

  describe("edit", () => {
    it("redirects to the report page when clicking edit", () => {
      const editButton = wrapper.find(`[data-test-id="report-edit-button"]`);
      expect(editButton.prop("to")).toEqual("/my-reports/1/edit");
    });

    it("is disabled during loading", () => {
      wrapper.setProps({ isLoading: true });

      expect(
        wrapper.find('[data-test-id="report-edit-button"]').prop("disabled")
      ).toBe(true);
    });
  });

  describe("submit", () => {
    it("calls update report action with the correct arguments on click", () => {
      let completedReport = { ...report, completed: true };
      wrapper.find('[data-test-id="report-submit-button"]').simulate("click");

      expect(mockUpdateReport).toHaveBeenCalledWith(
        completedReport,
        "Error submitting report"
      );
    });

    it("is disabled during loading", () => {
      wrapper.setProps({ isLoading: true });

      expect(
        wrapper.find('[data-test-id="report-submit-button"]').prop("disabled")
      ).toBe(true);
    });

    it("redirects to myReports page when report submitted successfully", done => {
      wrapper.find('[data-test-id="report-submit-button"]').simulate("click");

      assertLater(done, () => {
        expect(mockHistoryPush).toHaveBeenCalledWith("/my-reports");
      });
    });
  });
});
