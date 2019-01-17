import React from "react";
import { shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import { MyReportsComponent } from "./MyReportsComponent";

import UnsubmittedReportListComponent from "./UnsubmittedReportListComponent";
import SubmittedReportListComponent from "./SubmittedReportListComponent";

import { type Report } from "./models";
import { mountWithProvider } from "../setupTests";

describe("MyReportsComponent", () => {
  it("requests the reports on mount", () => {
    const mockLoadReports = jest.fn();

    mountWithProvider(
      <MemoryRouter>
        <MyReportsComponent
          classes={{}}
          reports={[]}
          logout={() => {}}
          loadReports={mockLoadReports}
          updateReport={() => {}}
          account={undefined}
        />
      </MemoryRouter>
    );

    expect(mockLoadReports).toHaveBeenCalled();
  });

  describe("after reports have been requested", () => {
    let wrapper;

    const completedReport: $Shape<Report> = {
      id: 1,
      grant: "Hugh Grant",
      overview: "Hugh",
      completed: true,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: ""
    };
    const incompleteReport: $Shape<Report> = {
      id: 2,
      grant: "Grant Shapps",
      overview: "Shapps",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: ""
    };
    let reports: $Shape<Report>[] = [completedReport, incompleteReport];

    beforeEach(() => {
      wrapper = shallow(
        <MyReportsComponent
          classes={{}}
          reports={reports}
          logout={() => {}}
          loadReports={() => {}}
          updateReport={() => {}}
          account={undefined}
        />
      );
    });

    it("displays the incomplete reports", () => {
      expect(
        wrapper
          .find('[data-test-id="unsubmitted-reports"]')
          .find(UnsubmittedReportListComponent)
          .props().reports
      ).toEqual([incompleteReport]);
    });

    it("displays the complete reports", () => {
      expect(
        wrapper
          .find('[data-test-id="completed-reports"]')
          .find(SubmittedReportListComponent)
          .props().reports
      ).toEqual([completedReport]);
    });
  });

  describe("passing the updateReport prop", () => {
    let wrapper;
    const dummyUpdateReport = () => {};

    beforeEach(() => {
      wrapper = shallow(
        <MyReportsComponent
          classes={{}}
          reports={[]}
          logout={() => {}}
          loadReports={() => {}}
          updateReport={dummyUpdateReport}
          account={undefined}
        />
      );
    });

    it("passes it to complete reports list", () => {
      expect(
        wrapper
          .find('[data-test-id="completed-reports"]')
          .find(SubmittedReportListComponent)
          .props().updateReport
      ).toBe(dummyUpdateReport);
    });
  });
});
