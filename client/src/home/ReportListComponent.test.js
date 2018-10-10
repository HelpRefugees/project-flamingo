import React from "react";
import { shallow } from "enzyme";

import ReportListComponent from "./ReportListComponent";
import ReportCardComponent from "./ReportCardComponent";
import type { Report } from "./models";

describe("ReportListComponent", () => {
  it("displays the provided reports", () => {
    const reports: Report[] = [
      { grant: "Hugh Grant" },
      { grant: "Grant Shapps" },
      { grant: "Grant Mitchell" }
    ];

    const wrapper = shallow(<ReportListComponent reports={reports} />);

    expect(wrapper.find(ReportCardComponent)).toHaveLength(3);
  });
});
