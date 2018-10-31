import React, { Component, Fragment } from "react";
import {
  Button,
  InputLabel,
  OutlinedInput,
  Grid,
  withStyles
} from "@material-ui/core";

import { type KeyActivity } from "./models";

export type Props = {
  classes: any,
  activities: KeyActivity[],
  onChange: (event: { target: { value: KeyActivity[] } }) => void,
  onSave: (key: string) => void,
  isLoading: boolean
};

export type State = {
  activities: KeyActivity[]
};

export class ActivitiesSectionComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activities: [...props.activities]
    };
  }

  onSubsectionChange = (updatedIndex: number, updatedActivity: KeyActivity) => {
    this.updateActivities(
      this.state.activities.map((activity: KeyActivity, index: number) => {
        if (index === updatedIndex) {
          return updatedActivity;
        }
        return activity;
      })
    );
  };

  onSubsectionAddition = () => {
    this.updateActivities([...this.state.activities, {}]);
  };

  onSubsectionRemoval = (removedIndex: number) => {
    this.updateActivities(
      this.state.activities.filter((activity, index) => index !== removedIndex)
    );
  };

  updateActivities = (activities: KeyActivity[]) => {
    this.setState({ activities });
    this.props.onChange({ target: { value: activities } });
  };

  render() {
    const { classes, isLoading, onSave } = this.props;
    const { activities } = this.state;
    return (
      <Fragment>
        {activities.map((activity, index, activities) => (
          <KeyActivitySubsection
            classes={classes}
            key={index}
            activity={activity}
            index={index}
            numberOfActivities={activities.length}
            onChange={this.onSubsectionChange}
            onSave={() => onSave("keyActivities")}
            isLoading={isLoading}
            addActivity={this.onSubsectionAddition}
            removeActivity={() => this.onSubsectionRemoval(index)}
          />
        ))}
      </Fragment>
    );
  }
}

type SubsectionState = {
  activityName?: string,
  numberOfParticipants?: string,
  demographicInfo?: string,
  impactOutcome?: string
};

type SubsectionProps = {
  classes: any,
  activity: KeyActivity,
  index: number,
  numberOfActivities: number,
  onSave: () => void,
  onChange: (index: number, updatedActivity: KeyActivity) => void,
  addActivity: () => void,
  removeActivity: (index: number) => void,
  isLoading: boolean
};

export class KeyActivitySubsection extends Component<
  SubsectionProps,
  SubsectionState
> {
  constructor(props: SubsectionProps) {
    super(props);
    this.state = {
      ...props.activity
    };
  }

  inputsHaveChanges = () => {
    return [
      "activityName",
      "numberOfParticipants",
      "demographicInfo",
      "impactOutcome"
    ].some(field => this.props.activity[field] != this.state[field]);
  };

  changeInput = (key: string, value: string) => {
    this.setState({
      [key]: value
    });
    this.props.onChange(this.props.index, this.state);
  };

  get isLastSubsection() {
    const { index, numberOfActivities } = this.props;
    return index === numberOfActivities - 1;
  }
  render() {
    const {
      classes,
      activity,
      onSave,
      index,
      numberOfActivities,
      isLoading
    } = this.props;
    return (
      <Fragment>
        {index === 0 && (
          <Grid item>
            <Grid container justify="flex-start" alignItems="center">
              <h1
                data-test-id="section-title"
                className={[classes.fontFamily, classes.headerText].join(" ")}
              >
                Key Activities
              </h1>
            </Grid>
            <h2
              className={classes.subtitleText}
              data-test-id="section-subtitle"
            >
              Please describe the activities you have done this month.
            </h2>
          </Grid>
        )}
        <InputLabel className={classes.label}>Name of the activity</InputLabel>
        <OutlinedInput
          fullWidth={true}
          labelWidth={0}
          placeholder="Add a title"
          data-test-id="report-activity-name-input"
          value={this.state.activityName}
          onChange={event => {
            this.changeInput("activityName", event.target.value);
          }}
        />
        <InputLabel className={classes.label}>
          Average number of participants
        </InputLabel>
        <OutlinedInput
          fullWidth={true}
          labelWidth={0}
          placeholder="Add a number of participants"
          data-test-id="report-participants-number-input"
          type="number"
          value={this.state.numberOfParticipants}
          onChange={event => {
            this.changeInput("numberOfParticipants", event.target.value);
          }}
        />
        <InputLabel className={classes.label}>Demographic info</InputLabel>
        <OutlinedInput
          fullWidth={true}
          labelWidth={0}
          multiline
          rows={2}
          placeholder="Please add an overview"
          data-test-id="report-demographic-info-input"
          value={this.state.demographicInfo}
          onChange={event => {
            this.changeInput("demographicInfo", event.target.value);
          }}
        />
        <InputLabel className={classes.label}>
          Positive Impacts & outcome
        </InputLabel>
        <OutlinedInput
          fullWidth={true}
          labelWidth={0}
          multiline
          rows={10}
          rowsMax={20}
          placeholder="Please add an overview"
          data-test-id="report-impact-outcome-input"
          value={this.state.impactOutcome}
          onChange={event => {
            this.changeInput("impactOutcome", event.target.value);
          }}
        />
        {this.isLastSubsection && (
          <Button
            className={classes.saveButton}
            data-test-id="section-save-button"
            color="primary"
            variant="outlined"
            disabled={!this.inputsHaveChanges() || isLoading}
            fullWidth={false}
            onClick={() => onSave()}
          >
            Save
          </Button>
        )}
        {numberOfActivities !== 1 && (
          <Button
            className={classes.removeButton}
            data-test-id="remove-activity-button"
            color="primary"
            fullWidth={false}
            onClick={() => this.props.removeActivity(index)}
            disabled={isLoading}
          >
            remove this activity
          </Button>
        )}
        {this.isLastSubsection && (
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
      </Fragment>
    );
  }
}

export default withStyles({})(ActivitiesSectionComponent);
