import React, { Component, Fragment } from "react";
import HeaderComponent from "../home/HeaderComponent";
import {
  Button,
  Grid,
  Paper,
  withStyles,
  OutlinedInput,
  AppBar,
  Toolbar,
  Typography
} from "@material-ui/core";
import type { Report } from "./models";

type Props = {
  classes: any,
  logout: () => void,
  updateReport: (report: Report) => void,
  match: any,
  reports: Report[],
  history: any
};

const styles = themes => ({
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

interface State {
  overview: string;
}

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
      completed: true,
      submissionDate: new Date()
    });

    this.props.history.push("/");
  };

  changeReportProgress = (event: Event) => {
    this.setState({
      overview: (event.target: window.HTMLInputElement).value
    });
  };

  render() {
    const { classes } = this.props;
    const report = this.report;

    return (
      <Fragment>
        <HeaderComponent logout={this.props.logout} />
        <AppBar position="static" color="inherit" className={classes.appbar}>
          <Toolbar>
            <Grid container justify="space-between" alignItems="center">
              <Grid item container direction="column" xs={3}>
                <Typography color="textSecondary" variant="caption">
                  Grant
                </Typography>
                <Typography data-test-id="grant-name">
                  {report.grant}
                </Typography>
              </Grid>
              <Button
                data-test-id="report-submit-button"
                variant="contained"
                color="primary"
                disabled={this.state.overview === ""}
                onClick={() => this.submitReport()}
              >
                Submit
              </Button>
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
                    <OutlinedInput
                      data-test-id="report-progress-input"
                      className={classes.overviewInput}
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
                  </Grid>
                  <Grid item>
                    <Button
                      data-test-id="report-save-button"
                      color="primary"
                      variant="outlined"
                      disabled={this.state.overview === report.overview}
                      fullWidth={false}
                      onClick={() => this.saveReport()}
                    >
                      Save
                    </Button>
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

export default withStyles(styles)(ReportComponent);
