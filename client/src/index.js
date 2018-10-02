import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// $FlowIgnore: redux-persist types don't seem to work
import { PersistGate } from "redux-persist/integration/react";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import configureStore from "./configureStore";
import "./index.css";
import App from "./App";
import theme from "./theme";

const { store, persistor } = configureStore();
const root: ?Element = document.getElementById("root");

if (root != null) {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <App />
        </PersistGate>
      </MuiThemeProvider>
    </Provider>,
    root
  );
}
