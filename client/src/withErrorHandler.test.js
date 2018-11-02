import React from "react";
import withErrorHandler from "./withErrorHandler";
import { Provider } from "react-redux";
import { mount } from "enzyme";

import configureStore from "redux-mock-store";
import { errorExpired } from "./actions"; //ES6 modules
const middlewares = [];
const mockStore = configureStore(middlewares);

describe("withErrorHandler", () => {
  const TestComponent = () => <div>test-component</div>;
  const TestComponentWithErrorHandler = withErrorHandler(TestComponent);

  const withStoreState = state => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TestComponentWithErrorHandler />
      </Provider>
    );
    return { store, wrapper };
  };

  it("clears error on mount", () => {
    const { store } = withStoreState({});

    expect(store.getActions()).toContainEqual(errorExpired());
  });

  it("clears error on unmount", () => {
    const { wrapper, store } = withStoreState({});

    expect(store.getActions()).toEqual([errorExpired()]);

    wrapper.unmount();

    expect(store.getActions()).toEqual([errorExpired(), errorExpired()]);
  });

  it("renders the error if it receives a failed prop", () => {
    const errorMessage = "Something went wrong";
    const { wrapper } = withStoreState({ errorMessage });

    expect(
      wrapper
        .find('SnackbarContent[data-test-id="error-message"]')
        .render()
        .text()
    ).toContain(errorMessage);
  });

  it("renders the wrapped component", () => {
    const { wrapper } = withStoreState();

    expect(wrapper.find(TestComponent).exists()).toEqual(true);
  });
});
