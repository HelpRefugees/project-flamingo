import React from "react";
import { MyReportHeader } from "./MyReportHeader";
import type { Report } from "./models";
import { shallow } from "enzyme";

describe("MyReportHeader", () => {
  const report: $Shape<Report> = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: false,
    reportPeriod: "2018-09-01T00:00:00.000Z",
    submissionDate: undefined,
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

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MyReportHeader
        classes={{}}
        report={report}
        account={{ name: "", username: "", role: "" }}
        children={{}}
        logout={() => {}}
      />
    );
  });

  it("renders the grant name", () => {
    expect(
      wrapper
        .find(`[data-test-id="report-grant-name"]`)
        .render()
        .text()
    ).toContain(report.grant);
  });

  it("renders the report period when the report is not submitted", () => {
    expect(
      wrapper
        .find(`[data-test-id="report-period"]`)
        .render()
        .text()
    ).toContain("September 2018");
  });

  it("renders the grant submission date when the report is submitted", () => {
    const submittedReport = {
      ...report,
      submissionDate: "2018-10-03T00:00:00.000Z"
    };

    wrapper.setProps({ report: submittedReport });

    expect(
      wrapper
        .find(`[data-test-id="report-submission-date"]`)
        .render()
        .text()
    ).toContain("03/10/2018");
  });
});
