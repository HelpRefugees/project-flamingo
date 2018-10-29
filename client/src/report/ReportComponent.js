import React, { Component, Fragment } from "react";
import HeaderComponent from "../page-layout/HeaderComponent";
import {
  Button,
  Grid,
  withStyles,
  OutlinedInput,
  AppBar,
  Toolbar,
  Typography,
  InputLabel
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
  isLoading: boolean,
  submittedReport: boolean
};

const styles = themes => ({
  input: {
    marginBottom: themes.spacing.unit * 2
  },
  label: {
    textTransform: "uppercase",
    fontSize: "10px",
    marginBottom: themes.spacing.unit,
    display: "block",
    marginLeft: 0,
    fontFamily: "open Sans"
  },
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
    fontWeight: "normal",
    fontStyle: "normal",
    fontStretch: "normal"
  }
});

type State = {
  overview: string,
  keyActivity: {
    activityName?: string,
    numberOfParticipants?: string,
    demographicInfo?: string,
    impactOutcome?: string
  },
  operatingEnvironment?: string,
  beneficiaryFeedback?: string
};

export class ReportComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.report
    };
  }

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

  saveReport = () => {
    this.props.updateReport({
      ...this.report,
      ...this.state
    });
  };

  submitReport = () => {
    this.props.updateReport({
      ...this.report,
      ...this.state,
      completed: true
    });
  };

  changeReportProgress = (event: Event) => {
    this.setState({
      overview: (event.target: window.HTMLInputElement).value
    });
  };

  isSubmitDisabled() {
    const { isLoading } = this.props;
    const requiredFields = ({ overview }) => ({ overview });
    const allBlank = object =>
      Object.entries(object).every(([key, value]) => {
        if (typeof value === "object") {
          return allBlank(value);
        }
        return value === "" || value === undefined;
      });

    return isLoading || allBlank(requiredFields(this.state));
  }

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
              disabled={this.isSubmitDisabled()}
              onClick={() => this.submitReport()}
            >
              Submit
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  onSectionInputChange(
    key: string,
    sectionName?: string
  ): (event: Event) => void {
    return (event: Event) => {
      if (sectionName !== undefined) {
        const section = this.state[sectionName];
        this.setState({
          ...this.state,
          [sectionName]: {
            ...section,
            [key]: (event.target: window.HTMLInputElement).value
          }
        });
      } else {
        this.setState({
          ...this.state,
          [key]: (event.target: window.HTMLInputElement).value
        });
      }
    };
  }

  isSaveButtonDisabled({
    reportPropertyValue,
    statePropertyValue,
    isLoading
  }: any) {
    return isLoading || statePropertyValue === reportPropertyValue;
  }

  renderTextareaSection({
    key,
    stateProperty,
    title,
    subtitle,
    inputKey,
    placeholder,
    optional
  }: any) {
    const report = this.report;
    const { isLoading } = this.props;
    const isDisabled = this.isSaveButtonDisabled({
      reportPropertyValue: report[stateProperty],
      statePropertyValue: this.state[stateProperty],
      isLoading
    });
    return (
      <ReportSectionComponent
        data-test-id={key}
        title={title}
        subtitle={subtitle}
        disabled={isDisabled}
        onSave={() => this.saveReport()}
        optional={optional}
      >
        <OutlinedInput
          data-test-id={inputKey}
          fullWidth={true}
          id="component-outlined"
          placeholder={placeholder}
          value={this.state[stateProperty]}
          multiline
          rows={10}
          rowsMax={100}
          labelWidth={0}
          onChange={this.onSectionInputChange(stateProperty)}
        />
      </ReportSectionComponent>
    );
  }

  renderKeyActivitiesSection() {
    const { classes, isLoading } = this.props;
    const fields = [
      "activityName",
      "numberOfParticipants",
      "demographicInfo",
      "impactOutcome"
    ];

    const report = this.report;
    const hasChanged = fields.some(
      (field: string) =>
        this.state.keyActivity[field] !== report.keyActivity[field]
    );

    const isDisabled = isLoading || !hasChanged;

    return (
      <ReportSectionComponent
        data-test-id="key-activities"
        title="Key Activities"
        subtitle="Please describe the activities you have done this month."
        disabled={isDisabled}
        onSave={this.saveReport.bind(this)}
      >
        <InputLabel className={classes.label}>Name of the activity</InputLabel>
        <OutlinedInput
          onChange={this.onSectionInputChange("activityName", "keyActivity")}
          className={classes.input}
          value={this.state.keyActivity.activityName}
          fullWidth={true}
          labelWidth={0}
          placeholder="Add a title"
          data-test-id="report-activity-name-input"
        />
        <InputLabel className={classes.label}>
          Average number of participants
        </InputLabel>
        <OutlinedInput
          onChange={this.onSectionInputChange(
            "numberOfParticipants",
            "keyActivity"
          )}
          className={classes.input}
          value={this.state.keyActivity.numberOfParticipants}
          fullWidth={true}
          labelWidth={0}
          placeholder="Add a number of participants"
          data-test-id="report-participants-number-input"
          type="number"
        />
        <InputLabel className={classes.label}>Demographic info</InputLabel>
        <OutlinedInput
          onChange={this.onSectionInputChange("demographicInfo", "keyActivity")}
          className={classes.input}
          value={this.state.keyActivity.demographicInfo}
          fullWidth={true}
          labelWidth={0}
          multiline
          rows={2}
          placeholder="Please add an overview"
          data-test-id="report-demographic-info-input"
        />
        <InputLabel className={classes.label}>
          Positive Impacts & outcome
        </InputLabel>
        <OutlinedInput
          onChange={this.onSectionInputChange("impactOutcome", "keyActivity")}
          className={classes.input}
          value={this.state.keyActivity.impactOutcome}
          fullWidth={true}
          labelWidth={0}
          multiline
          rows={10}
          rowsMax={20}
          placeholder="Please add an overview"
          data-test-id="report-impact-outcome-input"
        />
      </ReportSectionComponent>
    );
  }

  render() {
    const { classes, account, logout, isLoading } = this.props;
    const report = this.report;

    const grantProgress = {
      key: "grant-progress",
      stateProperty: "overview",
      title: "Grant progress",
      subtitle:
        "Please give a very brief overview of your project and progress since the last report.",
      inputKey: "report-progress-input",
      placeholder: "Please add an overview",
      optional: false
    };

    const operatingEnvironment = {
      key: "operating-environment",
      stateProperty: "operatingEnvironment",
      title: "Operating environment",
      subtitle:
        "Outline any notable changes you have experienced to the context in which you work.",
      inputKey: "operating-environment-input",
      placeholder: "Please add an overview",
      optional: true
    };

    const beneficiaryFeedback = {
      key: "beneficiary-feedback",
      stateProperty: "beneficiaryFeedback",
      title: "Beneficiary Feedback",
      subtitle:
        "Have you had any feedback from beneficiaries about the service/activities you offer?",
      inputKey: "beneficiary-feedback-input",
      placeholder: "Please add an overview",
      optional: true
    };

    const challengesFaced = {
      key: "challenges-faced",
      stateProperty: "challengesFaced",
      title: "Challenges faced",
      subtitle:
        "Please use this section to describe any other challenges you may have faced in the last month e.g. legal, financial etc...",
      inputKey: "challenges-faced-input",
      placeholder: "Please add an overview",
      optional: true
    };

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
              {this.renderTextareaSection(grantProgress)}
              {this.renderTextareaSection(operatingEnvironment)}
              {this.renderKeyActivitiesSection()}
              {this.renderTextareaSection(beneficiaryFeedback)}
              {this.renderTextareaSection(challengesFaced)}
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReportComponent);
