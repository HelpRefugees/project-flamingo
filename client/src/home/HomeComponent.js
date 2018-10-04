import React, { Component, Fragment } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";

import ReportComponent from "./ReportComponent";
import HeaderComponent from "./HeaderComponent";
import { Report } from "./models";

type Props = {
  classes: any,
  logout: () => void
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
  render() {
    const reports: Report[] = [{ grant: "Grant Mitchell" }];
    const { classes, logout } = this.props;
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
          <Grid item xs={10}>
            {reports.map((report, index) => (
              <ReportComponent report={report} key={index} />
            ))}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(HomeComponent);
