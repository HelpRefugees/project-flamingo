import React, { Component } from "react";
import {
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  withStyles,
  Select,
  MenuItem,
  FormControl
} from "@material-ui/core";

import { type KeyActivity, type DemographicInfo } from "./models";

export type Props = {
  classes: any,
  activities: KeyActivity[],
  onChange: (event: { target: { value: KeyActivity[] } }) => void,
  onSave: (key: string) => void,
  disabled: boolean,
  isLoading: boolean,
  sectors: string[]
};

export type State = {
  activities: KeyActivity[]
};

export class ActivitiesSectionComponent extends Component<Props, State> {
  onSubsectionChange = (updatedIndex: number, updatedActivity: KeyActivity) => {
    this.updateActivities(
      this.props.activities.map((activity: KeyActivity, index: number) => {
        if (index === updatedIndex) {
          return updatedActivity;
        }
        return activity;
      })
    );
  };

  onSubsectionAddition = () => {
    this.updateActivities([
      ...this.props.activities,
      {
        demographicInfo: [
          {
            number: 0,
            type: "",
            note: ""
          }
        ]
      }
    ]);
  };

  onSubsectionRemoval = (removedIndex: number) => {
    this.updateActivities(
      this.props.activities.filter((activity, index) => index !== removedIndex)
    );
  };

  updateActivities = (activities: KeyActivity[]) => {
    this.props.onChange({ target: { value: activities } });
  };

  render() {
    const { activities, classes, disabled, onSave, isLoading } = this.props;
    return (
      <div data-test-id="key-activities">
        {activities.map((activity, index, activities) => (
          <KeyActivitySubsection
            classes={classes}
            key={index}
            activity={activity}
            index={index}
            numberOfActivities={activities.length}
            onChange={this.onSubsectionChange}
            onSave={() => onSave("keyActivities")}
            disabled={disabled}
            isLoading={isLoading}
            addActivity={this.onSubsectionAddition}
            removeActivity={() => this.onSubsectionRemoval(index)}
            sectors={this.props.sectors}
          />
        ))}
      </div>
    );
  }
}

type SubsectionProps = {
  classes: any,
  activity: KeyActivity,
  index: number,
  numberOfActivities: number,
  onSave: () => void,
  onChange: (index: number, updatedActivity: KeyActivity) => void,
  addActivity: () => void,
  removeActivity: (index: number) => void,
  disabled: boolean,
  isLoading: boolean,
  sectors: string[]
};

export class KeyActivitySubsection extends Component<
  SubsectionProps,
  { number: number, type: string, note: string }
> {
  changeInput = (key: string, value: any) => {
    this.props.onChange(this.props.index, {
      ...this.props.activity,
      [key]: value
    });
  };

  onDemoInfosectionChange = (
    updatedIndex: number,
    updatedDemoInfoSection: DemographicInfo
  ) => {
    this.changeInput(
      "demographicInfo",
      this.props.activity.demographicInfo.map(
        (demoInfo: DemographicInfo, index: number) => {
          if (index === updatedIndex) {
            return updatedDemoInfoSection;
          }
          return demoInfo;
        }
      )
    );
  };

  onDemoInfoSectionAddition = () => {
    this.changeInput("demographicInfo", [
      ...this.props.activity.demographicInfo,
      {
        number: 0,
        type: "",
        note: ""
      }
    ]);
  };

  onDemoInfosectionRemoval = (removedIndex: number) => {
    this.changeInput(
      "demographicInfo",
      this.props.activity.demographicInfo.filter(
        (demoInfo: DemographicInfo, index: number) => index !== removedIndex
      )
    );
  };

  get isLast() {
    const { index, numberOfActivities } = this.props;
    return index === numberOfActivities - 1;
  }

  get isFirst() {
    return this.props.index === 0;
  }

  render() {
    const {
      classes,
      onSave,
      index,
      numberOfActivities,
      disabled,
      isLoading,
      activity
    } = this.props;
    const paperClasses = [classes.pagePaper];
    if (!this.isFirst) {
      paperClasses.push(classes.notFirstPaper);
    }
    if (!this.isLast) {
      paperClasses.push(classes.notLastPaper);
    }
    return (
      <div data-test-id="key-activity">
        <Paper justify="center" className={paperClasses.join(" ")}>
          <Grid container direction="column" spacing={32}>
            <Grid item>
              {index === 0 && (
                <Grid item>
                  <Grid container alignItems="flex-end">
                    <Typography data-test-id="section-title" variant="h4">
                      Key Activities
                    </Typography>
                  </Grid>
                  <p
                    className={classes.subtitleText}
                    data-test-id="section-subtitle"
                  >
                    Please describe the activities you have done this month.
                  </p>
                </Grid>
              )}
              <Grid item>
                <InputLabel className={classes.label}>
                  Name of the activity
                </InputLabel>
                <OutlinedInput
                  className={classes.input}
                  fullWidth={true}
                  labelWidth={0}
                  placeholder="Add a title"
                  data-test-id="report-activity-name-input"
                  value={activity.activityName || ""}
                  onChange={event => {
                    this.changeInput("activityName", event.target.value);
                  }}
                />
                <InputLabel className={classes.label}>
                  Average number of participants
                </InputLabel>
                <OutlinedInput
                  className={classes.input}
                  fullWidth={true}
                  labelWidth={0}
                  placeholder="Add a number of participants"
                  data-test-id="report-participants-number-input"
                  type="number"
                  value={activity.numberOfParticipants || ""}
                  onChange={event => {
                    this.changeInput(
                      "numberOfParticipants",
                      event.target.value
                    );
                  }}
                />
                <InputLabel className={classes.label}>
                  Demographic info
                </InputLabel>
                {activity.demographicInfo.map(
                  (demoInfo: DemographicInfo, index: number) => (
                    <DemographicInfoSection
                      key={index}
                      index={index}
                      data-test-id="report-demographic-info"
                      sectors={this.props.sectors}
                      changeInput={this.onDemoInfosectionChange}
                      classes={classes}
                      demographicInfo={demoInfo}
                      addDemoInfoSection={this.onDemoInfoSectionAddition}
                      removeDemoInfoSection={this.onDemoInfosectionRemoval}
                      numberOfDemoInfo={activity.demographicInfo.length}
                    />
                  )
                )}

                <InputLabel className={classes.label}>
                  Positive Impacts & outcome
                </InputLabel>
                <OutlinedInput
                  className={classes.input}
                  fullWidth={true}
                  labelWidth={0}
                  multiline
                  rows={10}
                  rowsMax={20}
                  placeholder="Please add an overview"
                  data-test-id="report-impact-outcome-input"
                  value={activity.impactOutcome || ""}
                  onChange={event => {
                    this.changeInput("impactOutcome", event.target.value);
                  }}
                />
              </Grid>
              <Grid item container justify="space-between">
                <div>
                  {this.isLast && (
                    <Button
                      className={classes.saveButton}
                      data-test-id="section-save-button"
                      color="primary"
                      variant="outlined"
                      disabled={disabled || isLoading}
                      fullWidth={false}
                      onClick={() => {
                        onSave();
                      }}
                    >
                      Save
                    </Button>
                  )}
                </div>
                <div>
                  {numberOfActivities !== 1 && (
                    <Button
                      className={classes.removeButton}
                      data-test-id="remove-activity-button"
                      color="secondary"
                      fullWidth={false}
                      onClick={() => this.props.removeActivity(index)}
                      disabled={isLoading}
                    >
                      remove this activity
                    </Button>
                  )}
                  {this.isLast && (
                    <Button
                      className={classes.saveButton}
                      data-test-id="add-activity-button"
                      color="primary"
                      fullWidth={false}
                      onClick={() => this.props.addActivity()}
                      disabled={isLoading}
                    >
                      Add Another Activity
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

type DemographicInfoSectionProps = {
  classes: any,
  demographicInfo: DemographicInfo,
  changeInput: (index: number, value: any) => void,
  sectors: string[],
  index: number,
  addDemoInfoSection: (index: number) => void,
  removeDemoInfoSection: (index: number) => void,
  numberOfDemoInfo: number
};

type DemographicInfoSectionState = {
  number: number,
  type: string,
  note: string
};

export class DemographicInfoSection extends Component<
  DemographicInfoSectionProps,
  DemographicInfoSectionState
> {
  constructor() {
    super();
    this.state = {
      number: 0,
      type: "",
      note: ""
    };
  }

  get isLast() {
    const { index, numberOfDemoInfo } = this.props;
    return index === numberOfDemoInfo - 1;
  }

  get isFirst() {
    return this.props.index === 0;
  }

  componentWillReceiveProps(nextProps: DemographicInfoSectionProps) {
    this.setState({
      number: nextProps.demographicInfo.number,
      type: nextProps.demographicInfo.type,
      note: nextProps.demographicInfo.note
    });
  }

  componentWillMount() {
    this.setState({
      number: this.props.demographicInfo.number,
      type: this.props.demographicInfo.type,
      note: this.props.demographicInfo.note
    });
  }

  updateValue = (value: any, key: string) => {
    this.setState(state => {
      state[key] = value;
      this.props.changeInput(this.props.index, state);
      return state;
    });
  };

  render() {
    const { classes, sectors, index, numberOfDemoInfo } = this.props;
    return (
      <div>
        <Grid container direction="row">
          <OutlinedInput
            className={classes.inputNumber}
            labelWidth={0}
            placeholder="Add a number"
            data-test-id="report-demographic-info-number"
            type="number"
            value={this.state.number || ""}
            onChange={event => this.updateValue(event.target.value, "number")}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-demo-info">
              Choose a demographic indicator
            </InputLabel>
            <Select
              data-test-id="report-demographic-info-type"
              value={this.state.type || ""}
              onChange={event => this.updateValue(event.target.value, "type")}
              input={
                <OutlinedInput
                  labelWidth={250}
                  name="Choose a demographic indicator"
                  id="outlined-demo-info-type"
                />
              }
            >
              {(sectors || []).map((sector, key) => (
                <MenuItem key={key} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <OutlinedInput
            className={classes.inputNotes}
            labelWidth={0}
            placeholder="Type in your notes"
            data-test-id="report-demographic-info-note"
            value={this.state.note || ""}
            onChange={event => this.updateValue(event.target.value, "note")}
          />
        </Grid>
        <Grid container direction="row-reverse">
          {this.isLast && (
            <Button
              className={classes.saveButton}
              data-test-id="add-demo-info-button"
              color="primary"
              fullWidth={false}
              onClick={() => this.props.addDemoInfoSection(index)}
            >
              Add Another demographic info
            </Button>
          )}
          {numberOfDemoInfo !== 1 && (
            <Button
              className={classes.removeButton}
              data-test-id="remove-demo-info-button"
              color="secondary"
              fullWidth={false}
              onClick={() => this.props.removeDemoInfoSection(index)}
            >
              remove this demographic info
            </Button>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(theme => ({
  input: {
    marginBottom: theme.spacing.unit * 2
  },
  label: {
    textTransform: "uppercase",
    fontSize: "10px",
    marginBottom: theme.spacing.unit,
    display: "block",
    marginLeft: 0
  },
  headerText: {
    color: "#404040",
    margin: 0
  },
  optionalSubtitleText: {
    fontSize: "14px",
    color: "#7f7f7f",
    marginBottom: 0,
    marginLeft: "5px"
  },
  subtitleText: {
    color: "#7f7f7f",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "1.3rem",
    marginBottom: theme.spacing.unit * 2.5,
    opacity: 0.87
  },
  pagePaper: {
    padding: theme.spacing.unit * 4,
    boxShadow: "none",
    margin: theme.spacing.unit * 2
  },
  notFirstPaper: {
    marginTop: theme.spacing.unit * -1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  notLastPaper: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  saveButton: {
    minWidth: "140px"
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    minWidth: 300
  },
  inputNumber: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    width: theme.spacing.unit * 17
  },
  inputNotes: {
    width: theme.spacing.unit * 26.4,
    height: theme.spacing.unit * 7
  }
}))(ActivitiesSectionComponent);
