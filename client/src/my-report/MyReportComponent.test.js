import React from "react";
import Deferred from "promise-deferred";

import { type Report } from "./models";
import { type Account } from "../authentication/models";
import { MyReportComponent } from "./MyReportComponent";
import MyReportHeader from "./MyReportHeader";
import ReportViewComponent from "./ReportViewComponent";
import { MemoryRouter } from "react-router-dom";
import ButtonLink from "../page-layout/ButtonLink";
import { mountWithProvider } from "../setupTests";

describe("MyReportComponent", () => {
  let wrapper;
  let mockLogout;
  let mockLoadReport;
  let deferred;

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
        demographicInfo: [
          {
            number: 0,
            type: "",
            note: "any value"
          }
        ],
        impactOutcome: "impact"
      }
    ],
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: "",
    attachments: []
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

    wrapper = mountWithProvider(
      <MemoryRouter>
        <MyReportComponent
          logout={mockLogout}
          classes={{}}
          report={report}
          account={account}
          loadReport={mockLoadReport}
          match={{ params: { id: "1" } }}
          history={{}}
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

  it("requests report on mounting", () => {
    expect(mockLoadReport).toBeCalledWith(1);
  });
});
