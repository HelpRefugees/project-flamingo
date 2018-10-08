import React from "react";
import { shallow } from "enzyme";

import { LoginComponent } from "./LoginComponent";

describe("LoginComponent", () => {
  let wrapper;
  let mockLogin;

  beforeEach(() => {
    mockLogin = jest.fn();
    wrapper = shallow(
      <LoginComponent
        login={mockLogin}
        classes={{}}
        initializeLogin={() => {}}
      />
    );
  });

  it("calls login action when submitting form", () => {
    const username = "ellen@ip.org";
    const password = "flamingo";
    enterCredentials(username, password);

    wrapper.find("form").simulate("submit", { preventDefault: () => {} });

    expect(mockLogin).toHaveBeenCalledWith({
      username,
      password
    });
  });

  it("prevents page reload when submitting form", () => {
    const preventDefaultMock = jest.fn();

    wrapper
      .find("form")
      .simulate("submit", { preventDefault: preventDefaultMock });

    expect(preventDefaultMock).toHaveBeenCalled();
  });

  function enterCredentials(username, password) {
    wrapper
      .find('[data-test-id="username-input"]')
      .simulate("change", { target: { value: username } });
    wrapper
      .find('[data-test-id="password-input"]')
      .simulate("change", { target: { value: password } });
  }
});
