import React, { Component, Fragment } from "react";
import { Grid, Paper, Typography, withStyles } from "@material-ui/core";
import HeaderComponent from "../page-layout/HeaderComponent";

import type { Account } from "../authentication/models";

type Props = {
  classes: any,
  logout: () => void,
  account: ?Account
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  paper: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3
  },
  paperTitle: {
    color: theme.palette.primary.main,
    fontWeight: "bold"
  }
});

export class ReportsListingComponent extends Component<Props> {
  render() {
    const { classes, logout, account } = this.props;
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item container xs={10} justify="center">
            <Typography variant="h3" data-test-id="page-title">
              Reports
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Paper className={classes.paper}>
              <Typography
                data-test-id="no-reports-title"
                variant="h5"
                className={classes.paperTitle}
              >
                No submitted reports yet!
              </Typography>
              <Typography data-test-id="no-reports-message">
                Once you’ve a completed report it will appear here.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReportsListingComponent);
