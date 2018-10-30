import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import {
  Grid,
  withStyles,
  AppBar,
  Toolbar,
  Typography
} from "@material-ui/core";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";
import ReportViewComponent from "../report/ReportViewComponent";
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
    if (!report) {
      return <Redirect to="/notFound" />;
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
        <ReportViewComponent report={report} />
      </Fragment>
    );
  }
}

export default withStyles(styles)(SubmittedReportComponent);
