import React from "react";
import { shallow } from "enzyme";
import Deferred from "promise-deferred";

import LoginComponent from "./LoginComponent";

describe("LoginComponent", () => {
  let wrapper;
  let mockLogin;
  let deferred;

  beforeEach(() => {
    deferred = new Deferred();
    mockLogin = jest.fn(() => deferred.promise);
    wrapper = shallow(<LoginComponent login={mockLogin} />);
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

  it("sets authentication state when the promise is resolved false", done => {
    login("foo", "bar");
    deferred.resolve(false);

    setTimeout(() => {
      expect(wrapper.state().isAuthenticated).toBe(false);
      done();
    });
  });

  it("sets authentication state when the promise is resolved true", done => {
    login("foo", "bar");
    deferred.resolve(true);

    setTimeout(() => {
      expect(wrapper.state().isAuthenticated).toBe(true);
      done();
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
