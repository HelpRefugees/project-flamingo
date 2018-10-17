import React from "react";
import { mount, shallow } from "enzyme";

import { ReportsListingComponent } from "./ReportsListingComponent";
import { MemoryRouter } from "react-router-dom";

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
        />
      </MemoryRouter>
    );

    expect(mockLoadReports).toHaveBeenCalled();
  });

  describe("with no completed reports", () => {
    beforeEach(() => {
      const reports = [
        {
          id: 2,
          completed: false,
          overview: "John Overview",
          grant: "John Grace",
          reportPeriod: "2018-09-01T00:00:00.000Z"
        }
      ];

      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={reports}
          loadReports={() => {}}
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

  describe("with reports", () => {
    const reports = [
      {
        id: 1,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-09-15T03:24:00.000Z"
      },
      {
        id: 2,
        completed: false,
        overview: "John Overview",
        grant: "John Grace",
        reportPeriod: "2018-09-01T00:00:00.000Z"
      }
    ];

    beforeEach(() => {
      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={reports}
          loadReports={() => {}}
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
  });
});
