import React, { Component, Fragment } from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";

import LoginPage from "./authentication/LoginPage";
import ResetPasswordPage from "./authentication/ResetPasswordPage";
import ForgottenPasswordPage from "./authentication/ForgottenPasswordPage";
import ResetSubmittedPage from "./authentication/ResetSubmittedPage";
import MyReportsPage from "./my-report/MyReportsPage";
import MyReportReviewPage from "./my-report/MyReportReviewPage";
import MyReportEditPage from "./my-report/MyReportEditPage";
import ReportsListingPage from "./reports-listing/ReportsListingPage";
import SubmittedReportPage from "./submitted-report/SubmittedReportPage";

import type { State } from "./reducers";
import type { Account } from "./authentication/models";

import PrivateRoute from "./authorization/PrivateRoute";
import NotFound from "./authorization/NotFound";
import Forbidden from "./authorization/Forbidden";
import MyReportPage from "./my-report/MyReportPage";
import withErrorHandler from "./withErrorHandler";

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

            <Route
              exact
              path="/forgotten-password"
              component={ForgottenPasswordPage}
            />

            <Route
              exact
              path="/reset-submitted"
              component={ResetSubmittedPage}
            />

            <Route
              exact
              path="/reset-password"
              component={ResetPasswordPage}
            />

            <PrivateRoute
              path="/reports/:id"
              allowed={["help-refugees"]}
              component={withErrorHandler(SubmittedReportPage)}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/reports"
              allowed={["help-refugees"]}
              component={withErrorHandler(ReportsListingPage)}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports/:id/edit"
              allowed={["implementing-partner"]}
              component={withErrorHandler(MyReportEditPage)}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports/:id/review"
              allowed={["implementing-partner"]}
              component={withErrorHandler(MyReportReviewPage)}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports/:id"
              allowed={["implementing-partner"]}
              component={withErrorHandler(MyReportPage)}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports"
              allowed={["implementing-partner"]}
              component={withErrorHandler(MyReportsPage)}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <Route exact path="/forbidden" component={Forbidden} />
            <Route component={NotFound} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);
