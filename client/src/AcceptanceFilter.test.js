import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import Acceptance from "./AcceptanceFilter";

const middleware = [];
const mockStore = configureStore(middleware);

describe("AcceptanceFilter", () => {
  const TestComponent = () => <div>test-component</div>;

  const withEnvironment = environment =>
    mount(
      <Provider store={mockStore({ environment })}>
        <Acceptance>
          <TestComponent />
        </Acceptance>
      </Provider>
    );

  describe("environment is development", () => {
    it("renders child components", () => {
      const wrapper = withEnvironment("development");

      expect(wrapper.find(TestComponent).exists()).toEqual(true);
    });
  });

  describe("environment is not development", () => {
    it("does not render child components", () => {
      const wrapper = withEnvironment("not-development");

      expect(wrapper.find(TestComponent).exists()).toEqual(false);
    });
  });
});
