import React from "react";
import { mountWithProvider } from "../setupTests";
import RoleFilter from "./RoleFilter";

describe("RoleFilter", () => {
  const TestComponent = () => <div>test-component</div>;

  const mountWithRole = (permit: string, role) =>
    mountWithProvider(
      <RoleFilter permit={permit}>
        <TestComponent />
      </RoleFilter>,
      { account: { role } }
    );

  describe("account has matching role", () => {
    it("renders children", () => {
      const wrapper = mountWithRole("a-role", "a-role");

      expect(wrapper.find(TestComponent).exists()).toEqual(true);
    });
  });

  describe("account does not have matching role", () => {
    it("does not render children", () => {
      const wrapper = mountWithRole("another-role", "a-role");

      expect(wrapper.find(TestComponent).exists()).toEqual(false);
    });
  });
});
