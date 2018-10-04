import React from "react";
import { shallow } from "enzyme";

import { HomeComponent } from "./HomeComponent";

describe("HomeComponent", () => {
  let wrapper;
  let mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    wrapper = shallow(<HomeComponent classes={{}} logout={mockLogout} />);
  });

  it("calls logout action when clicking logout menu item", () => {
    wrapper.find('[data-test-id="user-menu"]').simulate("click", {});
    wrapper.find('[data-test-id="logout-menuitem"]').simulate("click");

    expect(mockLogout).toHaveBeenCalled();
  });
});
