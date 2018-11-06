import React from "react";
import { shallow } from "enzyme";
import Deferred from "promise-deferred";

import { ResetPasswordComponent } from "./ResetPasswordComponent";
import { assertLater } from "../testHelpers";

describe("ForgottenPasswordComponent", () => {
  const resetToken = "iamatoken";

  let deferred;
  let wrapper;
  let mockHistoryPush;
  let mockSetPassword;

  beforeEach(() => {
    deferred = new Deferred();
    mockSetPassword = jest.fn().mockReturnValue(deferred.promise);
    mockHistoryPush = jest.fn();

    wrapper = shallow(
      <ResetPasswordComponent
        classes={{}}
        setPassword={mockSetPassword}
        history={{ push: mockHistoryPush }}
        location={{ search: `?token=${resetToken}` }}
      />
    );
  });

  describe("when both passwords are the same", () => {
    const password = "supersecurepassword";

    beforeEach(() => {
      wrapper
        .find('[data-test-id="password-input-one"]')
        .simulate("change", { target: { value: password } });
      wrapper
        .find('[data-test-id="password-input-two"]')
        .simulate("change", { target: { value: password } });
    });

    it("sends token and the new password when submitting the form", () => {
      wrapper.find("form").simulate("submit", {
        preventDefault: () => {}
      });

      expect(mockSetPassword).toHaveBeenCalledWith(resetToken, password);
    });

    it("sends the user to success page when complete", done => {
      wrapper.find("form").simulate("submit", {
        preventDefault: () => {}
      });
      deferred.resolve(true);

      assertLater(done, () => {
        expect(mockHistoryPush).toHaveBeenCalledWith("/reset-success");
      });
    });
  });

  describe("when the passwords aren't the same", () => {
    const password = "supersecurepassword";

    beforeEach(() => {
      wrapper
        .find('[data-test-id="password-input-one"]')
        .simulate("change", { target: { value: password } });
      wrapper
        .find('[data-test-id="password-input-two"]')
        .simulate("change", { target: { value: "somethingelse" } });
    });

    it("does not send the new password when submitting the form", () => {
      wrapper.find("form").simulate("submit", {
        preventDefault: () => {}
      });

      expect(mockSetPassword).not.toHaveBeenCalled();
    });
  });
});
