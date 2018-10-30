import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import {
  Grid,
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Button
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
  match: any,
  history: any,
  submittedReport: boolean,
  isLoading: boolean,
  updateReport: (report: Report) => void
};

const styles = theme => ({
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
  button: {
    width: "120px",
    marginLeft: theme.spacing.unit
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  centeredTitle: {
    color: "#404040",
    textAlign: "center",
    letterSpacing: "0.3px"
  },
  centeredSubtitle: {
    color: "#989898",
    textAlign: "center",
    letterSpacing: "0.1px",
    fontSize: "14px",
    lineHeight: "1.71",
    marginTop: theme.spacing.unit
  }
});

export class ReviewReportComponent extends Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.submittedReport) {
      this.props.history.push("/myReports");
    }
  }

  get report(): Report {
    // TODO it's not very efficient to keep calling this
    return (this.props.reports.find(
      report => report.id === parseInt(this.props.match.params.id, 10)
    ): any);
  }

  redirectToEditReportPage(reportId: number) {
    this.props.history.push(`/reports/${reportId}`);
  }

  submitReport = () => {
    this.props.updateReport({
      ...this.report,
      ...this.state,
      completed: true
    });
  };

  renderToolbar = (classes: any, report: Report, isLoading: boolean) => {
    return (
      <AppBar position="static" color="inherit" className={classes.appbar}>
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
                <Typography data-test-id="grant-name">
                  {report.grant}
                </Typography>
              </Grid>
              <Grid item container direction="column" xs={3} sm={6}>
                <Typography color="textSecondary" variant="caption">
                  Period
                </Typography>
                <Typography data-test-id="report-period">
                  {moment(report.reportPeriod).format("MMMM YYYY")}
                </Typography>
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
              <Button
                data-test-id="report-edit-button"
                variant="outlined"
                color="primary"
                disabled={isLoading}
                onClick={() => this.redirectToEditReportPage(report.id)}
                className={classes.button}
              >
                Edit
              </Button>

              <Button
                data-test-id="report-submit-button"
                variant="contained"
                color="primary"
                disabled={isLoading}
                onClick={() => this.submitReport()}
                className={classes.button}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  render() {
    const { classes, account, logout, isLoading } = this.props;
    const report = this.report;
    if (!report) {
      return <Redirect to="/notFound" />;
    }

    if (report.completed) {
      return <Redirect to="/myReports" />;
    }

    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        {this.renderToolbar(classes, report, isLoading)}

        <Grid
          item
          container
          direction="column"
          className={classes.rowContainer}
        >
          <Grid item>
            <Typography
              variant="h4"
              data-test-id="page-title"
              className={classes.centeredTitle}
            >
              Review your report
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              data-test-id="page-title"
              className={classes.centeredSubtitle}
            >
              Please review all the section of your report before submitting it.
            </Typography>
          </Grid>
        </Grid>

        <ReportViewComponent report={report} />
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReviewReportComponent);
