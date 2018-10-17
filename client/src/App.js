import React, { Component, Fragment } from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect, Switch } from "react-router-dom";

import LoginPage from "./authentication/LoginPage";
import MyReportsPage from "./my-reports/MyReportsPage";
import ReportPage from "./report/ReportPage";
import ReportsListingPage from "./reports-listing/ReportsListingPage";
import SubmittedReportPage from "./submitted-report/SubmittedReportPage";

import type { State } from "./reducers";
import type { Account } from "./authentication/models";

const mapStateToProps = (state: State) => {
  return {
    isAuthenticated: state.isAuthenticated,
    account: state.account
  };
};

interface Props {
  isAuthenticated?: boolean;
  account?: Account;
}

export class App extends Component<Props> {
  render() {
    return (
      <Router>
        <Fragment>
          <CssBaseline />
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <PrivateRoute
              path="/reportsListing"
              allowed={["help-refugees"]}
              component={ReportsListingPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/submittedReports/:id"
              allowed={["help-refugees"]}
              component={SubmittedReportPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/myReports"
              allowed={["implementing-partner"]}
              component={MyReportsPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/reports/:id"
              allowed={["implementing-partner"]}
              component={ReportPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <Route exact path="/forbidden" component={Forbidden} />
            <Route component={NotFoundPage} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);

export const PrivateRoute = (configProps: {
  path: string,
  isAuthenticated?: boolean,
  account?: Account,
  component: any,
  allowed: string[]
}) => {
  const { path, isAuthenticated, account, component, allowed } = configProps;
  const OriginalComponent = component;
  return (
    <Route
      path={path}
      render={props => {
        if (!isAuthenticated) {
          return <Redirect to="/" />;
        }

        if (
          isAuthenticated
          && account
          && allowed.indexOf(account.role) === -1
        ) {
          return <Redirect to="/forbidden" />;
        }

        return <OriginalComponent {...props} />;
      }}
    />
  );
};

export const NotFoundPage = () => (
  <h2 data-test-id="not-found">404 Sorry! Page not found.</h2>
);

export const Forbidden = () => (
  <h2 data-test-id="forbidden">
    403 Sorry! You don’t have permission to access this page.
  </h2>
);
