import React, { Component, Fragment } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";

import ReportComponent from "./ReportComponent";
import type { Report } from "./models";

type Props = {
  classes: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  }
});

export class HomePage extends Component<Props> {
  render() {
    const reports: Report[] = [{ grant: "Grant Mitchell" }];
    const { classes } = this.props;
    return (
      <Fragment>
        {/* Header placeholder */}
        <Grid container>
          <Grid item xs={12} style={{ backgroundColor: "#fff", height: 80 }} />
        </Grid>

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
