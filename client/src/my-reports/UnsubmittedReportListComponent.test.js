import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router-dom";

import type { Report } from "../report/models";
import UnsubmittedReportListComponent from "./UnsubmittedReportListComponent";
import ReportCardComponent from "./ReportCardComponent";

describe("UnsubmittedReportListComponent", () => {
  const unsubmittedReports: Report[] = [
    {
      id: 1,
      grant: "Hugh Grant",
      overview: "Hugh",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: "",
      dueDate: "",
      materialsForFundraising: ""
    },
    {
      id: 3,
      grant: "Grant Mitchell",
      overview: "Mitchell",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: "",
      dueDate: "",
      materialsForFundraising: ""
    }
  ];

  let wrapper;

  const dummyUpdateReport = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <UnsubmittedReportListComponent
        reports={unsubmittedReports}
        updateReport={dummyUpdateReport}
      />
    );
  });

  it("displays a link to the report edit page for all incomplete reports", () => {
    expect(wrapper.find(Link)).toHaveLength(2);
  });

  it("passes the updateReport prop to the report cards", () => {
    wrapper.find(ReportCardComponent).forEach(card => {
      expect(card.props().updateReport).toBe(dummyUpdateReport);
    });
  });
});
