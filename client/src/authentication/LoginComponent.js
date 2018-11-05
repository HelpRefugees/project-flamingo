import React, { Component } from "react";
import {
  Button,
  Grid,
  FormGroup,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

import type { Credentials } from "./models";

const styles = themes => ({
  loginPaper: {
    padding: themes.spacing.unit * 4
  },
  logo: {
    paddingBottom: themes.spacing.unit * 3
  },
  outerContainer: {
    height: "100vh"
  },
  form: {
    width: "100%"
  },
  button: {
    height: 56
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
      <Grid
        container
        spacing={24}
        direction="column"
        justify="center"
        className={classes.outerContainer}
      >
        <Grid container justify="center">
          <Grid item xs={4}>
            <Paper justify="center" className={classes.loginPaper}>
              <Grid
                container
                justify="center"
                direction="column"
                alignItems="center"
                spacing={8}
              >
                <img
                  src="logo.png"
                  alt="Help Refugees Logo"
                  className={classes.logo}
                />
                <Typography variant="h3">Welcome</Typography>
                <Typography>Please enter your login details</Typography>
                <form
                  onSubmit={event => this.login(event)}
                  className={classes.form}
                >
                  <FormGroup>
                    <FormControl margin="normal" required>
                      <TextField
                        data-test-id="username-input"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        onChange={event =>
                          this.changeCredentials("username", event)
                        }
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
                        onChange={event =>
                          this.changeCredentials("password", event)
                        }
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
                  </FormGroup>
                </form>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(LoginComponent);
