import { mount, shallow } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ReportsListingComponent } from "./ReportsListingComponent";
import type { Report } from "../report/models";

describe("ReportsListingComponent", () => {
  let wrapper;

  it("requests the reports on mount", () => {
    const mockLoadReports = jest.fn();

    mount(
      <MemoryRouter>
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={[]}
          loadReports={mockLoadReports}
          history={{}}
        />
      </MemoryRouter>
    );

    expect(mockLoadReports).toHaveBeenCalled();
  });

  describe("with no completed reports", () => {
    beforeEach(() => {
      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={[]}
          loadReports={() => {}}
          history={{}}
        />
      );
    });

    it("displays a message saying there are no reports", () => {
      expect(
        wrapper
          .find('[data-test-id="no-reports-title"]')
          .render()
          .text()
      ).toContain("No submitted reports yet!");
      expect(
        wrapper
          .find('[data-test-id="no-reports-message"]')
          .render()
          .text()
      ).toContain("Once you’ve a completed report it will appear here.");
    });
  });

  describe("with one report", () => {
    const reports: $Shape<Report>[] = [
      {
        id: 1,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-09-15T03:24:00.000Z",
        keyActivity: {},
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
      }
    ];

    let mockHistoryPush;

    beforeEach(() => {
      mockHistoryPush = jest.fn();

      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={reports}
          loadReports={() => {}}
          history={{ push: mockHistoryPush }}
        />
      );
    });

    it("displays a list of completed reports", () => {
      expect(
        wrapper.find(
          '[data-test-id="submitted-reports"] [data-test-id="report"]'
        )
      ).toHaveLength(1);
      const firstReport = wrapper
        .find('[data-test-id="submitted-reports"] [data-test-id="report"]')
        .first();
      expect(
        firstReport
          .find('[data-test-id="report-grant"]')
          .render()
          .text()
      ).toContain(reports[0].grant);

      expect(
        firstReport
          .find('[data-test-id="report-period"]')
          .render()
          .text()
      ).toContain("October 2018");
      expect(
        firstReport
          .find('[data-test-id="report-submitted"]')
          .render()
          .text()
      ).toContain("15/09/2018");
    });

    it("redirects to the submitted report details when clicking on a report row", () => {
      wrapper
        .find('[data-test-id="submitted-reports"] [data-test-id="report"]')
        .first()
        .simulate("click");
      expect(mockHistoryPush).toHaveBeenCalledWith("/reports/1");
    });

    it("passes the grant name to the filter control", () => {
      expect(
        wrapper
          .find('[data-test-id="grant-name-filter"]')
          .children()
          .first()
          .props().options
      ).toEqual([{ value: "Grant Mitchell", label: "Grant Mitchell" }]);
    });
  });

  describe("with many reports from different grants", () => {
    const reports: $Shape<Report>[] = [
      {
        id: 3,
        completed: true,
        overview: "Hugh Overview completed",
        grant: "Hugh Grant",
        reportPeriod: "2018-11-01T00:00:00.000Z",
        submissionDate: "2018-10-15T03:24:00.000Z",
        keyActivity: {},
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
      },
      {
        id: 1,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-09-15T03:24:00.000Z",
        keyActivity: {},
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
      },
      {
        id: 2,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-11-01T00:00:00.000Z",
        submissionDate: "2018-10-15T03:24:00.000Z",
        keyActivity: {},
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
      }
    ];

    let mockHistoryPush;

    beforeEach(() => {
      mockHistoryPush = jest.fn();

      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={reports}
          loadReports={() => {}}
          history={{ push: mockHistoryPush }}
        />
      );
    });

    it("passes the unique grant name list sorted alphabetically to filter control", () => {
      expect(
        wrapper
          .find('[data-test-id="grant-name-filter"]')
          .children()
          .first()
          .props().options
      ).toEqual([
        { value: "Grant Mitchell", label: "Grant Mitchell" },
        { value: "Hugh Grant", label: "Hugh Grant" }
      ]);
    });

    it("shows only the filtered reports when selecting a grant name", () => {
      wrapper
        .find('[data-test-id="grant-name-filter"]')
        .children()
        .first()
        .simulate("change", {
          label: "Grant Mitchell",
          value: "Grant Mitchell"
        });

      expect(
        wrapper.find(
          '[data-test-id="submitted-reports"] [data-test-id="report"]'
        )
      ).toHaveLength(2);
    });
  });
});
