import React from "react";
import { shallow } from "enzyme";
import Deferred from "promise-deferred";
import { Button } from "@material-ui/core";

import { ForgottenPasswordComponent } from "./ForgottenPasswordComponent";
import { assertLater } from "../testHelpers";

describe("ForgottenPasswordComponent", () => {
  let deferred;
  let wrapper;
  let mockResetPassword;
  let mockHistoryPush;

  beforeEach(() => {
    deferred = new Deferred();
    mockResetPassword = jest.fn().mockReturnValue(deferred.promise);
    mockHistoryPush = jest.fn();

    wrapper = shallow(
      <ForgottenPasswordComponent
        classes={{}}
        resetPassword={mockResetPassword}
        history={{ push: mockHistoryPush }}
        isLoading={false}
      />
    );
  });

  it("request a password reset email when submitting the form", () => {
    const username = "ellen@ip.org";
    wrapper
      .find('[data-test-id="username-input"]')
      .simulate("change", { target: { value: username } });

    wrapper.find("form").simulate("submit", { preventDefault: () => {} });

    expect(mockResetPassword).toHaveBeenCalledWith(username);
  });

  it("redirects to the reset request page on success", done => {
    wrapper.find("form").simulate("submit", { preventDefault: () => {} });

    deferred.resolve(true);

    assertLater(done, () => {
      expect(mockHistoryPush).toHaveBeenCalledWith("/reset-submitted");
    });
  });

  it("does not redirect to the reset request page on failure", done => {
    wrapper.find("form").simulate("submit", { preventDefault: () => {} });

    deferred.resolve(false);

    assertLater(done, () => {
      expect(mockHistoryPush).not.toHaveBeenCalled();
    });
  });

  it("disables the button when a request is loading", () => {
    wrapper.setProps({ isLoading: true });

    expect(wrapper.find(Button).prop("disabled")).toBe(true);
  });
});
