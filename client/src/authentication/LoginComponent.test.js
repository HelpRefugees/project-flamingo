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

  it("calls login service when clicking button", () => {
    const username = "ellen@ip.org";
    const password = "flamingo";

    login(username, password);

    expect(mockLogin).toHaveBeenCalledWith({
      username,
      password
    });
  });

  function login(username, password) {
    wrapper
      .find('[data-test-id="username-input"]')
      .simulate("change", { target: { value: username } });
    wrapper
      .find('[data-test-id="password-input"]')
      .simulate("change", { target: { value: password } });
    wrapper.find('[data-test-id="login-button"]').simulate("click");
  }
});
