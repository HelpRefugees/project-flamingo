import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Grid, withStyles, Typography, Button } from "@material-ui/core";

import ReportViewComponent from "./ReportViewComponent";
import type { Account } from "../authentication/models";
import type { Report } from "./models";
import MyReportHeader from "./MyReportHeader";
import ButtonLink from "../page-layout/ButtonLink";

type Props = {
  classes: any,
  logout: () => void,
  account: Account,
  report: Report,
  history: any,
  isLoading: boolean,
  updateReport: (report: Report, errorMessage: string) => Promise<any>
};

const styles = theme => ({
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

export class MyReportReviewComponent extends Component<Props> {
  submitReport = () => {
    const { report } = this.props;
    this.props
      .updateReport(
        {
          ...report,
          completed: true
        },
        "Error submitting report"
      )
      .then(() => {
        this.props.history.push("/my-reports");
      });
  };

  render() {
    const { report, classes, isLoading, account, logout } = this.props;
    if (!report) {
      return <Redirect to="/notFound" />;
    }

    if (report.completed) {
      return <Redirect to="/my-reports" />;
    }

    return (
      <Fragment>
        <MyReportHeader account={account} logout={logout} report={report}>
          <ButtonLink
            data-test-id="report-edit-button"
            variant="outlined"
            color="primary"
            disabled={isLoading}
            to={`/my-reports/${report.id}/edit`}
            className={classes.button}
          >
            Edit
          </ButtonLink>
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
        </MyReportHeader>
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

export default withStyles(styles)(MyReportReviewComponent);
