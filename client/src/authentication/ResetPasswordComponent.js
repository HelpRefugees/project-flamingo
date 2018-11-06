import React, { Component } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";

import AuthenticationFormComponent from "./AuthenticationFormComponent";

export class ResetPasswordComponent extends Component {
  constructor() {
    super();
    this.state = {
      firstPassword: "",
      secondPassword: ""
    };
  }

  get passwordsMatch() {
    return this.state.firstPassword === this.state.secondPassword;
  }

  updateState = (prop: string, event: any) => {
    this.setState({ [prop]: event.target.value });
  };

  resetPassword = (event: any) => {
    if (this.passwordsMatch) {
      this.props.setPassword(this.state.firstPassword).then(() => {
        this.props.history.push("/reset-success");
      });
    }
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <AuthenticationFormComponent>
        <Typography variant="h3">Let’s set your  new password</Typography>
        <Typography>
          Please enter a password that contains at least 6 characters
        </Typography>
        <form
          onSubmit={event => this.resetPassword(event)}
          className={classes.form}
        >
          <FormGroup>
            <FormControl margin="normal" required>
              <TextField
                data-test-id="password-input-one"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                onChange={event => this.updateState("firstPassword", event)}
                value={this.state.firstPassword}
              />
            </FormControl>
            <FormControl margin="normal" required>
              <TextField
                data-test-id="password-input-two"
                label="Repeat password"
                type="password"
                fullWidth
                variant="outlined"
                onChange={event => this.updateState("secondPassword", event)}
                value={this.state.secondPassword}
              />
            </FormControl>
            <FormControl margin="normal">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-test-id="save-password-button"
                className={classes.button}
              >
                save new password
              </Button>
            </FormControl>
          </FormGroup>
        </form>
      </AuthenticationFormComponent>
    );
  }
}

export default withStyles(() => ({}))(ResetPasswordComponent);
