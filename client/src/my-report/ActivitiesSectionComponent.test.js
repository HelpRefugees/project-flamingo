import React from "react";
import { shallow } from "enzyme";

import {
  KeyActivitySubsection,
  ActivitiesSectionComponent
} from "./ActivitiesSectionComponent";
import { type KeyActivity } from "./models";

describe("activities section", () => {
  let wrapper;
  let onChange;
  let onSave;

  const disabled = false;
  const isLoading = false;
  const classes = {};
  const activities: KeyActivity[] = [
    {
      activityName: "act1",
      demographicInfo: "demoinfo",
      impactOutcome: "out1",
      numberOfParticipants: "133"
    },
    {
      activityName: "act2",
      demographicInfo: "demoinfo",
      impactOutcome: "out2",
      numberOfParticipants: "143"
    }
  ];

  beforeEach(() => {
    onChange = jest.fn();
    onSave = jest.fn();

    wrapper = shallow(
      <ActivitiesSectionComponent
        activities={activities}
        onChange={onChange}
        onSave={onSave}
        disabled={disabled}
        isLoading={isLoading}
        classes={classes}
      />
    );
  });

  it("renders activity subsection per each activity", () => {
    expect(wrapper.find(KeyActivitySubsection)).toHaveLength(activities.length);
  });

  it("passes the activity data to the subsection", () => {
    const index = 1;

    expect(
      wrapper.find(KeyActivitySubsection).get(index).props.activity
    ).toEqual(activities[index]);

    expect(wrapper.find(KeyActivitySubsection).get(index).props.index).toEqual(
      index
    );

    expect(
      wrapper.find(KeyActivitySubsection).get(index).props.numberOfActivities
    ).toEqual(activities.length);
  });

  it("passes the parent props", () => {
    const index = 1;

    expect(
      wrapper.find(KeyActivitySubsection).get(index).props.disabled
    ).toEqual(disabled);
    expect(
      wrapper.find(KeyActivitySubsection).get(index).props.classes
    ).toEqual(classes);
    expect(
      wrapper.find(KeyActivitySubsection).get(index).props.isLoading
    ).toEqual(isLoading);
  });

  it("calls the onChange method with an event when any of the subsections change", () => {
    const updatedActivity = {
      ...activities[0],
      numberOfParticipants: "123"
    };
    wrapper
      .find(KeyActivitySubsection)
      .get(0)
      .props.onChange(0, updatedActivity);

    expect(onChange).toHaveBeenCalledWith({
      target: {
        value: [updatedActivity, ...activities.slice(1)]
      }
    });
  });

  it("calls the onSave method with an event when section is saved", () => {
    wrapper
      .find(KeyActivitySubsection)
      .get(activities.length - 1)
      .props.onSave();

    expect(onSave).toHaveBeenCalledWith("keyActivities");
  });

  it("add a new activity calls the onChange method with an event", () => {
    wrapper
      .find(KeyActivitySubsection)
      .get(activities.length - 1)
      .props.addActivity();

    expect(onChange).toHaveBeenCalledWith({
      target: {
        value: [...activities, {}]
      }
    });
  });

  it("remove an activity calls the onChange method with an event", () => {
    wrapper
      .find(KeyActivitySubsection)
      .get(0)
      .props.removeActivity(0);

    expect(onChange).toHaveBeenCalledWith({
      target: {
        value: [activities[1]]
      }
    });
  });
});

describe.skip("activity subsection", () => {
  const activity: KeyActivity = {
    activityName: "abc",
    demographicInfo: "info",
    impactOutcome: "outcomes",
    numberOfParticipants: "10239"
  };

  let wrapper;
  let onSave;
  let removeActivity;
  let addActivity;
  let index;
  let numberOfActivities;
  let onChange;

  beforeEach(() => {
    onSave = jest.fn();
    removeActivity = jest.fn();
    addActivity = jest.fn();
    index = 0;
    numberOfActivities = 3;
    onChange = jest.fn();
    wrapper = shallow(
      <KeyActivitySubsection
        index={index}
        classes={{}}
        activity={activity}
        onSave={onSave}
        removeActivity={removeActivity}
        addActivity={addActivity}
        isLoading={false}
        disabled={false}
        numberOfActivities={numberOfActivities}
        onChange={onChange}
      />
    );
  });

  it("renders the section input fields", () => {
    [
      { dataId: "report-activity-name-input", field: "activityName" },
      {
        dataId: "report-participants-number-input",
        field: "numberOfParticipants"
      },
      { dataId: "report-demographic-info-input", field: "demographicInfo" },
      { dataId: "report-impact-outcome-input", field: "impactOutcome" }
    ].forEach(({ dataId, field }) => {
      const selector = `[data-test-id='${dataId}']`;
      expect(wrapper.find(selector).exists()).toEqual(true);
      expect(wrapper.find(selector).prop("value")).toEqual(activity[field]);
    });

    expect(
      wrapper
        .find("[data-test-id='report-participants-number-input']")
        .prop("type")
    ).toEqual("number");
  });

  it("calls on change method when any of the inputs change", () => {
    const updatedActivity = {
      ...activity,
      activityName: "cheese"
    };

    wrapper
      .find('[data-test-id="report-activity-name-input"]')
      .simulate("change", { target: { value: "cheese" } });

    expect(onChange).toHaveBeenCalledWith(index, updatedActivity);
  });

  describe("when loading", () => {
    beforeEach(() => {
      wrapper.setProps({ isLoading: true, index: numberOfActivities - 1 });
      wrapper
        .find('[data-test-id="report-activity-name-input"]')
        .simulate("change", { target: { value: "cheese" } });
    });

    it("should disable all buttons", () => {
      expect(
        wrapper.find('[data-test-id="section-save-button"]').prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find('[data-test-id="remove-activity-button"]').prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find('[data-test-id="add-activity-button"]').prop("disabled")
      ).toBe(true);
    });
  });

  describe("when disabled", () => {
    beforeEach(() => {
      wrapper.setProps({ disabled: true, index: numberOfActivities - 1 });
      wrapper
        .find('[data-test-id="report-activity-name-input"]')
        .simulate("change", { target: { value: "cheese" } });
    });

    it("should disable save button", () => {
      expect(
        wrapper.find('[data-test-id="section-save-button"]').prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find('[data-test-id="remove-activity-button"]').prop("disabled")
      ).toBe(false);
      expect(
        wrapper.find('[data-test-id="add-activity-button"]').prop("disabled")
      ).toBe(false);
    });
  });
  describe("remove activity button", () => {
    it("is enabled by default", () => {
      expect(
        wrapper.find('[data-test-id="remove-activity-button"]').prop("disabled")
      ).toBe(false);
    });

    it("calls remove activity method when clicked", () => {
      wrapper.find('[data-test-id="remove-activity-button"]').simulate("click");

      expect(removeActivity).toHaveBeenCalledWith(index);
    });
  });

  describe("add activity button", () => {
    beforeEach(() => {
      wrapper.setProps({ index: numberOfActivities - 1 });
    });

    it("is enabled by default", () => {
      expect(
        wrapper.find('[data-test-id="add-activity-button"]').prop("disabled")
      ).toBe(false);
    });

    it("calls add activity method when clicked", () => {
      wrapper.find('[data-test-id="add-activity-button"]').simulate("click");

      expect(addActivity).toHaveBeenCalled();
    });
  });

  describe("on first subsection", () => {
    it("shows the section title", () => {
      expect(
        wrapper
          .find('[data-test-id="section-title"]')
          .render()
          .text()
      ).toEqual("Key Activities");
      expect(wrapper.find('[data-test-id="section-subtitle"]').text()).toEqual(
        "Please describe the activities you have done this month."
      );
    });

    it("does not show the 'Add Another Activity' button", () => {
      expect(
        wrapper.find('[data-test-id="add-activity-button"]').exists()
      ).toBe(false);
    });

    it("shows the 'remove this activity' button", () => {
      expect(
        wrapper.find('[data-test-id="remove-activity-button"]').exists()
      ).toBe(true);
    });

    it("does not show the save button", () => {
      expect(
        wrapper.find('[data-test-id="section-save-button"]').exists()
      ).toBe(false);
    });

    describe("when we have only one activity", () => {
      beforeEach(() => {
        wrapper.setProps({ numberOfActivities: 1 });
      });

      it("does not show the remove this activity' button", () => {
        expect(
          wrapper.find('[data-test-id="remove-activity-button"]').exists()
        ).toBe(false);
      });
    });
  });

  describe("on subsequent subsection", () => {
    beforeEach(() => {
      wrapper.setProps({ index: 1 });
    });

    it("does not show the section title", () => {
      expect(wrapper.find('[data-test-id="section-title"]').exists()).toBe(
        false
      );
      expect(wrapper.find('[data-test-id="section-subtitle"]').exists()).toBe(
        false
      );
    });

    it("does not show the 'Add Another Activity' button", () => {
      expect(
        wrapper.find('[data-test-id="add-activity-button"]').exists()
      ).toBe(false);
    });

    it("shows the 'remove this activity' button", () => {
      expect(
        wrapper.find('[data-test-id="remove-activity-button"]').exists()
      ).toBe(true);
    });

    it("does not show the save button", () => {
      expect(
        wrapper.find('[data-test-id="section-save-button"]').exists()
      ).toBe(false);
    });
  });

  describe("on last subsection", () => {
    beforeEach(() => {
      wrapper.setProps({ index: 2 });
    });

    it("shows the 'Add Another Activity' button", () => {
      expect(
        wrapper.find('[data-test-id="add-activity-button"]').exists()
      ).toBe(true);
    });

    it("shows the 'remove this activity' button", () => {
      expect(
        wrapper.find('[data-test-id="remove-activity-button"]').exists()
      ).toBe(true);
    });

    it("shows the save button", () => {
      expect(
        wrapper.find('[data-test-id="section-save-button"]').exists()
      ).toBe(true);
    });

    describe("save button", () => {
      it("is disabled when the disabled prop is passed", () => {
        wrapper.setProps({ disabled: true });
        expect(
          wrapper.find('[data-test-id="section-save-button"]').prop("disabled")
        ).toBe(true);
      });

      it("calls onSave method when clicked", () => {
        wrapper
          .find('[data-test-id="report-activity-name-input"]')
          .simulate("change", { target: { value: "cheese" } });

        wrapper.find('[data-test-id="section-save-button"]').simulate("click");

        expect(onSave).toHaveBeenCalledWith();
      });
    });
  });
});
