import React from "react";
import MockDate from "mockdate";
import { shallow } from "enzyme";

import { ReportCardComponent } from "./ReportCardComponent";
import type { Report } from "./models";

describe("ReportCardComponent", () => {
  const report: Report = {
    grant: "Hello world",
    overview: "Hi!",
    completed: false,
    id: 1,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    dueDate: "2018-11-07T00:00:00.000Z",
    keyActivities: [{}],
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: "",
    materialsForFundraising: ""
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ReportCardComponent report={report} classes={{}} />);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("shows the report", () => {
    expect(wrapper.find('[data-test-id="report"]')).toHaveLength(1);
  });

  it("shows the report period", () => {
    expect(
      wrapper
        .find('[data-test-id="report-period"]')
        .render()
        .text()
    ).toContain("October 2018");
  });

  it("shows the grant name", () => {
    expect(
      wrapper
        .find('[data-test-id="report-grant-name"]')
        .render()
        .text()
    ).toContain(report.grant);
  });

  describe("incomplete report", () => {
    beforeEach(() => {
      MockDate.set(new Date(2018, 9, 15));
      wrapper = shallow(<ReportCardComponent report={report} classes={{}} />);
    });

    it("shows the due date as the report status", () => {
      expect(
        wrapper
          .find('[data-test-id="report-status"]')
          .render()
          .text()
      ).toContain("07/11/2018");
    });
  });

  describe("due report", () => {
    beforeEach(() => {
      MockDate.set(new Date(2018, 10, 3));
      wrapper = shallow(<ReportCardComponent report={report} classes={{}} />);
    });

    it("shows the remaining time as the status", () => {
      expect(
        wrapper
          .find('[data-test-id="report-status"]')
          .render()
          .text()
      ).toContain("Due in 4 days");
    });
  });

  describe("late report", () => {
    beforeEach(() => {
      MockDate.set(new Date(2018, 10, 10));
      wrapper = shallow(<ReportCardComponent report={report} classes={{}} />);
    });

    it("shows the overdue time as the status", () => {
      expect(
        wrapper
          .find('[data-test-id="report-status"]')
          .render()
          .text()
      ).toContain("3 days late");
    });
  });

  describe("completed report", () => {
    const submittedReport: Report = {
      ...report,
      completed: true,
      id: 1,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      dueDate: "2018-11-07T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: "",
      materialsForFundraising: "",
      submissionDate: "2018-09-15T03:24:00.000Z"
    };

    beforeEach(() => {
      wrapper = shallow(
        <ReportCardComponent report={submittedReport} classes={{}} />
      );
    });

    it("shows the completion date", () => {
      expect(
        wrapper
          .find('[data-test-id="report-status"]')
          .render()
          .text()
      ).toContain("15/09/2018");
    });
  });
});
