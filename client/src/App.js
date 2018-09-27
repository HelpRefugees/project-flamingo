import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import AuthService from "./authentication/authService";
import LoginPage from "./authentication/LoginPage";

class App extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  render() {
    return (
      <Grid container spacing={24} alignItems="center" direction="column">
        <Grid item>
          <h1>Impact Tracker</h1>
          <LoginPage login={this.authService.login} />
        </Grid>
      </Grid>
    );
  }
}

export default App;
