import React, { Component } from "react";
import {
  Button,
  Grid,
  TextField,
  Paper,
  FormGroup,
  FormControl
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

import "./LoginComponent.css";

export default class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: null,
      credentials: {
        username: "",
        password: ""
      }
    };
  }

  login = () => {
    this.props.login(this.state.credentials).then(isAuthenticated => {
      this.setState({ isAuthenticated });
    });
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
    if (this.state.isAuthenticated) return <Redirect to="/home" />;
    return (
      <Grid container spacing={24} alignContent="center" display="column">
        <Grid item container alignContent="center" justify="center">
          <Paper className="login-card" justify="center">
            <h2 justify="center">Welcome</h2>
            <h4>Please enter your login details</h4>
            <FormGroup>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  data-test-id="username-input"
                  label="Email"
                  type="email"
                  variant="outlined"
                  onChange={event => this.changeCredentials("username", event)}
                  value={this.state.credentials.username}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  data-test-id="password-input"
                  label="Password"
                  type="password"
                  variant="outlined"
                  onChange={event => this.changeCredentials("password", event)}
                  value={this.state.credentials.password}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                data-test-id="login-button"
                onClick={() => this.login()}
              >
                Login
              </Button>
            </FormGroup>
          </Paper>
          {this.state.isAuthenticated === false && (
            <Grid item>
              <p data-test-id="login-error">Invalid credentials</p>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
}
