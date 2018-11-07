import React from "react";
import { shallow } from "enzyme";
import Deferred from "promise-deferred";

import { SubmittedReportComponent } from "./SubmittedReportComponent";
import HeaderComponent from "../page-layout/HeaderComponent";
import type { Report } from "../my-report/models";
import ReportViewComponent from "../my-report/ReportViewComponent";
import type { Account } from "../authentication/models";
import { assertLater } from "../testHelpers";

describe("SubmittedReportComponent", () => {
  let wrapper;
  let mockLogout;
  let mockLoadReport;
  let deferred;
  let mockHistoryPush;

  const report: $Shape<Report> = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: true,
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
    mockLogout = jest.fn();
    mockLoadReport = jest.fn().mockReturnValue(deferred.promise);
    mockHistoryPush = jest.fn();

    wrapper = shallow(
      <SubmittedReportComponent
        logout={mockLogout}
        match={{ params: { id: "1" } }}
        report={report}
        account={account}
        loadReport={mockLoadReport}
        history={{ push: mockHistoryPush }}
      />
    );
  });

  it("requests report when mounting", () => {
    expect(mockLoadReport).toHaveBeenCalledWith(1);
  });

  it("redirects if report load fails", done => {
    deferred.resolve(false);

    assertLater(done, () => {
      expect(mockHistoryPush).toHaveBeenCalledWith("/notFound");
    });
  });

  it("shows a loading placeholder if report is undefined", () => {
    wrapper.setProps({ report: undefined });

    expect(wrapper.find(`[data-test-id="loading-placeholder"]`).exists()).toBe(
      true
    );
  });

  it("renders a header component and passes the logout method and the account to it", () => {
    expect(wrapper.find(HeaderComponent).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(HeaderComponent).prop("account")).toBe(account);
  });

  it("renders the report view component", () => {
    expect(wrapper.find(ReportViewComponent).prop("report")).toBe(report);
  });

  it("renders the grant name", () => {
    expect(
      wrapper
        .find(`[data-test-id="report-grant-name"]`)
        .render()
        .text()
    ).toContain("Hugh Grant");
  });

  it("renders the grant submission date", () => {
    expect(
      wrapper
        .find(`[data-test-id="report-submission-date"]`)
        .render()
        .text()
    ).toContain("03/10/2018");
  });
});
