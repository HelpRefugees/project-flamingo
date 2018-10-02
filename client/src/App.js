import React, { Component, Fragment } from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LoginPage from "./authentication/LoginPage";
import HomePage from "./home/HomePage";

class App extends Component<{}> {
  render() {
    return (
      <Router>
        <Fragment>
          <CssBaseline />
          <Route exact path="/" component={LoginPage} />
          <Route path="/home" component={HomePage} />
        </Fragment>
      </Router>
    );
  }
}

export default App;
