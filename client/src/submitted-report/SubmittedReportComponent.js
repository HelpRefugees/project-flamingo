import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Grid, AppBar, Toolbar, Typography } from "@material-ui/core";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";
import ReportViewComponent from "../my-report/ReportViewComponent";
import type { Account } from "../authentication/models";
import type { Report } from "../my-report/models";

type Props = {
  logout: () => void,
  account: Account,
  reports: Report[],
  match: any
};

type State = {};

export class SubmittedReportComponent extends Component<Props, State> {
  get report(): Report {
    // TODO it's not very efficient to keep calling this
    return (this.props.reports.find(
      report => report.id === parseInt(this.props.match.params.id, 10)
    ): any);
  }

  render() {
    const { account, logout } = this.props;
    const report = this.report;
    if (!report) {
      return <Redirect to="/notFound" />;
    }
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Grid container justify="space-between">
              <Grid item container direction="column" xs={3}>
                <Typography color="textSecondary" variant="caption">
                  Grant
                </Typography>
                <Typography data-test-id="report-grant-name" variant="body1">
                  {report.grant}
                </Typography>
              </Grid>
              <Grid item container direction="column" xs={3}>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  align="right"
                >
                  Submission Date
                </Typography>
                <Typography
                  data-test-id="report-submission-date"
                  align="right"
                  variant="body1"
                >
                  {report.submissionDate
                    ? moment(report.submissionDate).format("DD/MM/YYYY")
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <ReportViewComponent report={report} />
      </Fragment>
    );
  }
}

export default SubmittedReportComponent;
