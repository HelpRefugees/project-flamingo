import React from "react";
import { mount, shallow } from "enzyme";

import { MyReportsComponent } from "./MyReportsComponent";
import { MemoryRouter } from "react-router-dom";
import ReportListComponent from "./ReportListComponent";

import type { Report } from "../report/models";

describe("MyReportsComponent", () => {
  it("requests the reports on mount", () => {
    const mockLoadReports = jest.fn();

    mount(
      <MemoryRouter>
        <MyReportsComponent
          classes={{}}
          reports={[]}
          logout={() => {}}
          loadReports={mockLoadReports}
          updateReport={report => {}}
          account={undefined}
        />
      </MemoryRouter>
    );

    expect(mockLoadReports).toHaveBeenCalled();
  });

  describe("after reports have been requested", () => {
    let wrapper;

    const completedReport: Report = {
      id: 1,
      grant: "Hugh Grant",
      overview: "Hugh",
      completed: true,
      reportPeriod: "2018-10-01T00:00:00.000Z"
    };
    const incompleteReport: Report = {
      id: 2,
      grant: "Grant Shapps",
      overview: "Shapps",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z"
    };
    let reports: Report[] = [completedReport, incompleteReport];

    beforeEach(() => {
      wrapper = shallow(
        <MyReportsComponent
          classes={{}}
          reports={reports}
          logout={() => {}}
          loadReports={() => {}}
          updateReport={report => {}}
          account={undefined}
        />
      );
    });

    it("displays the incomplete reports", () => {
      expect(
        wrapper
          .find('[data-test-id="incomplete-reports"]')
          .find(ReportListComponent)
          .props().reports
      ).toEqual([incompleteReport]);
    });

    it("displays the complete reports", () => {
      expect(
        wrapper
          .find('[data-test-id="completed-reports"]')
          .find(ReportListComponent)
          .props().reports
      ).toEqual([completedReport]);
    });
  });

  describe("passing the updateReport prop", () => {
    let wrapper;
    const dummyUpdateReport = report => {};

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

    it("passes it to incomplete reports list", () => {
      expect(
        wrapper
          .find('[data-test-id="incomplete-reports"]')
          .find(ReportListComponent)
          .props().updateReport
      ).toBe(dummyUpdateReport);
    });

    it("passes it to complete reports list", () => {
      expect(
        wrapper
          .find('[data-test-id="completed-reports"]')
          .find(ReportListComponent)
          .props().updateReport
      ).toBe(dummyUpdateReport);
    });
  });
});
