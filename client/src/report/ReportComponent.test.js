import React from "react";
import { shallow } from "enzyme";

import { ReportComponent } from "./ReportComponent";
import HeaderComponent from "../home/HeaderComponent";
import type { Report } from "./models";

describe("ReportComponent", () => {
  let wrapper;
  let mockSaveReport;
  let mockLogout;
  const report1: Report = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh",
    completed: false
  };
  const report2: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps",
    completed: false
  };
  let reports: Report[] = [report1, report2];

  beforeEach(() => {
    mockSaveReport = jest.fn();
    mockLogout = jest.fn();

    wrapper = shallow(
      <ReportComponent
        saveReport={mockSaveReport}
        logout={mockLogout}
        reports={reports}
        match={{ params: { id: "1" } }}
        classes={{}}
      />
    );
  });

  it("renders a header component and passes the logout method to it", () => {
    wrapper.find(<HeaderComponent logout={mockLogout} />);
  });

  it("disables the save button when the overview is unchanged", () => {
    expect(
      wrapper.find('[data-test-id="report-save-button"]').prop("disabled")
    ).toBe(true);
  });

  it("enables the save button when the overview is changed", () => {
    wrapper
      .find('[data-test-id="report-progress-input"]')
      .simulate("change", { target: { value: "Hello there" } });

    expect(
      wrapper.find('[data-test-id="report-save-button"]').prop("disabled")
    ).toBe(false);
  });

  it("updates the displayed text when the overview is changed", () => {
    const newOverview = "is this thing on?";
    wrapper
      .find('[data-test-id="report-progress-input"]')
      .simulate("change", { target: { value: newOverview } });

    expect(
      wrapper.find('[data-test-id="report-progress-input"]').prop("value")
    ).toBe(newOverview);
  });

  it("calls save report action when clicking the save button", () => {
    const overview = "text for report progress";
    const updatedReport1 = {
      id: 1,
      grant: "Hugh Grant",
      overview,
      completed: false
    };

    wrapper
      .find('[data-test-id="report-progress-input"]')
      .simulate("change", { target: { value: overview } });

    wrapper.find('[data-test-id="report-save-button"]').simulate("click");

    expect(mockSaveReport).toHaveBeenCalledWith(updatedReport1);
  });
});
