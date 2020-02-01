import React, { Component } from "react";
import HeaderComponent from "../page-layout/HeaderComponent";
import {
  Button,
  Grid,
  withStyles,
  OutlinedInput,
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import moment from "moment";
import DropzoneComponent from "react-dropzone-component";

import ReportSectionComponent from "./ReportSectionComponent";
import { type Report } from "./models";
import ActivitiesSectionComponent from "./ActivitiesSectionComponent";
import { type Account } from "../authentication/models";
import { type KeyActivity } from "./models";

type Props = {
  classes: any,
  logout: () => void,
  updateReport: (report: $Shape<Report>, errorMessage: string) => Promise<any>,
  loadReport: (id: number) => Promise<any>,
  match: { params: { id: string } },
  report: $Shape<Report>,
  history: any,
  account: Account,
  isLoading: boolean,
  loadSectors: () => void,
  sectors: string[]
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
    marginLeft: 0
  },
  headerText: {
    color: "#404040",
    fontSize: "24px"
  },
  outerContainer: {
    height: "100vh",
    marginTop: themes.spacing.unit * 5,
    width: "100%"
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
  materialsForFundraising?: string,
  attachments: any[],
  dialogOpen: boolean,
  dialogTrigger: string
};

const sectionConfiguration = {
  grantProgress: {
    key: "grant-progress",
    stateProperty: "overview",
    title: "Grant progress",
    subtitle:
      "Please give a very brief overview of your project and progress since the last report.",
    inputKey: "report-progress-input",
    placeholder: "Please add an overview",
    optional: false
  },

  operatingEnvironment: {
    key: "operating-environment",
    stateProperty: "operatingEnvironment",
    title: "Operating environment",
    subtitle:
      "Outline any notable changes you have experienced to the context in which you work.",
    inputKey: "operating-environment-input",
    placeholder: "Please add an overview",
    optional: true
  },

  beneficiaryFeedback: {
    key: "beneficiary-feedback",
    stateProperty: "beneficiaryFeedback",
    title: "Beneficiary Feedback",
    subtitle:
      "Have you had any feedback from beneficiaries about the service/activities you offer?",
    inputKey: "beneficiary-feedback-input",
    placeholder: "Please add an overview",
    optional: true
  },

  challengesFaced: {
    key: "challenges-faced",
    stateProperty: "challengesFaced",
    title: "Challenges faced",
    subtitle:
      "Please use this section to describe any other challenges you may have faced in the last month e.g. legal, financial etc...",
    inputKey: "challenges-faced-input",
    placeholder: "Please add an overview",
    optional: true
  },

  incidents: {
    key: "incidents",
    stateProperty: "incidents",
    title: "Incidents and near misses",
    subtitle:
      "Please describe any incidents or near misses that may have occurred related to health & safety, safeguarding, protection or security. How was the incident resolved and what policy or procedure is in place to avoid this reoccurring?",
    inputKey: "incidents-input",
    placeholder: "Please add an overview",
    optional: true
  },

  otherIssues: {
    key: "other-issues",
    stateProperty: "otherIssues",
    title:
      "Is there anything you would like to use our platform to speak about?",
    subtitle:
      "Are there any issues, news or recent developments that you would like to amplify through our networks? We are always keen to hear about ways we can advocate for change, please contact us to discuss.",
    inputKey: "other-issues-input",
    placeholder: "Please add an overview",
    optional: true
  },

  materialsForFundraising: {
    key: "materials-for-fundraising",
    stateProperty: "materialsForFundraising",
    title: "Materials for fundraising",
    subtitle:
      "We depend on high quality images, film footage, copy and testimonials to raise funds and recruit volunteers. We are always keen to hear about ways we can advocate for change, please contact us to discuss.",
    inputKey: "materials-for-fundraising-input",
    placeholder: "Please add an overview",
    optional: true
  }
};

export class MyReportEditComponent extends Component<Props, State> {
  componentDidMount() {
    this.props.loadSectors();
    this.props
      .loadReport(parseInt(this.props.match.params.id, 10))
      .then(report => {
        if (!report) {
          this.props.history.push("/not-found");
        } else {
          this.setState({ ...report, dialogOpen: false, dialogTrigger: "" });
        }
      });
  }

  dropzone: any = null;

  get dropZoneConfig() {
    return {
      postUrl: `/api/reports/uploadhandler/${this.props.report.id}`,
      iconFiletypes: [".jpg", ".png", ".gif"],
      showFiletypeIcon: true
    };
  }

  get dropZonedJsConfig() {
    return {
      autoProcessQueue: true,
      addRemoveLinks: true,
      acceptedFiles: "image/jpeg,image/png,image/gif"
    };
  }

  get dropZoneEventHandlers() {
    return {
      init: (dz: any) => {
        this.dropzone = dz;
        // this.dropzone.files = this.state.attachments;
        if (this.state.attachments.length > 0)
          this.state.attachments.forEach(attachment => {
            this.dropzone.emit("addedfile", attachment);
            this.dropzone.emit("thumbnail", attachment, attachment.dataURL);
            this.dropzone.emit("complete", attachment);
            this.dropzone.emit("success", attachment);
          });
        // this.dropzone.options.maxFiles =
        //   this.dropzone.options.maxFiles - this.state.attachments.length;
        // this.dropzone.files = this.state.attachments;
      },
      addedfile: (file: any) => {},
      success: (file: any) => {
        let attachments: Array<any> = this.state.attachments
          ? this.state.attachments
          : [];
        this.setState({
          attachments: [
            ...attachments,
            {
              fileName: file.name,
              dataURL: file.dataURL,
              type: file.type,
              size: file.size
            }
          ]
        });
      },
      removedfile: (file: any) => {
        const attachments: Array<any> = this.state.attachments.filter(
          attachment => attachment.fileName !== file.fileName
        );
        this.setState({
          attachments: [...attachments]
        });
      }
    };
  }

  get emptyState() {
    return !this.state || Object.keys(this.state).length === 0;
  }

  reviewAndSubmitReport = () => {
    const { report } = this.props;
    const { dialogOpen, dialogTrigger, ...newReport } = this.state;
    this.props
      .updateReport(
        {
          ...report,
          ...newReport
        },
        "Error saving report"
      )
      .then(() => this.props.history.push(`/my-reports/${report.id}/review`));
  };

  saveReport = (fieldName: string) => {
    return () => {
      const { report } = this.props;
      this.props.updateReport(
        {
          ...report,
          [fieldName]: this.state[fieldName]
        },
        "Error saving report"
      );
    };
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

  openUnsavedDialog = (dialogTriggerr: string) => {
    this.setState({ dialogOpen: true, dialogTrigger: dialogTriggerr });
  };

  renderDialog() {
    return (
      <Dialog
        open={this.state.dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hey, you have unsaved changes
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to save it now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.setState({ dialogOpen: false });
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const { report } = this.props;
              const { dialogOpen, dialogTrigger, ...newReport } = this.state;
              this.props
                .updateReport(
                  {
                    ...report,
                    ...newReport
                  },
                  "Error saving report"
                )
                .then(() => {
                  if (this.state.dialogTrigger === "logout") {
                    this.props.logout();
                  } else if (this.state.dialogTrigger === "logo") {
                    this.props.history.push("/");
                  }
                });
            }}
            color="primary"
            autoFocus
          >
            Save & Exit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  checkSaved() {
    // true if no changes, false if   changed
    const { isLoading, report } = this.props;
    const { dialogOpen, dialogTrigger, ...newReport } = this.state;

    const allSaved = (old, newObj) =>
      Object.entries(old).every(([key, value]) => {
        if (key === "attachments") {
          return newObj.attachments.length === old.attachments.length;
        }
        if (typeof value === "object") {
          return allSaved(newObj[key], old[key]);
        }
        return old[key] === newObj[key];
      });
    return allSaved(newReport, report) || isLoading;
  }

  renderToolbar = (classes: any, report: $Shape<Report>) => {
    return (
      <AppBar position="static" color="inherit">
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
                <Typography data-test-id="report-grant-name" variant="body1">
                  {report.grant}
                </Typography>
              </Grid>
              <Grid item container direction="column" xs={3} sm={6}>
                <Typography color="textSecondary" variant="caption">
                  Period
                </Typography>
                <Typography data-test-id="report-period" variant="body1">
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
                data-test-id="report-review-and-submit-button"
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
    const { report, isLoading } = this.props;
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
          value={this.state[stateProperty] || ""}
          multiline
          rows={10}
          rowsMax={100}
          labelWidth={0}
          onChange={this.onSectionInputChange(stateProperty)}
        />
      </ReportSectionComponent>
    );
  }

  activitiesAreEqual(first: KeyActivity[], second: KeyActivity[]): boolean {
    if (first.length !== second.length) {
      return false;
    }
    for (let index = 0; index < first.length; index++) {
      for (let field of [
        "activityName",
        "numberOfParticipants",
        "demographicInfo",
        "impactOutcome"
      ]) {
        if (first[index][field] !== second[index][field]) {
          return false;
        }
      }
    }
    return true;
  }

  renderKeyActivitiesSection() {
    const { report, isLoading } = this.props;
    return (
      <ActivitiesSectionComponent
        activities={this.state.keyActivities}
        disabled={this.activitiesAreEqual(
          this.state.keyActivities,
          report.keyActivities
        )}
        isLoading={isLoading}
        onChange={this.onSectionInputChange("keyActivities")}
        onSave={this.saveReport("keyActivities")}
        sectors={this.props.sectors}
      />
    );
  }
  logout = () => {
    if (this.checkSaved()) {
      this.props.logout();
    } else {
      this.openUnsavedDialog("logout");
    }
  };
  render() {
    const { report, classes, account } = this.props;
    if (!report || this.emptyState) {
      return <div data-test-id="loading-placeholder">Loading...</div>;
    }

    if (report.completed) {
      return <Redirect to="/my-reports" />;
    }
    const isDisabled =
      this.state.attachments.length === report.attachments.length;
    return (
      <>
        <HeaderComponent
          logout={this.logout}
          account={account}
          navigateToHome={() => {
            if (this.checkSaved()) {
              this.props.history.push("/");
            } else {
              this.openUnsavedDialog("logo");
            }
          }}
        />
        {this.renderToolbar(classes, report)}
        <Grid container spacing={24} className={classes.outerContainer}>
          <Grid container justify="center">
            <Grid item xs={6}>
              {this.renderTextareaSection(sectionConfiguration.grantProgress)}
              {this.renderTextareaSection(
                sectionConfiguration.operatingEnvironment
              )}
              {this.renderKeyActivitiesSection()}
              {this.renderTextareaSection(
                sectionConfiguration.beneficiaryFeedback
              )}
              {this.renderTextareaSection(sectionConfiguration.challengesFaced)}
              {this.renderTextareaSection(sectionConfiguration.incidents)}
              {this.renderTextareaSection(sectionConfiguration.otherIssues)}
              {this.renderTextareaSection(
                sectionConfiguration.materialsForFundraising
              )}
              <ReportSectionComponent
                data-test-id={"upload"}
                title={"Attach files"}
                subtitle={""}
                disabled={isDisabled}
                onSave={this.saveReport("attachments")}
                optional={true}
              >
                <DropzoneComponent
                  config={this.dropZoneConfig}
                  eventHandlers={this.dropZoneEventHandlers}
                  djsConfig={this.dropZonedJsConfig}
                />
              </ReportSectionComponent>
            </Grid>
          </Grid>
        </Grid>
        <div>{this.renderDialog()}</div>
      </>
    );
  }
}

export default withStyles(styles)(MyReportEditComponent);
