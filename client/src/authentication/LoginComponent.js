import React, { Component } from "react";
import {
  Button,
  Grid,
  TextField,
  Paper,
  FormGroup,
  FormControl,
  withStyles
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

import type { Credentials } from "./models";

const styles = themes => ({
  loginPaper: {
    padding: themes.spacing.unit * 4
  },
  outerContainer: {
    height: "100vh"
  }
});

interface State {
  credentials: Credentials;
}

interface Props {
  classes: any;
  isAuthenticated?: boolean;
  login: (credentials: Credentials) => void;
  initializeLogin: () => void;
}

export class LoginComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      credentials: {
        username: "",
        password: ""
      }
    };
    if (!this.props.isAuthenticated) {
      this.props.initializeLogin();
    }
  }

  login = () => {
    this.props.login(this.state.credentials);
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
    if (this.props.isAuthenticated) {
      return <Redirect to="/home" />;
    }
    const { classes } = this.props;
    return (
      <Grid
        container
        spacing={24}
        direction="column"
        justify="center"
        className={classes.outerContainer}
      >
        <Grid container justify="center">
          <Paper justify="center" className={classes.loginPaper}>
            <Grid
              container
              justify="center"
              direction="column"
              alignItems="center"
              spacing={8}
            >
              <img src="logo.png" alt="Help Refugees Logo" />
              <h2>Welcome</h2>
              <h5>Please enter your login details</h5>
              <FormGroup>
                <FormControl margin="normal" required>
                  <TextField
                    data-test-id="username-input"
                    label="Email"
                    type="email"
                    variant="outlined"
                    onChange={event =>
                      this.changeCredentials("username", event)
                    }
                    value={this.state.credentials.username}
                  />
                </FormControl>
                <FormControl margin="normal" required>
                  <TextField
                    data-test-id="password-input"
                    label="Password"
                    type="password"
                    variant="outlined"
                    onChange={event =>
                      this.changeCredentials("password", event)
                    }
                    value={this.state.credentials.password}
                  />
                </FormControl>
                <FormControl margin="normal">
                  <Button
                    variant="contained"
                    color="primary"
                    data-test-id="login-button"
                    onClick={() => this.login()}
                  >
                    Login
                  </Button>
                </FormControl>
              </FormGroup>
              {this.props.isAuthenticated === false && (
                <Grid item>
                  <p data-test-id="login-error">Invalid credentials</p>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(LoginComponent);
