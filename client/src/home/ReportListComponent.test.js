import React from "react";
import { shallow } from "enzyme";

import ReportListComponent from "./ReportListComponent";
import ReportCardComponent from "./ReportCardComponent";
import type { Report } from "../report/models";

describe("ReportListComponent", () => {
  it("displays the provided reports", () => {
    const reports: Report[] = [
      { id: 1, grant: "Hugh Grant", overview: "Hugh", completed: false },
      { id: 2, grant: "Grant Shapps", overview: "Shapps", completed: false },
      { id: 3, grant: "Grant Mitchell", overview: "Mitchell", completed: false }
    ];

    const wrapper = shallow(<ReportListComponent reports={reports} />);

    expect(wrapper.find(ReportCardComponent)).toHaveLength(3);
  });
});
