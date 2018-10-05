import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router-dom";

import { ReportCardComponent } from "./ReportCardComponent";

describe("ReportComponent", () => {
  let wrapper;
  const report = {
    grant: "Hello world"
  };

  beforeEach(() => {
    wrapper = shallow(<ReportCardComponent report={report} classes={{}} />);
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

  it("links to the report edit page", () => {
    expect(wrapper.find(Link).props().to).toBe("/reports/current");
  });
});
