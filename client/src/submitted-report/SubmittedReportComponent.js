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
  definitionListTitle: {
    fontSize: "10px",
    letterSpacing: "1.5px",
    color: "#757c80",
    textTransform: "uppercase",
    marginBottom: "8px",
    borderTop: "solid 1px #e5e5e5",
    paddingTop: "16px"
  },
  definitonListItem: {
    fontSize: "14px",
    lineHeight: "1.43",
    color: "#393e40",
    margin: "0 0 24px"
  },
  activityName: {
    fontFamily: "open sans",
    fontWeight: "600",
    fontSize: "20px",
    color: "#393e40"
  },
  appbar: {
    boxShadow: "none",
    justifyContent: "space-between",
    marginTop: "1px"
  },
  pagePaper: {
    padding: themes.spacing.unit * 4,
    boxShadow: "none",
    marginBottom: themes.spacing.unit
  },
  outerContainer: {
    height: "100vh",
    margin: "5%"
  },
  headerText: {
    color: "#404040"
  },
  rule: {
    marginTop: themes.spacing.unit * 2,
    borderTop: "solid 1px #e5e5e5",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    height: "1px",
    position: "relative",
    left: "-32px",
    width: "calc(100% + 2 * 32px)"
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

  formatParagraph(content?: string): ?any {
    return (content || "").split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  }

  renderGrantProgress() {
    const { classes } = this.props;
    const report = this.report;
    return (
      <Paper
        justify="center"
        className={classes.pagePaper}
        data-test-id="grant-progress"
      >
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <h1
              data-test-id="report-section-title"
              className={[classes.fontFamily, classes.headerText].join(" ")}
            >
              Grant overview
            </h1>
            <hr className={classes.rule} />
          </Grid>
          <Grid item>
            <Typography
              data-test-id="report-progress"
              className={classes.progress}
            >
              {this.formatParagraph(report.overview)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  renderKeyActivities() {
    const report = this.report;
    const { classes } = this.props;
    return (
      <Paper
        justify="center"
        className={classes.pagePaper}
        data-test-id="grant-key-activities"
      >
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <h1
              data-test-id="report-section-title"
              className={[classes.fontFamily, classes.headerText].join(" ")}
            >
              Key activities & impact
            </h1>
            <hr className={classes.rule} />
          </Grid>
          <Grid item>
            <Typography
              data-test-id="report-key-activity-name"
              className={classes.activityName}
            >
              {report.keyActivity.activityName}
            </Typography>
            <dl>
              <dt className={classes.definitionListTitle}>
                Average number of participants
              </dt>
              <dd
                data-test-id="report-number-of-participants"
                className={classes.definitonListItem}
              >
                {report.keyActivity.numberOfParticipants}
              </dd>
              <dt className={classes.definitionListTitle}>
                Demographic information
              </dt>
              <dd
                data-test-id="report-demographic-info"
                className={classes.definitonListItem}
              >
                {report.keyActivity.demographicInfo}
              </dd>
              <dt className={classes.definitionListTitle}>
                Positive impacts and outcome
              </dt>
              <dd
                data-test-id="report-impact-outcome"
                className={classes.definitonListItem}
              >
                {this.formatParagraph(report.keyActivity.impactOutcome)}
              </dd>
            </dl>
          </Grid>
        </Grid>
      </Paper>
    );
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
              {this.renderGrantProgress()}
              {this.renderKeyActivities()}
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SubmittedReportComponent);
