import React, { Component } from "react";
import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";
import { type Report } from "./models";
import { type Account } from "../authentication/models";

type Props = {
  report: $Shape<Report>,
  account: Account,
  logout: () => void,
  children: any
};

export class MyReportHeader extends Component<Props> {
  renderReportPeriod() {
    const { report } = this.props;
    return (
      <>
        <Typography color="textSecondary" variant="caption">
          Period
        </Typography>
        <Typography data-test-id="report-period" variant="body1">
          {moment(report.reportPeriod).format("MMMM YYYY")}
        </Typography>
      </>
    );
  }

  renderSubmissionDate() {
    const { report } = this.props;
    return (
      <>
        <Typography color="textSecondary" variant="caption">
          Submission date
        </Typography>
        <Typography data-test-id="report-submission-date" variant="body1">
          {moment(report.submissionDate).format("DD/MM/YYYY")}
        </Typography>
      </>
    );
  }

  render() {
    const { account, logout, report, children } = this.props;
    return (
      <>
        <HeaderComponent logout={logout} account={account} />
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Grid container direction="row" justify="space-between">
              <Grid
                item
                container
                direction="row"
                xs={8}
                sm={6}
                lg={3}
                justify="flex-start"
              >
                <Grid item container direction="column" xs={3} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Grant
                  </Typography>
                  <Typography data-test-id="report-grant-name" variant="body1">
                    {report.grant}
                  </Typography>
                </Grid>
                <Grid item container direction="column" xs={3} sm={6}>
                  {report.submissionDate
                    ? this.renderSubmissionDate()
                    : this.renderReportPeriod()}
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="row"
                xs={4}
                sm={6}
                lg={3}
                justify="flex-end"
              >
                {children}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </>
    );
  }
}

export default MyReportHeader;
