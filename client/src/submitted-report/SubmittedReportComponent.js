import React, { Component, Fragment } from "react";
import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";
import ReportViewComponent from "../my-report/ReportViewComponent";
import type { Account } from "../authentication/models";
import type { Report } from "../my-report/models";

type Props = {
  logout: () => void,
  account: Account,
  report: Report,
  match: any,
  loadReport: number => Promise<any>,
  history: any
};

export class SubmittedReportComponent extends Component<Props> {
  componentWillMount() {
    this.props
      .loadReport(parseInt(this.props.match.params.id, 10))
      .then(loaded => {
        if (!loaded) {
          this.props.history.push("/notFound");
        }
      });
  }

  render() {
    const { account, logout, report } = this.props;
    if (!report) {
      return <div data-test-id="loading-placeholder">Loading...</div>;
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
