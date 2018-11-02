import { mount, shallow } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Paper, Tabs } from "@material-ui/core";
import moment from "moment";
// $FlowIgnore: react-select types don't seem to work
import Select from "react-select";

import { ReportsListingComponent } from "./ReportsListingComponent";
import type { Report } from "../my-report/models";

describe("ReportsListingComponent", () => {
  let wrapper;

  describe("shows page tabs 'complete' and 'overdue'", () => {
    let mockHistoryPush;

    beforeEach(() => {
      mockHistoryPush = jest.fn();

      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={[]}
          loadReports={() => {}}
          history={{ push: mockHistoryPush }}
        />
      );
    });

    it("shows a tab for overdue reports", () => {
      expect(
        wrapper
          .find(Paper)
          .find('[data-test-id="overdue-reports-tab"]')
          .render()
          .text()
      ).toContain("Late reports");

      expect(
        wrapper
          .find(Paper)
          .find('[data-test-id="overdue-reports-tab"]')
          .render()
          .text()
      ).toContain("0");
      // ------------------------------------------------------------------
    });

    it("shows a tab for submitted reports", () => {
      expect(
        wrapper
          .find(Paper)
          .find('[data-test-id="submitted-reports-tab"]')
          .render()
          .text()
      ).toContain("Submitted reports");
    });
  });

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

  describe("no overdue reports", () => {
    const reports: Report[] = [
      {
        id: 1,
        completed: false,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-12-01T00:00:00.000Z",
        submissionDate: "",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-12-01T00:00:00.000Z",
        materialsForFundraising: ""
      },
      {
        id: 1,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-10-15T03:24:00.000Z",
        keyActivities: [{}],
        keyActivity: {},
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-10-31T00:00:00.000Z",
        materialsForFundraising: ""
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
          history={{}}
          router={{}}
        />
      );
    });

    it("shows no overdue reports message", () => {
      wrapper.find(Tabs).simulate("change", {}, 1);

      wrapper.update();

      expect(
        wrapper
          .find('[data-test-id="no-reports-message"]')
          .render()
          .text()
      ).toContain("No reports are late");
    });
  });

  describe("with one report", () => {
    const reports: Report[] = [
      {
        id: 1,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-09-15T03:24:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-09-15T03:24:00.000Z",
        materialsForFundraising: ""
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
    const reports: Report[] = [
      {
        id: 3,
        completed: true,
        overview: "Hugh Overview completed",
        grant: "Hugh Grant",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-10-15T03:24:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-10-20T03:24:00.000Z",
        materialsForFundraising: ""
      },
      {
        id: 1,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "2018-10-10T03:24:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-10-31T03:24:00.000Z",
        materialsForFundraising: ""
      },
      {
        id: 2,
        completed: true,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-09-01T00:00:00.000Z",
        submissionDate: "2018-09-15T03:24:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-9-30T03:24:00.000Z",
        materialsForFundraising: ""
      },
      {
        id: 4,
        completed: false,
        overview: "Mitchell Overview completed",
        grant: "Grant Mitchell",
        reportPeriod: "2018-10-01T00:00:00.000Z",
        submissionDate: "",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: "",
        dueDate: "2018-10-20T03:24:00.000Z",
        materialsForFundraising: ""
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

    describe("submitted reports tab", () => {
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

    describe("overdue reports tab", () => {
      beforeEach(() => {
        wrapper.find(Tabs).simulate("change", {}, 1);
        wrapper.update();
      });

      it("shows overdue reports", () => {
        expect(
          wrapper.find(
            '[data-test-id="overdue-reports"] [data-test-id="report"]'
          )
        ).toHaveLength(1);

        expect(
          wrapper
            .find('[data-test-id="overdue-reports"] [data-test-id="report"]')
            .first()
            .find('[data-test-id="report-due-date"]')
            .render()
            .text()
        ).toContain(
          moment(new Date()).diff(reports[3].dueDate, "days") + " days late"
        );
      });

      it("passes the unique grant name list sorted alphabetically to filter control", () => {
        expect(
          wrapper
            .find('[data-test-id="grant-name-filter"]')
            .children()
            .first()
            .props().options
        ).toEqual([{ value: "Grant Mitchell", label: "Grant Mitchell" }]);
      });

      it("reset the filter control after change tabs to late reports tab", () => {
        wrapper
          .find('[data-test-id="grant-name-filter"]')
          .children()
          .first()
          .simulate("change", {
            label: "Grant Mitchell",
            value: "Grant Mitchell"
          });
        wrapper.update();
        expect(
          wrapper
            .find('[data-test-id="grant-name-filter"]')
            .find(Select)
            .html()
        ).toContain("Grant Mitchell");

        wrapper.find(Tabs).simulate("change", {}, 0);

        wrapper.update();

        expect(
          wrapper
            .find('[data-test-id="grant-name-filter"]')
            .find(Select)
            .html()
        ).toContain("Filter grant name");
      });
    });
  });
});
