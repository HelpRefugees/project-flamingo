import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";

import { App, PrivateRoute } from "./App";

it("renders without crashing", () => {
  shallow(<App />);
});

describe("PrivateRoute", () => {
  it("redirects to base route when not authenticated", () => {
    const route = PrivateRoute({
      path: "/",
      isAuthenticated: false,
      component: null
    });
    expect((route.props: any).render({})).toEqual(<Redirect to="/" />);
  });

  it("renders the wrapped component when authenticated", () => {
    const dummyComponent = () => <div>Hello, world!</div>;
    const WrappedComponent = dummyComponent;
    const route = PrivateRoute({
      path: "/",
      isAuthenticated: true,
      component: dummyComponent
    });
    expect((route.props: any).render({})).toEqual(<WrappedComponent />);
  });

  it("passes router props to wrapped component when authenticated", () => {
    const dummyComponent = () => <div>Hello, world!</div>;
    const renderProps = { foo: 1, bar: 2 };
    const route = PrivateRoute({
      path: "/",
      isAuthenticated: true,
      component: dummyComponent
    });
    const wrappedComponent = (route.props: any).render(renderProps);
    expect(wrappedComponent.props).toEqual(renderProps);
  });
});
