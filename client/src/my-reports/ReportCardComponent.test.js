import React from "react";
import { shallow } from "enzyme";

import { ReportCardComponent } from "./ReportCardComponent";
import type { Report } from "../report/models";

describe("ReportCardComponent", () => {
  let wrapper;
  const report: Report = {
    grant: "Hello world",
    overview: "Hi!",
    completed: false,
    id: 1,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {},
    operatingEnvironment: ""
  };

  beforeEach(() => {
    wrapper = shallow(
      <ReportCardComponent
        report={report}
        updateReport={() => {}}
        classes={{}}
      />
    );
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
        .find('[data-test-id="grant-name"]')
        .render()
        .text()
    ).toContain(report.grant);
  });

  describe("incomplete report", () => {
    const incompleteReport: Report = {
      grant: "Hello world",
      overview: "Hi!",
      completed: false,
      id: 1,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: ""
    };

    beforeEach(() => {
      wrapper = shallow(
        <ReportCardComponent
          report={incompleteReport}
          updateReport={() => {}}
          classes={{}}
        />
      );
    });

    it("shows the report status as incomplete", () => {
      expect(
        wrapper
          .find('[data-test-id="report-status"]')
          .render()
          .text()
      ).toContain("Incomplete");
    });
  });

  describe("completed report", () => {
    const completedReport: Report = {
      grant: "Hello world",
      overview: "Hi!",
      completed: true,
      submissionDate: "2018-09-15T03:24:00.000Z",
      id: 1,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: ""
    };

    let mockUpdateReport;

    beforeEach(() => {
      mockUpdateReport = jest.fn();

      wrapper = shallow(
        <ReportCardComponent
          report={completedReport}
          updateReport={mockUpdateReport}
          classes={{}}
        />
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

    it("undoes the submission when clicking undo", () => {
      const unsubmittedReport: Report = {
        grant: "Hello world",
        overview: "Hi!",
        completed: false,
        submissionDate: undefined,
        id: 1,
        reportPeriod: "2018-10-01T00:00:00.000Z",
        keyActivity: {},
        operatingEnvironment: ""
      };

      wrapper.find('[data-test-id="report-unsubmit-button"]').simulate("click");
      expect(mockUpdateReport).toHaveBeenCalledWith(unsubmittedReport);
    });
  });
});
