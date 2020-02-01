import React from "react";
import { mountWithProvider } from "../setupTests";
import Navigation from "./Navigation";
import { MemoryRouter } from "react-router-dom";

describe("Navigation", () => {
  const navWithRole = role =>
    mountWithProvider(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
      { account: { role } }
    );

  describe("account has help-refugees role", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = navWithRole("help-refugees");
    });

    it("renders a link for reports", () => {
      const link = wrapper.find('NavLink[data-test-id="nav-link-reports"]');

      expect(link.prop("to")).toEqual("/reports");
      expect(link.text()).toEqual("Reports");
    });

    it("renders a link for grants", () => {
      const link = wrapper.find('NavLink[data-test-id="nav-link-grants"]');

      expect(link.prop("to")).toEqual("/grants");
      expect(link.text()).toEqual("Grants");
    });
  });

  describe("account does not have help-refugees role", () => {
    it("renders an empty navigation bar", () => {
      const wrapper = navWithRole("another-role");

      expect(wrapper.text()).toBe("");
    });
  });
});
