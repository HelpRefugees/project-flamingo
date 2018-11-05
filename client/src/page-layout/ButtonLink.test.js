import React from "react";
import { mount } from "enzyme";
import ButtonLink from "./ButtonLink";
import { MemoryRouter } from "react-router-dom";

describe("ButtonLink", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <div>
          <ButtonLink data-test-id="report-button" to="/some-path">
            Some Text
          </ButtonLink>
        </div>
      </MemoryRouter>
    );
  });

  it("renders a link", () => {
    const link = wrapper.find(`Link[data-test-id="report-button"]`);
    expect(link.prop("to")).toEqual("/some-path");
    expect(link.text()).toEqual("Some Text");
  });
});
