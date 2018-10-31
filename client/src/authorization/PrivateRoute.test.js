import type { Account } from "../authentication/models";
import { Redirect } from "react-router-dom";
import React from "react";
import PrivateRoute from "./PrivateRoute";

describe("PrivateRoute", () => {
  const daisyAccount: Account = {
    name: "Daisy Jones",
    username: "daisy@me.com",
    role: "daisy-role"
  };

  it("redirects to base route when not authenticated", () => {
    const route = PrivateRoute({
      path: "/abc",
      isAuthenticated: false,
      account: undefined,
      component: null,
      allowed: []
    });
    expect((route.props: any).render({})).toEqual(<Redirect to="/" />);
  });

  it("redirects to base route when not allowed to see the component", () => {
    const route = PrivateRoute({
      path: "/abc",
      isAuthenticated: true,
      account: daisyAccount,
      component: null,
      allowed: ["some-other-role", "not-daisy-role"]
    });
    expect((route.props: any).render({})).toEqual(<Redirect to="/forbidden" />);
  });

  it("renders the wrapped component when authenticated and allowed to see the component", () => {
    const dummyComponent = () => <div>Hello, world!</div>;
    const WrappedComponent = dummyComponent;
    const route = PrivateRoute({
      path: "/abc",
      isAuthenticated: true,
      account: daisyAccount,
      component: dummyComponent,
      allowed: ["some-other-role", "daisy-role"]
    });
    expect((route.props: any).render({})).toEqual(<WrappedComponent />);
  });

  it("passes router props to wrapped component when authenticated", () => {
    const dummyComponent = () => <div>Hello, world!</div>;
    const renderProps = { foo: 1, bar: 2 };
    const route = PrivateRoute({
      path: "/abc",
      isAuthenticated: true,
      account: daisyAccount,
      component: dummyComponent,
      allowed: ["some-other-role", "daisy-role"]
    });
    const wrappedComponent = (route.props: any).render(renderProps);
    expect(wrappedComponent.props).toEqual(renderProps);
  });
});


