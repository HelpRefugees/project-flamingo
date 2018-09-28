import React, { Component } from "react";

import AuthService from "./authService";
import LoginComponent from "./LoginComponent";

export default class LoginPage extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  render() {
    return <LoginComponent login={this.authService.login} />;
  }
}
