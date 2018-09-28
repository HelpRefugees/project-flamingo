import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import HomePage from "./home/HomePage";

class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Route exact path="/" component={LoginPage} />
          <Route path="/home" component={HomePage} />
        </Fragment>
      </Router>
    );
  }
}

export default App;
