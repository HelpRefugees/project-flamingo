import React from "react";
import { mount } from "enzyme";

import type { Report } from "./models";
import type { Account } from "../authentication/models";
import { MyReportComponent } from "./MyReportComponent";
import MyReportHeader from "./MyReportHeader";
import ReportViewComponent from "./ReportViewComponent";
import { MemoryRouter } from "react-router-dom";
import ButtonLink from "../page-layout/ButtonLink";

describe("MyReportComponent", () => {
  let wrapper;
  let mockLogout;

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
    wrapper = mount(
      <MemoryRouter>
        <MyReportComponent
          logout={mockLogout}
          classes={{}}
          report={report}
          account={account}
        />
      </MemoryRouter>
    );
  });

  it("renders a header component and passes the logout method and the account to it", () => {
    expect(wrapper.find(MyReportHeader).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(MyReportHeader).prop("account")).toBe(account);
  });

  it("renders the report view component", () => {
    expect(wrapper.find(ReportViewComponent).prop("report")).toBe(report);
  });

  it("renders the back button", () => {
    const backButton = wrapper.find(ButtonLink);
    expect(backButton.prop("to")).toEqual("/my-reports");
  });
});
