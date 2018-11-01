import React from "react";
import { shallow } from "enzyme";

import { ReviewReportComponent } from "./ReviewReportComponent";
import HeaderComponent from "../page-layout/HeaderComponent";
import type { Report } from "../report/models";
import ReportViewComponent from "../report/ReportViewComponent";
import type { Account } from "../authentication/models";

describe("ReviewReportComponent", () => {
  let wrapper;
  let mockLogout;
  let mockHistoryPush;
  let mockUpdateReport;

  const report1: $Shape<Report> = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: false,
    reportPeriod: "2018-09-01T00:00:00.000Z",
    submissionDate: "2018-10-03T00:00:00.000Z",
    keyActivity: {
      activityName: "Test activity",
      numberOfParticipants: "200",
      demographicInfo: "any value",
      impactOutcome: "impact"
    },
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: ""
  };
  const report2: $Shape<Report> = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps Overview\nGrant writes more than Hugh\nSeriously shut up",
    completed: false,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {},
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
    mockHistoryPush = jest.fn();
    mockLogout = jest.fn();
    mockUpdateReport = jest.fn();

    wrapper = shallow(
      <ReviewReportComponent
        logout={mockLogout}
        match={{ params: { id: "1" } }}
        classes={{}}
        reports={[report1, report2]}
        account={account}
        history={{ push: mockHistoryPush }}
        updateReport={mockUpdateReport}
        submittedReport={false}
        isLoading={false}
        savedReport={true}
      />
    );
  });

  it("renders a header component and passes the logout method and the account to it", () => {
    expect(wrapper.find(HeaderComponent).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(HeaderComponent).prop("account")).toBe(account);
  });

  it("renders the report view compoennt", () => {
    expect(wrapper.find(ReportViewComponent).prop("report")).toBe(report1);
  });

  it("renders the grant name", () => {
    expect(
      wrapper
        .find(`[data-test-id="report-grant-name"]`)
        .render()
        .text()
    ).toContain(report1.grant);
  });

  it("renders the report period", () => {
    expect(
      wrapper
        .find(`[data-test-id="report-period"]`)
        .render()
        .text()
    ).toContain("September 2018");
  });

  describe("edit", () => {
    it("rendirects to the report page when clicking edit", () => {
      wrapper.find(`[data-test-id="report-edit-button"]`).simulate("click");
      expect(mockHistoryPush).toHaveBeenCalledWith("/my-reports/1/edit");
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
      let completedReport1 = { ...report1, completed: true };
      wrapper.find('[data-test-id="report-submit-button"]').simulate("click");

      expect(mockUpdateReport).toHaveBeenCalledWith(completedReport1);
    });

    it("is disabled during loading", () => {
      wrapper.setProps({ isLoading: true });

      expect(
        wrapper.find('[data-test-id="report-submit-button"]').prop("disabled")
      ).toBe(true);
    });

    it("redirects to myReports page when report submitted successfully", () => {
      wrapper.setProps({ submittedReport: true });

      expect(mockHistoryPush).toHaveBeenCalledWith("/my-reports");
    });

    it("shows an error message when submitting a report fails", () => {
      wrapper.setProps({ savedReport: false });
      expect(
        wrapper
          .find('[data-test-id="error-message"]')
          .render()
          .text()
      ).toContain("Error submitting report");
    });
  });
});
