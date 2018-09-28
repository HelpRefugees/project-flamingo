import React, { Component } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { Redirect } from "react-router-dom";

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
      <Grid container spacing={24} alignItems="center" direction="column">
        <Grid item>
          <h1>Impact Tracker</h1>
        </Grid>

        <Grid item container alignItems="center" justify="center">
          <TextField
            data-test-id="username-input"
            label="Email"
            type="email"
            variant="outlined"
            onChange={event => this.changeCredentials("username", event)}
            value={this.state.credentials.username}
          />
          <TextField
            data-test-id="password-input"
            label="Password"
            type="password"
            variant="outlined"
            onChange={event => this.changeCredentials("password", event)}
            value={this.state.credentials.password}
          />
          <Button
            variant="outlined"
            color="primary"
            data-test-id="login-button"
            onClick={() => this.login()}
          >
            Login
          </Button>
        </Grid>
        {this.state.isAuthenticated === false && (
          <Grid item>
            <p data-test-id="login-error">Invalid credentials</p>
          </Grid>
        )}
      </Grid>
    );
  }
}
