import React, { Component, Fragment } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";

import ReportListComponent from "./ReportListComponent";
import HeaderComponent from "./HeaderComponent";
import type { Report } from "../report/models";
import type { Account } from "../authentication/models";

export type Props = {
  classes: any,
  logout: () => void,
  loadReports: () => void,
  reports: ?(Report[]),
  updateReport: Report => void,
  account: ?Account
};

type State = {
  anchorEl: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  }
});

export class MyReportsComponent extends Component<Props, State> {
  componentWillMount() {
    this.props.loadReports();
  }

  filterReportByCompletion(isCompleted: boolean): Report[] {
    if (this.props.reports) {
      return this.props.reports.filter(
        report => report.completed === isCompleted
      );
    }

    return [];
  }

  render() {
    const { classes, logout, reports, updateReport, account } = this.props;
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item container xs={10} justify="center">
            <Typography variant="h3" data-test-id="page-title">
              Monthly Report
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Typography variant="h4">Incomplete Reports</Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10} data-test-id="incomplete-reports">
            {reports && (
              <ReportListComponent
                reports={this.filterReportByCompletion(false)}
                updateReport={updateReport}
              />
            )}
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Typography variant="h4">Complete Reports</Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10} data-test-id="completed-reports">
            {reports && (
              <ReportListComponent
                reports={this.filterReportByCompletion(true)}
                updateReport={updateReport}
              />
            )}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(MyReportsComponent);
