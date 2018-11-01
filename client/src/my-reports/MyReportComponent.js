import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core";

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
};

type State = {};

const styles = () => ({
  button: {
    width: "120px",
  },
});

export class MyReportComponent extends Component<Props, State> {
  render() {
    const { classes, account, logout, report } = this.props;
    if (!report) {
      return <Redirect to="/notFound" />;
    }
    return (
      <>
        <MyReportHeader account={account} logout={logout} report={report}>
          <ButtonLink variant="contained"
            color="primary"
            data-test-id="report-back-button"
            to="/my-reports"
            className={classes.button}
          >
            Back
          </ButtonLink>
        </MyReportHeader>
        <ReportViewComponent report={report} />
      </>
    );
  }
}

export default withStyles(styles)(MyReportComponent);
