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

const styles = themes => ({
  loginPaper: {
    padding: themes.spacing.unit * 4
  },
  outerContainer: {
    height: "100vh"
  }
});

export class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      credentials: {
        username: "",
        password: ""
      }
    };
  }

  login = () => {
    this.props.login(this.state.credentials);
  };

  changeCredentials = (key, event) => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [key]: event.target.value
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
