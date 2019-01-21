import React, { Component, Fragment } from "react";
import {
  Grid,
  TextField,
  Paper,
  Typography,
  withStyles,
  AppBar,
  Toolbar,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel
} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";
import { type Grant } from "./models";
import { type Account } from "../authentication/models";
import { type User } from "../settings/models";

type Props = {
  classes: any,
  logout: () => void,
  account: Account,
  updateGrant: (grant: $Shape<Grant>, errorMessage: string) => Promise<any>,
  history: any,
  grant: $Shape<Grant>,
  users: $Shape<User>[],
  loadUsers: () => void
};

const styles = themes => ({
  title: {
    fontSize: themes.spacing.unit * 5
  },
  outerContainer: {
    height: "100vh",
    marginTop: themes.spacing.unit * 5
  },
  pagePaper: {
    padding: themes.spacing.unit * 4,
    boxShadow: "none",
    margin: themes.spacing.unit * 2
  },
  subtitleText: {
    color: "#7f7f7f",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "1.3rem",
    marginBottom: themes.spacing.unit * 2.5,
    opacity: 0.87
  },
  optionalSubtitleText: {
    color: "#7f7f7f",
    fontWeight: 600,
    marginBottom: 0,
    marginLeft: "5px"
  },
  formControl: {
    marginBottom: themes.spacing.unit * 2.5
  },
  icon: {
    color: themes.palette.primary.main,
    fill: themes.palette.primary.main
  }
});

export class EditGrantComponent extends Component<Props, $Shape<Grant>> {
  constructor() {
    super();
    this.state = {
      id: 0,
      organization: "",
      grant: "",
      owner: "",
      sector: "",
      description: "",
      country: "",
      region: "",
      otherInfo: "",
      startDate: "",
      endDate: ""
    };
  }
  componentWillMount() {
    this.props.loadUsers();
    this.setState(this.props.grant);
  }

  renderToolbar = (classes: any) => {
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
                <Button onClick={() => this.props.history.push("/grants")}>
                  <ArrowBack className={classes.icon} />
                </Button>
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
                data-test-id="save-grant-button"
                variant="contained"
                color="primary"
                disabled={this.isSaveButtonDisabled()}
                onClick={() => {
                  this.props
                    .updateGrant(this.state, "Unable to update grant")
                    .then(() => {
                      this.props.history.push("/grants");
                    });
                }}
              >
                Save Grant
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  updateField = (event: Event, key: string) => {
    if (key === "endDate" || key === "startDate") {
      const date = new Date((event.target: window.HTMLInputElement).value);
      this.setState({ [key]: date.toISOString() });
    } else {
      this.setState({ [key]: (event.target: window.HTMLInputElement).value });
    }
  };

  isSaveButtonDisabled = () => {
    let changed = false;
    Object.keys(this.props.grant).forEach(key => {
      if (this.state[key] !== this.props.grant[key]) {
        changed = true;
      }
    });
    return !changed;
  };

  render() {
    const { logout, classes, account } = this.props;
    const users = this.props.users || [];
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        {this.renderToolbar(classes)}
        <Grid container spacing={24} className={classes.outerContainer}>
          <Grid container justify="center">
            <Grid item xs={6}>
              <Typography
                variant="h4"
                align="center"
                className={classes.title}
                data-test-id="page-title"
              >
                Edit grant
              </Typography>
              <Paper
                justify="center"
                data-test-id="add-grant-form"
                className={classes.pagePaper}
              >
                <Grid container direction="column" spacing={32}>
                  <Grid item>
                    <Grid container alignItems="flex-end">
                      <Typography data-test-id="grant-info-title" variant="h4">
                        Grant information
                      </Typography>
                    </Grid>
                    <p
                      data-test-id="grant-info-subtitle"
                      className={classes.subtitleText}
                    >
                      Please fill out the form below with the grant information.
                    </p>
                    <TextField
                      className={classes.formControl}
                      data-test-id="grant-name-text"
                      fullWidth={true}
                      value={this.state.grant}
                      onChange={value => this.updateField(value, "grant")}
                      variant="outlined"
                      label="Grant name"
                    />
                    <TextField
                      className={classes.formControl}
                      data-test-id="organization-name-text"
                      fullWidth={true}
                      value={this.state.organization}
                      onChange={value =>
                        this.updateField(value, "organization")
                      }
                      variant="outlined"
                      label="Organization name"
                    />
                    <TextField
                      className={classes.formControl}
                      data-test-id="sector-text"
                      fullWidth={true}
                      value={this.state.sector}
                      onChange={value => this.updateField(value, "sector")}
                      variant="outlined"
                      label="Sector"
                    />
                    <TextField
                      className={classes.formControl}
                      data-test-id="grant-description-text"
                      fullWidth={true}
                      value={this.state.description}
                      onChange={value => this.updateField(value, "description")}
                      variant="outlined"
                      label="Grant description"
                    />
                    <TextField
                      className={classes.formControl}
                      data-test-id="country-text"
                      fullWidth={true}
                      value={this.state.country}
                      onChange={value => this.updateField(value, "country")}
                      variant="outlined"
                      label="Country"
                    />
                    <TextField
                      className={classes.formControl}
                      data-test-id="region-text"
                      fullWidth={true}
                      value={this.state.region}
                      onChange={value => this.updateField(value, "region")}
                      variant="outlined"
                      label="Region"
                    />
                    <TextField
                      className={classes.formControl}
                      data-test-id="other-info-text"
                      fullWidth={true}
                      value={this.state.otherInfo}
                      onChange={value => this.updateField(value, "otherInfo")}
                      variant="outlined"
                      label="Other info"
                    />
                    <Grid
                      container
                      justify="space-between"
                      direction="row"
                      spacing={24}
                    >
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth={true}
                          className={classes.formControl}
                          label="Start Date"
                          type="date"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true
                          }}
                          value={moment(this.state.startDate).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={value =>
                            this.updateField(value, "startDate")
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          disabled={this.state.startDate === ""}
                          fullWidth={true}
                          className={classes.formControl}
                          label="End Date"
                          type="date"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true
                          }}
                          inputProps={{
                            min: `${moment(this.state.startDate).format(
                              "YYYY-MM-DD"
                            )}`
                          }}
                          value={moment(this.state.endDate).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={value => {
                            this.updateField(value, "endDate");
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container alignItems="flex-end">
                      <Typography
                        data-test-id="account-info-title"
                        variant="h4"
                      >
                        Account information
                      </Typography>
                    </Grid>

                    <p
                      data-test-id="account-info-subtitle"
                      className={classes.subtitleText}
                    >
                      By adding an email address you are inviting a user to this
                      grant. There can be only a single email added.
                    </p>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      fullWidth={true}
                    >
                      <InputLabel htmlFor="outlined-age">Username</InputLabel>
                      <Select
                        data-test-id="account-email"
                        fullWidth={true}
                        value={this.state.owner}
                        onChange={value => this.updateField(value, "owner")}
                        input={
                          <OutlinedInput
                            labelWidth={80}
                            name="username"
                            id="outlined-username"
                          />
                        }
                      >
                        {users.map((user: User, key: number) => {
                          return (
                            <MenuItem key={key} value={user.username}>
                              {user.username}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
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

export default withStyles(styles)(EditGrantComponent);
