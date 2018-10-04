import React, { Component, Fragment } from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import LoginPage from "./authentication/LoginPage";
import HomePage from "./home/HomePage";
import type { State } from "./reducers";

const mapStateToProps = (state: State) => {
  return {
    isAuthenticated: state.isAuthenticated
  };
};

interface Props {
  isAuthenticated?: boolean;
}

export class App extends Component<Props> {
  render() {
    return (
      <Router>
        <Fragment>
          <CssBaseline />
          <Route exact path="/" component={LoginPage} />
          <PrivateRoute
            path="/home"
            component={HomePage}
            isAuthenticated={this.props.isAuthenticated}
          />
        </Fragment>
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);

export const PrivateRoute = (configProps: {
  path: string,
  isAuthenticated?: boolean,
  component: any
}) => {
  const { path, isAuthenticated, component } = configProps;
  const OriginalComponent = component;
  return (
    <Route
      path={path}
      render={props => {
        if (isAuthenticated) {
          return <OriginalComponent {...props} />;
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
};
