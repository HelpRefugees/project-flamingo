import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import Initializer from "./Initializer";
import { mount } from "enzyme";
import { appStarted } from "./actions";
import { mountWithProvider } from "./setupTests";

describe("Initializer", () => {
  const TestComponent = () => <div>test-component</div>;

  describe("on mount", () => {
    it("dispatches an app started action", () => {
      const mockStore = configureStore([]);
      const store = mockStore();

      expect(store.getActions()).toHaveLength(0);

      mount(
        <Provider store={store}>
          <Initializer>
            <TestComponent />
          </Initializer>
        </Provider>
      );

      expect(store.getActions()).toEqual([appStarted()]);
    });
  });

  describe("environment", () => {
    const withEnvironment = environment =>
      mountWithProvider(
        <Initializer>
          <TestComponent />
        </Initializer>,
        { environment }
      );

    describe("with a defined environment", () => {
      it("renders children", () => {
        expect(
          withEnvironment("development")
            .find(TestComponent)
            .exists()
        ).toEqual(true);
      });
    });

    describe("with a undefined environment", () => {
      it("does not render children", () => {
        expect(
          withEnvironment(undefined)
            .find(TestComponent)
            .exists()
        ).toEqual(false);
      });
    });
  });
});
