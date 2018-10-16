import React from "react";
import { shallow } from "enzyme";

import { ReportComponent } from "./ReportComponent";
import HeaderComponent from "../page-layout/HeaderComponent";
import type { Report } from "./models";
import type { Account } from "../authentication/models";

describe("ReportComponent", () => {
  let wrapper;
  let mockUpdateReport;
  let mockLogout;
  let mockHistoryPush;
  const report1: Report = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh",
    completed: false,
    reportPeriod: "2018-10-01T00:00:00.000Z"
  };
  const report2: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps",
    completed: false,
    reportPeriod: "2018-10-01T00:00:00.000Z"
  };
  let reports: Report[] = [report1, report2];
  const account: Account = {
    username: "Steve@ip.org",
    name: "Also Steve",
    role: "implementing-partner"
  };

  beforeEach(() => {
    mockUpdateReport = jest.fn();
    mockLogout = jest.fn();
    mockHistoryPush = jest.fn();

    wrapper = shallow(
      <ReportComponent
        updateReport={mockUpdateReport}
        logout={mockLogout}
        reports={reports}
        match={{ params: { id: "1" } }}
        classes={{}}
        history={{ push: mockHistoryPush }}
        account={account}
      />
    );
  });

  it("renders a header component and passes the logout method and the account to it", () => {
    expect(wrapper.find(HeaderComponent).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(HeaderComponent).prop("account")).toBe(account);
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

  it("calls update report action with the correct arguments when clicking the save button", () => {
    const overview = "text for report progress";
    const updatedReport1 = {
      ...report1,
      overview
    };

    wrapper
      .find('[data-test-id="report-progress-input"]')
      .simulate("change", { target: { value: overview } });

    wrapper.find('[data-test-id="report-save-button"]').simulate("click");

    expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
  });

  it("calls update report action with the correct arguments and redirects to home when clicking the submit button", () => {
    const overview = "text for report progress";
    const updatedReport1 = {
      ...report1,
      overview,
      completed: true
    };

    wrapper
      .find('[data-test-id="report-progress-input"]')
      .simulate("change", { target: { value: overview } });

    wrapper.find('[data-test-id="report-submit-button"]').simulate("click");

    expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
});
