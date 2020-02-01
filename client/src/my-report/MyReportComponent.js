import React, { Component } from "react";
import { withStyles } from "@material-ui/core";

import ReportViewComponent from "./ReportViewComponent";
import { type Account } from "../authentication/models";
import { type Report } from "./models";
import MyReportHeader from "./MyReportHeader";
import ButtonLink from "../page-layout/ButtonLink";

type Props = {
  classes: any,
  logout: () => void,
  account: Account,
  report: $Shape<Report>,
  loadReport: (id: number) => Promise<any>,
  match: { params: { id: string } },
  history: any
};

type State = {};

const styles = () => ({
  button: {
    width: "120px"
  }
});

export class MyReportComponent extends Component<Props, State> {
  componentDidMount() {
    this.props
      .loadReport(parseInt(this.props.match.params.id, 10))
      .then(report => {
        if (!report) {
          this.props.history.push("/not-found");
        }
      });
  }

  render() {
    const { classes, account, logout, report } = this.props;
    if (!report) {
      return <div data-test-id="loading-placeholder">Loading...</div>;
    }
    return (
      <>
        <MyReportHeader account={account} logout={logout} report={report}>
          <ButtonLink
            variant="contained"
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
