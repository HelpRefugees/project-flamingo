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

import { type KeyActivity } from "./models";

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
        demographicInfo: {
          number: 0,
          type: "",
          note: ""
        }
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
  constructor() {
    super();
    this.state = {
      number: 0,
      type: "",
      note: ""
    };
  }
  componentWillMount() {
    this.setState({
      number: this.props.activity.demographicInfo.number,
      type: this.props.activity.demographicInfo.type,
      note: this.props.activity.demographicInfo.note
    });
  }
  changeInput = (key: string, value: any) => {
    this.props.onChange(this.props.index, {
      ...this.props.activity,
      [key]: value
    });
  };

  updateValue = (value: any, key: string) => {
    this.setState(state => {
      state[key] = value;
      this.changeInput("demographicInfo", state);
      return state;
    });
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
                <Grid container direction="row">
                  <OutlinedInput
                    className={classes.inputNumber}
                    labelWidth={0}
                    placeholder="Add a number"
                    data-test-id="report-demographic-info-number"
                    type="number"
                    value={this.state.number || ""}
                    onChange={event =>
                      this.updateValue(event.target.value, "number")
                    }
                  />
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="outlined-demo-info">
                      Choose a demographic indicator
                    </InputLabel>
                    <Select
                      data-test-id="report-demographic-info-type"
                      value={this.state.type || ""}
                      onChange={event =>
                        this.updateValue(event.target.value, "type")
                      }
                      input={
                        <OutlinedInput
                          labelWidth={250}
                          name="Choose a demographic indicator"
                          id="outlined-demo-info-type"
                        />
                      }
                    >
                      {(this.props.sectors || []).map((sector, key) => (
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
                    onChange={event =>
                      this.updateValue(event.target.value, "note")
                    }
                  />
                </Grid>
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
                        // this.changeInput("demographicInfo", this.state);
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
