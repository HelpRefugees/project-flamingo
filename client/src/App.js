import React, { Component, Fragment } from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";

import LoginPage from "./authentication/LoginPage";
import MyReportsPage from "./my-reports/MyReportsPage";
import ReviewReportPage from "./report/ReviewReportPage";
import ReportEditPage from "./report/ReportEditPage";
import ReportsListingPage from "./reports-listing/ReportsListingPage";
import SubmittedReportPage from "./submitted-report/SubmittedReportPage";

import type { State } from "./reducers";
import type { Account } from "./authentication/models";

import PrivateRoute from "./authorization/PrivateRoute";
import NotFound from "./authorization/NotFound";
import Forbidden from "./authorization/Forbidden";
import MyReportPage from "./my-reports/MyReportPage";

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
              path="/reports/:id"
              allowed={["help-refugees"]}
              component={SubmittedReportPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/reports"
              allowed={["help-refugees"]}
              component={ReportsListingPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports/:id/edit"
              allowed={["implementing-partner"]}
              component={ReportEditPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports/:id/review"
              allowed={["implementing-partner"]}
              component={ReviewReportPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports/:id"
              allowed={["implementing-partner"]}
              component={MyReportPage}
              isAuthenticated={this.props.isAuthenticated}
              account={this.props.account}
            />

            <PrivateRoute
              path="/my-reports"
              allowed={["implementing-partner"]}
              component={MyReportsPage}
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
