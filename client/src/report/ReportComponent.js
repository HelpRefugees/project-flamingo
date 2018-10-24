import React, { Component, Fragment } from "react";
import HeaderComponent from "../page-layout/HeaderComponent";
import {
  Button,
  Grid,
  withStyles,
  OutlinedInput,
  AppBar,
  Toolbar,
  Typography
} from "@material-ui/core";

import ReportSectionComponent from "./ReportSectionComponent";

import type { Report } from "./models";
import type { Account } from "../authentication/models";

type Props = {
  classes: any,
  logout: () => void,
  updateReport: (report: Report) => void,
  match: any,
  reports: Report[],
  history: any,
  account: Account,
  isLoading: boolean
};

const styles = themes => ({
  outerContainer: {
    height: "100vh",
    margin: "5%"
  },
  appbar: {
    boxShadow: "none",
    justifyContent: "space-between",
    marginTop: "1px"
  },
  fontFamily: {
    fontFamily: "open Sans",
    margin: themes.spacing.unit * 0.5,
    fontWeight: "normal",
    fontStyle: "normal",
    fontStretch: "normal"
  }
});

type State = {
  overview: string
};

export class ReportComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      overview: this.report.overview
    };
  }

  get report(): Report {
    // TODO it's not very efficient to keep calling this
    return (this.props.reports.find(
      report => report.id === parseInt(this.props.match.params.id, 10)
    ): any);
  }

  saveReport = () => {
    this.props.updateReport({
      ...this.report,
      overview: this.state.overview
    });
  };

  submitReport = () => {
    this.props.updateReport({
      ...this.report,
      overview: this.state.overview,
      completed: true
    });

    this.props.history.push("/myReports");
  };

  changeReportProgress = (event: Event) => {
    this.setState({
      overview: (event.target: window.HTMLInputElement).value
    });
  };

  renderToolbar = (classes: any, report: Report, isLoading: boolean) => {
    return (
      <AppBar position="static" color="inherit" className={classes.appbar}>
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item container direction="column" xs={3}>
              <Typography color="textSecondary" variant="caption">
                Grant
              </Typography>
              <Typography data-test-id="grant-name">{report.grant}</Typography>
            </Grid>
            <Button
              data-test-id="report-submit-button"
              variant="contained"
              color="primary"
              disabled={isLoading || this.state.overview === ""}
              onClick={() => this.submitReport()}
            >
              Submit
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  render() {
    const { classes, account, logout, isLoading } = this.props;
    const report = this.report;

    const subtitle
      = "Please give a very brief overview of your project and progress since the last report.";

    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />

        {this.renderToolbar(classes, report, isLoading)}

        <Grid
          container
          spacing={24}
          direction="column"
          className={classes.outerContainer}
        >
          <Grid container justify="center">
            <Grid item xs={6}>
              <ReportSectionComponent
                data-test-id="grant-progress"
                title="Grant progress"
                subtitle={subtitle}
                disabled={isLoading || this.state.overview === report.overview}
                onSave={this.saveReport.bind(this)}
              >
                <OutlinedInput
                  data-test-id="report-progress-input"
                  fullWidth={true}
                  id="component-outlined"
                  placeholder="Please add an overview"
                  value={this.state.overview}
                  multiline
                  rows={10}
                  rowsMax={100}
                  labelWidth={0}
                  onChange={event => this.changeReportProgress(event)}
                />
              </ReportSectionComponent>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReportComponent);
