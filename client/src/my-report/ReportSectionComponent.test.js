import React from "react";
import { mount } from "enzyme";

import ReportSectionComponent from "./ReportSectionComponent";

describe("ReportSectionComponent", () => {
  const TestComponent = () => <div>a-test-component</div>;

  const section = {
    title: "some-title",
    subtitle: "some-subtitle"
  };

  let wrapper;
  let onSave;

  beforeEach(() => {
    onSave = jest.fn();
    wrapper = mount(
      <ReportSectionComponent
        title={section.title}
        subtitle={section.subtitle}
        optional={true}
        onSave={onSave}
      >
        <TestComponent />
      </ReportSectionComponent>
    );
  });

  it("renders the title", () => {
    expect(wrapper.find('Typography[data-test-id="section-title"]').text()).toEqual(
      section.title
    );
  });

  it("renders the subtitle", () => {
    expect(wrapper.find('[data-test-id="section-subtitle"]').text()).toEqual(
      section.subtitle
    );
  });

  it("renders the optional text if optional is set to true", () => {
    expect(wrapper.find('Typography[data-test-id="optional-title"]').text()).toEqual(
      "- Optional"
    );
  });

  it("renders the children", () => {
    expect(wrapper.find(TestComponent).text()).toEqual("a-test-component");
  });

  describe("save button", () => {
    it("calls the given onSave property", () => {
      const saveButton = wrapper.find(
        '[data-test-id="section-save-button"] Button'
      );
      saveButton.simulate("click");

      expect(onSave).toHaveBeenCalledTimes(1);
    });

    describe("section is disabled", () => {
      it("the button is disabled", () => {
        wrapper.setProps({ disabled: true });

        const saveButton = wrapper.find(
          '[data-test-id="section-save-button"] Button'
        );

        expect(saveButton.prop("disabled")).toEqual(true);
      });
    });

    describe("section is not disabled", () => {
      it("the button is not disabled", () => {
        const saveButton = wrapper.find(
          '[data-test-id="section-save-button"] Button'
        );

        expect(saveButton.prop("disabled")).toEqual(false);
      });
    });
  });
});
