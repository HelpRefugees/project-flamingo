import React, { Component } from "react";
import "./App.css";

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
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Impact Tracker</h1>
        </header>
        <input data-test-id="username-input" type="email" />
        <input data-test-id="password-input" type="password" />
        <button data-test-id="login-button" onClick={this.login}>
          Login
        </button>
        {this.state.isAuthenticated === false && (
          <p data-test-id="login-error">Invalid credentials</p>
        )}
      </div>
    );
  }
}

export default App;
