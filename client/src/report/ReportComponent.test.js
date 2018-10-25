import React from "react";
import { shallow } from "enzyme";

import { ReportComponent } from "./ReportComponent";
import HeaderComponent from "../page-layout/HeaderComponent";
import type { Report } from "./models";
import type { Account } from "../authentication/models";
import ReportSectionComponent from "./ReportSectionComponent";

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
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {
      activityName: "activityName",
      numberOfParticipants: "numberOfParticipants",
      demographicInfo: "demographicInfo",
      impactOutcome: "impactOutcome"
    },
    operatingEnvironment: ""
  };
  const report2: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps",
    completed: false,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {},
    operatingEnvironment: ""
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
        isLoading={false}
        submittedReport={false}
      />
    );
  });

  it("renders a header component and passes the logout method and the account to it", () => {
    expect(wrapper.find(HeaderComponent).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(HeaderComponent).prop("account")).toBe(account);
  });

  describe("grant progress", () => {
    let grantProgressSection;

    const updateSection = () => {
      grantProgressSection = wrapper.find(ReportSectionComponent).at(0);
    };

    beforeEach(() => {
      updateSection();
    });

    it("renders the section", () => {
      expect(grantProgressSection.exists()).toEqual(true);
      expect(grantProgressSection.prop("title")).toEqual("Grant progress");
      expect(grantProgressSection.prop("subtitle")).toEqual(
        "Please give a very brief overview of your project and progress since the last report."
      );
    });

    it("redirects to myReports page when report submitted successfully", () => {
      wrapper.setProps({ submittedReport: true });

      expect(mockHistoryPush).toHaveBeenCalledWith("/myReports");
    });

    describe("save button", () => {
      it("is disabled when the overview is unchanged", () => {
        expect(grantProgressSection.prop("disabled")).toBe(true);
      });

      it("disables during loading", () => {
        grantProgressSection
          .find('[data-test-id="report-progress-input"]')
          .simulate("change", { target: { value: "Hello there" } });

        updateSection();

        expect(grantProgressSection.prop("disabled")).toBe(false);

        wrapper.setProps({ isLoading: true });

        updateSection();

        expect(grantProgressSection.prop("disabled")).toBe(true);
      });

      it("is enabled when the overview is changed", () => {
        grantProgressSection
          .find('[data-test-id="report-progress-input"]')
          .simulate("change", { target: { value: "Hello there" } });

        updateSection();

        expect(grantProgressSection.prop("disabled")).toBe(false);
      });
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

      const onSave = grantProgressSection.prop("onSave");
      onSave();

      expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
    });
  });

  describe("operating environment", () => {
    let operatingEnvironmentSection;

    const updateSection = () => {
      operatingEnvironmentSection = wrapper.find(ReportSectionComponent).at(1);
    };

    beforeEach(() => {
      updateSection();
    });

    it("renders the section", () => {
      expect(operatingEnvironmentSection.exists()).toEqual(true);
      expect(operatingEnvironmentSection.prop("title")).toEqual(
        "Operating environment"
      );
      expect(operatingEnvironmentSection.prop("subtitle")).toEqual(
        "Outline any notable changes you have experienced to the context in which you work."
      );
      expect(operatingEnvironmentSection.prop("optional")).toEqual(true);
    });

    describe("save button", () => {
      it("is disabled when the operating environment is unchanged", () => {
        expect(operatingEnvironmentSection.prop("disabled")).toBe(true);
      });

      it("disables during loading", () => {
        operatingEnvironmentSection
          .find('[data-test-id="operating-environment-input"]')
          .simulate("change", { target: { value: "Hello there" } });

        updateSection();

        expect(operatingEnvironmentSection.prop("disabled")).toBe(false);

        wrapper.setProps({ isLoading: true });

        updateSection();

        expect(operatingEnvironmentSection.prop("disabled")).toBe(true);
      });

      it("is enabled when the operating environment is changed", () => {
        operatingEnvironmentSection
          .find('[data-test-id="operating-environment-input"]')
          .simulate("change", { target: { value: "Hello there" } });

        updateSection();

        expect(operatingEnvironmentSection.prop("disabled")).toBe(false);
      });
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

      const onSave = operatingEnvironmentSection.prop("onSave");
      onSave();

      expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
    });
  });

  describe("key activites", () => {
    let keyActivitiesSection;

    const updateSection = () => {
      keyActivitiesSection = wrapper.find(ReportSectionComponent).at(2);
    };

    beforeEach(() => {
      updateSection();
    });

    it("renders the section", () => {
      expect(keyActivitiesSection.exists()).toEqual(true);
      expect(keyActivitiesSection.prop("title")).toEqual("Key Activities");
      expect(keyActivitiesSection.prop("subtitle")).toEqual(
        "Please describe the activities you have done this month."
      );
    });

    it("renders the section input fields", () => {
      const fields = [
        "report-activity-name-input",
        "report-participants-number-input",
        "report-demographic-info-input",
        "report-impact-outcome-input",
        "report-participants-number-input"
      ];

      fields.forEach(field =>
        expect(
          keyActivitiesSection.find(`[data-test-id='${field}']`).exists()
        ).toEqual(true)
      );

      expect(
        keyActivitiesSection
          .find("[data-test-id='report-participants-number-input']")
          .prop("type")
      ).toEqual("number");
    });

    describe("save button", () => {
      it("is disabled when none of the fields is changed", () => {
        expect(keyActivitiesSection.prop("disabled")).toBe(true);
      });

      it("is not disabled when any of the fields change", () => {
        keyActivitiesSection
          .find('[data-test-id="report-activity-name-input"]')
          .simulate("change", { target: { value: "cheese" } });

        updateSection();

        expect(keyActivitiesSection.prop("disabled")).toBe(false);
      });
    });
  });

  describe("submit", () => {
    it("calls update report action with the correct arguments on click", () => {
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
    });

    it("is disabled during loading", () => {
      expect(
        wrapper.find('[data-test-id="report-submit-button"]').prop("disabled")
      ).toBe(false);

      wrapper.setProps({ isLoading: true });

      expect(
        wrapper.find('[data-test-id="report-submit-button"]').prop("disabled")
      ).toBe(true);
    });
  });
});
