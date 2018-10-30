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
  const report1: $Shape<Report> = {
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
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: ""
  };
  const report2: $Shape<Report> = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps",
    completed: false,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {},
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: "",
    materialsForFundraising: ""
  };
  let reports: $Shape<Report>[] = [report1, report2];
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

    describe("isSaveButtonDisabled", () => {
      it("is disabled during loading", () => {
        expect(
          wrapper.instance().isSaveButtonDisabled({
            reportPropertyValue: "report property value",
            statePropertyValue: "state property",
            isLoading: true
          })
        ).toBe(true);
      });

      it("is disabled when the overview is unchanged", () => {
        expect(
          wrapper.instance().isSaveButtonDisabled({
            reportPropertyValue: "sameValue",
            statePropertyValue: "sameValue",
            isLoading: false
          })
        ).toBe(true);
      });

      it("is enabled when loading finishes", () => {
        expect(
          wrapper.instance().isSaveButtonDisabled({
            reportPropertyValue: "report property value",
            statePropertyValue: "state property",
            isLoading: false
          })
        ).toBe(false);
      });

      it("is enabled when the state property is changed", () => {
        expect(
          wrapper.instance().isSaveButtonDisabled({
            reportPropertyValue: "one value",
            statePropertyValue: "another value",
            isLoading: false
          })
        ).toBe(false);
      });
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
        overview
      };

      wrapper
        .find('[data-test-id="report-progress-input"]')
        .simulate("change", { target: { value: overview } });

      wrapper.find('[data-test-id="report-submit-button"]').simulate("click");

      expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
    });

    it("redirects to the review screen on click", () => {
      wrapper.find('[data-test-id="report-submit-button"]').simulate("click");

      expect(mockHistoryPush).toHaveBeenCalledWith(
        `/reviewReports/${report1.id}`
      );
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

  const itIsATextareaSection = ({
    sectionIndex,
    title,
    subtitle,
    optional,
    inputSelector,
    reportProperty
  }) => {
    let section;

    const updateSection = () => {
      section = wrapper.find(ReportSectionComponent).at(sectionIndex);
    };

    beforeEach(() => {
      updateSection();
    });

    it("renders the section", () => {
      expect(section.exists()).toEqual(true);
      expect(section.prop("title")).toEqual(title);
      expect(section.prop("subtitle")).toEqual(subtitle);
      expect(section.prop("optional")).toEqual(optional);
    });

    describe("save button", () => {
      it("is disabled when the operating environment is unchanged", () => {
        expect(section.prop("disabled")).toBe(true);
      });

      it("disables during loading", () => {
        section
          .find(`[data-test-id="${inputSelector}"]`)
          .simulate("change", { target: { value: "Hello there" } });

        updateSection();

        expect(section.prop("disabled")).toBe(false);

        wrapper.setProps({ isLoading: true });

        updateSection();

        expect(section.prop("disabled")).toBe(true);
      });

      it("is enabled when the operating environment is changed", () => {
        section
          .find(`[data-test-id="${inputSelector}"]`)
          .simulate("change", { target: { value: "Hello there" } });

        updateSection();

        expect(section.prop("disabled")).toBe(false);
      });
    });

    it("updates the displayed text when the operating environment is changed", () => {
      const newValue = "is this thing on?";

      wrapper
        .find(`[data-test-id="${inputSelector}"]`)
        .simulate("change", { target: { value: newValue } });

      expect(
        wrapper.find(`[data-test-id="${inputSelector}"]`).prop("value")
      ).toBe(newValue);
    });

    it("calls update report action with the correct arguments when clicking the save button", () => {
      const newValue = `new value for ${reportProperty}`;

      const updatedReport1 = {
        ...report1,
        [reportProperty]: newValue
      };

      wrapper
        .find(`[data-test-id="${inputSelector}"]`)
        .simulate("change", { target: { value: newValue } });

      const onSave = section.prop("onSave");
      onSave();

      expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
    });
  };

  describe("operating environment", () => {
    itIsATextareaSection({
      sectionIndex: 1,
      title: "Operating environment",
      subtitle:
        "Outline any notable changes you have experienced to the context in which you work.",
      optional: true,
      inputSelector: "operating-environment-input",
      reportProperty: "operatingEnvironment"
    });
  });

  describe("beneficiary feedback", () => {
    itIsATextareaSection({
      sectionIndex: 3,
      title: "Beneficiary Feedback",
      subtitle:
        "Have you had any feedback from beneficiaries about the service/activities you offer?",
      optional: true,
      inputSelector: "beneficiary-feedback-input",
      reportProperty: "beneficiaryFeedback"
    });
  });

  describe("challenges faced", () => {
    itIsATextareaSection({
      sectionIndex: 4,
      title: "Challenges faced",
      subtitle:
        "Please use this section to describe any other challenges you may have faced in the last month e.g. legal, financial etc...",
      optional: true,
      inputSelector: "challenges-faced-input",
      reportProperty: "challengesFaced"
    });
  });

  describe("incidents and near misses", () => {
    itIsATextareaSection({
      sectionIndex: 5,
      title: "Incidents and near misses",
      subtitle:
        "Please describe any incidents or near misses that may have occurred related to health & safety, safeguarding, protection or security. How was the incident resolved and what policy or procedure is in place to avoid this reoccurring?",
      optional: true,
      inputSelector: "incidents-input",
      reportProperty: "incidents"
    });
  });

  describe("other issues", () => {
    itIsATextareaSection({
      sectionIndex: 6,
      title:
        "Is there anything you would like to use our platform to speak about?",
      subtitle:
        "Are there any issues, news or recent developments that you would like to amplify through our networks? We are always keen to hear about ways we can advocate for change, please contact us to discuss.",
      optional: true,
      inputSelector: "other-issues-input",
      reportProperty: "otherIssues"
    });
  });

  describe("materials for fundraising", () => {
    itIsATextareaSection({
      sectionIndex: 7,
      title: "Materials for fundraising",
      subtitle:
        "We depend on high quality images, film footage, copy and testimonials to raise funds and recruit volunteers. We are always keen to hear about ways we can advocate for change, please contact us to discuss.",
      optional: true,
      inputSelector: "materials-for-fundraising-input",
      reportProperty: "materialsForFundraising"
    });
  });

  describe("sections save independently", () => {
    let section;

    const updateSection = () => {
      section = wrapper.find(ReportSectionComponent).at(7);
    };

    beforeEach(() => {
      updateSection();
    });

    it("calls update report action with the correct arguments when clicking the save button", () => {
      const newValue = "new value for materialsForFundraising";

      const updatedReport1 = {
        ...report1,
        materialsForFundraising: newValue
      };

      wrapper
        .find(`[data-test-id="materials-for-fundraising-input"]`)
        .simulate("change", { target: { value: newValue } });

      wrapper.find(`[data-test-id="other-issues-input"]`).simulate("change", {
        target: { value: "new value for fundraisingInput" }
      });

      const onSave = section.prop("onSave");
      onSave();

      expect(mockUpdateReport).toHaveBeenCalledWith(updatedReport1);
    });
  });
});
