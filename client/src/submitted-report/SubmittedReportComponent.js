import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import {
  Grid,
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Paper
} from "@material-ui/core";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";

import type { Account } from "../authentication/models";
import type { Report } from "../report/models";

type Props = {
  classes: any,
  logout: () => void,
  account: Account,
  reports: Report[],
  match: any
};

type State = {};

const styles = themes => ({
  appbar: {
    boxShadow: "none",
    justifyContent: "space-between",
    marginTop: "1px"
  },
  pagePaper: {
    padding: themes.spacing.unit * 4,
    boxShadow: "none"
  },
  outerContainer: {
    height: "100vh",
    margin: "5%"
  },
  headerText: {
    color: "#404040"
  },
  fontFamily: {
    fontFamily: "open Sans",
    margin: themes.spacing.unit * 0.5,
    fontWeight: "normal",
    fontStyle: "normal",
    fontStretch: "normal"
  },
  progress: {
    margin: "4px",
    fontSize: "14px",
    color: "#404040",
    letterSpacing: "0.3px"
  }
});

export class SubmittedReportComponent extends Component<Props, State> {
  get report(): Report {
    // TODO it's not very efficient to keep calling this
    return (this.props.reports.find(
      report => report.id === parseInt(this.props.match.params.id, 10)
    ): any);
  }
  render() {
    const { classes, account, logout } = this.props;
    const report = this.report;

    if (!report || !report.completed) {
      return <Redirect to="/" />;
    }

    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        <AppBar position="static" color="inherit" className={classes.appbar}>
          <Toolbar>
            <Grid container justify="space-between">
              <Grid item container direction="column" xs={3}>
                <Typography color="textSecondary" variant="caption">
                  Grant
                </Typography>
                <Typography data-test-id="grant-name">
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
                <Typography data-test-id="submission-date" align="right">
                  {report.submissionDate
                    ? moment(report.submissionDate).format("DD/MM/YYYY")
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={24}
          direction="column"
          className={classes.outerContainer}
        >
          <Grid container justify="center">
            <Grid item xs={6}>
              <Paper justify="center" className={classes.pagePaper}>
                <Grid container direction="column" spacing={32}>
                  <Grid item>
                    <h1
                      data-test-id="report-details-title"
                      className={[classes.fontFamily, classes.headerText].join(
                        " "
                      )}
                    >
                      Grant progress
                    </h1>
                  </Grid>
                  <Grid item>
                    <Typography
                      data-test-id="report-progress"
                      className={classes.progress}
                    >
                      {report.overview.split("\n").map((item, index) => (
                        <span key={index}>
                          {item}
                          <br />
                        </span>
                      ))}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SubmittedReportComponent);
