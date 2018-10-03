import React from "react";
import { shallow } from "enzyme";

import ReportComponent from "./ReportComponent";

describe("ReportComponent", () => {
  let wrapper;
  const report = {
    grant: "Hello world"
  };

  beforeEach(() => {
    wrapper = shallow(<ReportComponent report={report} />);
  });

  it("shows the report", () => {
    expect(wrapper.find('[data-test-id="report"]')).toHaveLength(1);
  });

  it("shows the grant name", () => {
    expect(
      wrapper
        .find('[data-test-id="grant-name"]')
        .render()
        .text()
    ).toContain(report.grant);
  });

  it("shows the report status", () => {
    expect(
      wrapper
        .find('[data-test-id="report-status"]')
        .render()
        .text()
    ).toContain("Incomplete");
  });
});
