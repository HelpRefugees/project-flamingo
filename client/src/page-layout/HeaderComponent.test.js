import React from "react";
import { shallow } from "enzyme";

import { HeaderComponent } from "./HeaderComponent";
import Navigation from "./Navigation";

describe("HeaderComponent", () => {
  const account = {
    username: "sjones@ip.org",
    name: "Steve Jones",
    role: "some-role"
  };

  let wrapper;
  let mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    wrapper = shallow(
      <HeaderComponent classes={{}} logout={mockLogout} account={account} />
    );
  });

  it("calls logout action when clicking logout menu item", () => {
    wrapper.find('[data-test-id="user-menu"]').simulate("click", {});
    wrapper.find('[data-test-id="logout-menuitem"]').simulate("click");

    expect(mockLogout).toHaveBeenCalled();
  });

  it("displays the name of the logged in user", () => {
    expect(
      wrapper
        .find('[data-test-id="user-name"]')
        .render()
        .text()
    ).toContain(account.name);
  });

  it("renders the navigation", () => {
    expect(wrapper.find(Navigation).exists()).toEqual(true);
  });

  it("doesnot render settings navigation when ellen is logged in", () => {
    wrapper.find('[data-test-id="user-menu"]').simulate("click", {});
    expect(wrapper.find('[data-test-id="settings-menuitem"]').exists()).toEqual(
      false
    );
  });
});
