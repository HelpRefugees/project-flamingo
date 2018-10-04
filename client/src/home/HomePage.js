import React, { Component, Fragment } from "react";
import {
  Grid,
  Typography,
  withStyles,
  AppBar,
  Toolbar
} from "@material-ui/core";

import ReportComponent from "./ReportComponent";
import type { Report } from "./models";

type Props = {
  classes: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  header: {
    boxShadow: "none"
  },
  headerLogo: {
    margin: theme.spacing.unit,
    height: theme.spacing.unit * 8
  }
});

export class HomePage extends Component<Props> {
  render() {
    const reports: Report[] = [{ grant: "Grant Mitchell" }];
    const { classes } = this.props;
    return (
      <Fragment>
        <AppBar position="static" color="inherit" className={classes.header}>
          <Toolbar>
            <img
              src="logo.png"
              alt="Help Refugees Logo"
              className={classes.headerLogo}
            />
          </Toolbar>
        </AppBar>

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

export default withStyles(styles)(HomePage);
