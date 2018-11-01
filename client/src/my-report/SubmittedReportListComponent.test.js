import React from "react";
import { mount } from "enzyme";

import type { Report } from "./models";
import SubmittedReportListComponent from "./SubmittedReportListComponent";
import SubmittedReportListItemComponent from "./SubmittedReportListItemComponent";
import { MemoryRouter } from "react-router-dom";

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

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <SubmittedReportListComponent
          reports={[submittedReport]}
          updateReport={dummyUpdateReport}
        />
      </MemoryRouter>
    );
  });

  it("displays a report edit page for all complete reports", () => {
    expect(wrapper.find(SubmittedReportListItemComponent)).toHaveLength(1);
  });

  it("passes the updateReport prop to the report cards", () => {
    wrapper.find(SubmittedReportListItemComponent).forEach(card => {
      expect(card.props().updateReport).toBe(dummyUpdateReport);
    });
  });
});
