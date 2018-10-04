import React from "react";
import { shallow } from "enzyme";

import { HeaderComponent } from "./HeaderComponent";

describe("HeaderComponent", () => {
  let wrapper;
  let mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    wrapper = shallow(<HeaderComponent classes={{}} logout={mockLogout} />);
  });

  it("calls logout action when clicking logout menu item", () => {
    wrapper.find('[data-test-id="user-menu"]').simulate("click", {});
    wrapper.find('[data-test-id="logout-menuitem"]').simulate("click");

    expect(mockLogout).toHaveBeenCalled();
  });
});
