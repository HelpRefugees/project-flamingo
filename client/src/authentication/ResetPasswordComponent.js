import React, { Component } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import { parse } from "qs";

import AuthenticationFormComponent from "./AuthenticationFormComponent";

const styles = theme => ({
  form: {
    width: "100%"
  },
  button: {
    height: 56
  },
  centered: {
    textAlign: "center"
  },
  subtitle: {
    marginTop: theme.spacing.unit * 2
  }
});

type Props = {
  resetPassword: (token: string, password: string) => Promise<any>,
  location: { search: string },
  history: { push: string => void },
  classes: any
};

type State = { firstPassword: string, secondPassword: string };

export class ResetPasswordComponent extends Component<Props, State> {
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
      const params = parse(this.props.location.search, {
        ignoreQueryPrefix: true
      });
      this.props
        .resetPassword(params.token, this.state.firstPassword)
        .then(() => {
          this.props.history.push("/reset-success");
        });
    }
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <AuthenticationFormComponent>
        <Typography variant="h3" className={classes.centered}>
          Let's set your new password
        </Typography>
        <Typography className={`${classes.centered} ${classes.subtitle}`}>
          We recommend using a password manager to generate a random password
          that you do not use anywhere else
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

export default withStyles(styles)(ResetPasswordComponent);
