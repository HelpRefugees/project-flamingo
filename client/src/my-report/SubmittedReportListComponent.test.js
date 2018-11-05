import React from "react";

import type { Report } from "./models";
import SubmittedReportListComponent from "./SubmittedReportListComponent";
import SubmittedReportListItemComponent from "./SubmittedReportListItemComponent";
import { MemoryRouter } from "react-router-dom";
import { mountWithProvider } from "../setupTests";

describe("SubmittedReportListComponent", () => {
  const submittedReport: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps",
    completed: true,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    submissionDate: "2018-10-02T00:00:00.000Z",
    keyActivities: [{}],
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: "",
    dueDate: "",
    materialsForFundraising: ""
  };

  let wrapper;
  const dummyUpdateReport = jest.fn();

  const withEnvironment = (environment) => mountWithProvider((
    <MemoryRouter>
      <SubmittedReportListComponent
        reports={[submittedReport]}
        updateReport={dummyUpdateReport}
      />
    </MemoryRouter>
  ), { environment });

  beforeEach(() => {
    wrapper = withEnvironment('development');
  });

  it("displays a report edit page for all complete reports", () => {
    expect(wrapper.find(SubmittedReportListItemComponent)).toHaveLength(1);
  });

  it("passes the updateReport prop to the report cards", () => {
    wrapper.find(SubmittedReportListItemComponent).forEach(card => {
      expect(card.props().updateReport).toBe(dummyUpdateReport);
    });
  });

  describe('environment is not development', () => {
    it('does not render an extra column for a undo button', () => {
      wrapper = withEnvironment('not-development');

      expect(wrapper.find('TableHead TableCell')).toHaveLength(3);
    });
  });

  describe('environment is development', () => {
    it('does render an extra column for a undo button', () => {
      expect(wrapper.find('TableHead TableCell')).toHaveLength(4);
    });
  });
});
