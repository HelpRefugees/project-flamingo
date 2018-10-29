import React from "react";
import { shallow } from "enzyme";

import ReportListComponent from "./ReportListComponent";
import ReportCardComponent from "./ReportCardComponent";
import { Link } from "react-router-dom";
import type { Report } from "../report/models";

describe("ReportListComponent", () => {
  const reports: $Shape<Report>[] = [
    {
      id: 1,
      grant: "Hugh Grant",
      overview: "Hugh",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: ""
    },
    {
      id: 2,
      grant: "Grant Shapps",
      overview: "Shapps",
      completed: true,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: ""
    },
    {
      id: 3,
      grant: "Grant Mitchell",
      overview: "Mitchell",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: ""
    }
  ];
  let wrapper;
  const dummyUpdateReport = report => {};

  beforeEach(() => {
    wrapper = shallow(
      <ReportListComponent reports={reports} updateReport={dummyUpdateReport} />
    );
  });

  it("displays the provided reports", () => {
    expect(wrapper.find(ReportCardComponent)).toHaveLength(3);
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
