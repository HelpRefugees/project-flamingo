import React from "react";
import { mount } from "enzyme";
import ButtonNavLink from "./ButtonNavLink";
import { MemoryRouter } from "react-router-dom";

describe("ButtonNavLink", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <div>
          <ButtonNavLink data-test-id="report-button" to="/some-path">
            Some Text
          </ButtonNavLink>
        </div>
      </MemoryRouter>
    );
  });

  it("renders a nav link", () => {
    const navLink = wrapper.find(`NavLink[data-test-id="report-button"]`);
    expect(navLink.prop("to")).toEqual("/some-path");
    expect(navLink.prop("activeStyle")).toEqual({ color: "#00857b" });
    expect(navLink.text()).toEqual("Some Text");
  });
});
