import React, { Component } from "react";
import { Button, Grid, TextField } from "@material-ui/core";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: null
    };
  }
  login = () => {
    this.setState({ isAuthenticated: false });
  };

  render() {
    return (
      <Grid container spacing={24} alignItems="center" direction="column">
        <Grid item>
          <h1 className="App-title">Impact Tracker</h1>
        </Grid>
        <Grid item container alignItems="center" justify="center">
          <TextField
            data-test-id="username-input"
            label="Email"
            type="email"
            variant="outlined"
          />
          <TextField
            data-test-id="password-input"
            label="Password"
            type="password"
            variant="outlined"
          />
          <Button
            variant="outlined"
            color="primary"
            data-test-id="login-button"
            onClick={this.login}
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

export default App;
