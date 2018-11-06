import React, { Component } from "react";
import {
  Button,
  FormGroup,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

import type { Credentials } from "./models";
import ButtonLink from "../page-layout/ButtonLink";
import AuthenticationFormComponent from "./AuthenticationFormComponent";

const styles = theme => ({
  form: {
    width: "100%"
  },
  button: {
    height: 56
  },
  text: {
    marginTop: theme.spacing.unit * 2,
    textAlign: "center"
  }
});

type State = {
  credentials: Credentials
};

export type Props = {
  classes: any,
  isAuthenticated?: ?boolean,
  login: (credentials: Credentials) => void,
  initializeLogin: () => void,
  role: ?string,
  isLoading: boolean
};

export class LoginComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      credentials: {
        username: "",
        password: ""
      }
    };
    if (!this.props.isAuthenticated && !this.props.isLoading) {
      this.props.initializeLogin();
    }
  }

  login = (event: Event) => {
    this.props.login(this.state.credentials);
    event.preventDefault();
  };

  changeCredentials = (key: string, event: Event) => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [key]: (event.target: window.HTMLInputElement).value
      }
    });
  };

  render() {
    if (
      this.props.isAuthenticated &&
      !this.props.isLoading &&
      this.props.role === "implementing-partner"
    ) {
      return <Redirect to="/my-reports" />;
    }
    if (
      this.props.isAuthenticated &&
      !this.props.isLoading &&
      this.props.role === "help-refugees"
    ) {
      return <Redirect to="/reports" />;
    }
    const { classes } = this.props;
    return (
      <AuthenticationFormComponent>
        <Typography variant="h3">Welcome</Typography>
        <Typography className={classes.text}>
          Please enter your login details
        </Typography>
        <form onSubmit={event => this.login(event)} className={classes.form}>
          <FormGroup>
            <FormControl margin="normal" required>
              <TextField
                data-test-id="username-input"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={event => this.changeCredentials("username", event)}
                error={this.props.isAuthenticated === false}
                value={this.state.credentials.username}
              />
            </FormControl>
            <FormControl margin="normal" required>
              <TextField
                data-test-id="password-input"
                label="Password"
                type="password"
                variant="outlined"
                onChange={event => this.changeCredentials("password", event)}
                error={this.props.isAuthenticated === false}
                value={this.state.credentials.password}
              />
            </FormControl>
            <FormControl>
              {this.props.isAuthenticated === false && (
                <FormHelperText error={true} data-test-id="login-error">
                  Invalid credentials
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-test-id="login-button"
                className={classes.button}
              >
                Login
              </Button>
            </FormControl>
            <FormControl>
              <ButtonLink
                data-test-id="forgot-password"
                color="primary"
                to="/forgotten-password"
                className={classes.button}
              >
                Forgot password
              </ButtonLink>
            </FormControl>
          </FormGroup>
        </form>
      </AuthenticationFormComponent>
    );
  }
}

export default withStyles(styles)(LoginComponent);
