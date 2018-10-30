import React from "react";
import { shallow } from "enzyme";

import { SubmittedReportComponent } from "./SubmittedReportComponent";
import HeaderComponent from "../page-layout/HeaderComponent";
import type { Report } from "../report/models";
import ReportViewComponent from "../report/ReportViewComponent";
import type { Account } from "../authentication/models";

describe("SubmittedReportComponent", () => {
  let wrapper;
  let mockLogout;

  const report1: $Shape<Report> = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: true,
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
    completed: true,
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
    wrapper = shallow(
      <SubmittedReportComponent
        logout={mockLogout}
        match={{ params: { id: "1" } }}
        classes={{}}
        reports={[report1, report2]}
        account={account}
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
        .find(`[data-test-id="grant-name"]`)
        .render()
        .text()
    ).toContain("Hugh Grant");
  });

  it("renders the grant submission date", () => {
    expect(
      wrapper
        .find(`[data-test-id="submission-date"]`)
        .render()
        .text()
    ).toContain("03/10/2018");
  });
});
