import React, { Component, Fragment } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";

import ReportListComponent from "./ReportListComponent";
import HeaderComponent from "./HeaderComponent";
import type { Report } from "../report/models";

export type Props = {
  classes: any,
  logout: () => void,
  loadReports: () => void,
  reports: ?(Report[]),
  updateReport: Report => void
};

type State = {
  anchorEl: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  }
});

export class HomeComponent extends Component<Props, State> {
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
    const { classes, logout, reports, updateReport } = this.props;
    return (
      <Fragment>
        <HeaderComponent logout={logout} />

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item container xs={10} justify="center">
            <Typography variant="display2" data-test-id="page-title">
              Monthly Report
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Typography variant="display1">Incomplete Reports</Typography>
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
            <Typography variant="display1">Complete Reports</Typography>
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

export default withStyles(styles)(HomeComponent);
