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
import { Redirect } from "react-router-dom";
import moment from "moment";

import ReportSectionComponent from "./ReportSectionComponent";

import type { Report } from "./models";
import ActivitiesSectionComponent from "./ActivitiesSectionComponent";
import { type Account } from "../authentication/models";
import { type KeyActivity } from "./models";

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
  headerText: {
    color: "#404040",
    fontSize: "24px"
  },
  outerContainer: {
    height: "100vh",
    marginTop: themes.spacing.unit * 5
  },
  appbar: {
    boxShadow: "none",
    justifyContent: "space-between",
    marginTop: "1px"
  }
});

type State = {
  overview: string,
  keyActivities: KeyActivity[],
  operatingEnvironment?: string,
  beneficiaryFeedback?: string,
  challengesFaced?: string,
  incidents?: string,
  otherIssues?: string,
  materialsForFundraising?: string
};

export class ReportComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.report
    };
  }

  componentWillMount() {
    if (this.report.completed) {
      this.props.history.push("/myReports");
    }
  }

  get report(): Report {
    // TODO it's not very efficient to keep calling this
    return (this.props.reports.find(
      report => report.id === parseInt(this.props.match.params.id, 10)
    ): any);
  }

  reviewAndSubmitReport = () => {
    this.props.updateReport({
      ...this.report,
      ...this.state
    });

    this.props.history.push(`/reviewReports/${this.report.id}`);
  };

  saveReport = (fieldName: string) => {
    return () =>
      this.props.updateReport({
        ...this.report,
        [fieldName]: this.state[fieldName]
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
          <Grid container justify="space-between">
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
                data-test-id="report-submit-button"
                variant="contained"
                color="primary"
                disabled={this.isSubmitDisabled()}
                onClick={() => this.reviewAndSubmitReport()}
              >
                Review & submit
              </Button>
            </Grid>
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
        onSave={this.saveReport(stateProperty)}
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

    return (
      <ActivitiesSectionComponent
        data-test-id="key-activities"
        activities={this.state.keyActivities}
        isLoading={isLoading}
        onChange={this.onSectionInputChange("keyActivities")}
        onSave={this.saveReport("keyActivities")}
      />
    );
  }

  render() {
    const { classes, account, logout, isLoading } = this.props;
    const report = this.report;

    if (!report) {
      return <Redirect to="/notFound" />;
    }

    if (report.completed) {
      return <Redirect to="/myReports" />;
    }

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

    const incidents = {
      key: "incidents",
      stateProperty: "incidents",
      title: "Incidents and near misses",
      subtitle:
        "Please describe any incidents or near misses that may have occurred related to health & safety, safeguarding, protection or security. How was the incident resolved and what policy or procedure is in place to avoid this reoccurring?",
      inputKey: "incidents-input",
      placeholder: "Please add an overview",
      optional: true
    };

    const otherIssues = {
      key: "other-issues",
      stateProperty: "otherIssues",
      title:
        "Is there anything you would like to use our platform to speak about?",
      subtitle:
        "Are there any issues, news or recent developments that you would like to amplify through our networks? We are always keen to hear about ways we can advocate for change, please contact us to discuss.",
      inputKey: "other-issues-input",
      placeholder: "Please add an overview",
      optional: true
    };

    const materialsForFundraising = {
      key: "materials-for-fundraising",
      stateProperty: "materialsForFundraising",
      title: "Materials for fundraising",
      subtitle:
        "We depend on high quality images, film footage, copy and testimonials to raise funds and recruit volunteers. We are always keen to hear about ways we can advocate for change, please contact us to discuss.",
      inputKey: "materials-for-fundraising-input",
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
              {this.renderTextareaSection(incidents)}
              {this.renderTextareaSection(otherIssues)}
              {this.renderTextareaSection(materialsForFundraising)}
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReportComponent);
