import React, { Component } from "react";
import { AppBar, Grid, Toolbar, Typography, Button } from "@material-ui/core";
import moment from "moment";
import { Packer } from "docx";
import { saveAs } from "file-saver";

import HeaderComponent from "../page-layout/HeaderComponent";
import ReportViewComponent from "../my-report/ReportViewComponent";
import { type Account } from "../authentication/models";
import { type Report } from "../my-report/models";
import { ReportCreator } from "../doc-creator/report-creator";

type Props = {
  logout: () => void,
  account: Account,
  report: $Shape<Report>,
  match: any,
  loadReport: number => Promise<any>,
  history: any
};

export class SubmittedReportComponent extends Component<Props> {
  componentDidMount() {
    this.props
      .loadReport(parseInt(this.props.match.params.id, 10))
      .then(loaded => {
        if (!loaded) {
          this.props.history.push("/not-found");
        }
      });
  }

  render() {
    const { account, logout, report } = this.props;
    if (!report) {
      return <div data-test-id="loading-placeholder">Loading...</div>;
    }
    return (
      <>
        <HeaderComponent logout={logout} account={account} />
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Grid container justify="space-between">
              <Grid item container direction="column" xs={3}>
                <Typography color="textSecondary" variant="caption">
                  Grant
                </Typography>
                <Typography data-test-id="report-grant-name" variant="body1">
                  {report.grant}
                </Typography>
              </Grid>
              <Grid item container direction="column" xs={3}>
                <Button
                  color="primary"
                  onClick={() => {
                    let reportCreator = new ReportCreator();
                    let report = reportCreator.create(this.props.report);
                    const packer = new Packer();

                    packer.toBlob(report).then(blob => {
                      saveAs(blob, "report.docx");
                    });
                  }}
                >
                  Download Report
                </Button>
              </Grid>
              <Grid item container direction="column" xs={3}>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  align="right"
                >
                  Submission Date
                </Typography>
                <Typography
                  data-test-id="report-submission-date"
                  align="right"
                  variant="body1"
                >
                  {report.submissionDate
                    ? moment(report.submissionDate).format("DD/MM/YYYY")
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <ReportViewComponent report={report} />
      </>
    );
  }
}

export default SubmittedReportComponent;
