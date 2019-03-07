import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// $FlowIgnore: redux-persist types don't seem to work
import { PersistGate } from "redux-persist/integration/react";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import configureStore from "./state/configureStore";
import "./index.css";
import "./my-report/dropzone.min.css";
import "./my-report/filepicker.css";
import App from "./App";
import theme from "./theme";
import Initializer from "./Initializer";

const { store, persistor } = configureStore();
const root: ?Element = document.getElementById("root");

if (root != null) {
  ReactDOM.render(
    <Provider store={store}>
      <Initializer>
        <MuiThemeProvider theme={theme}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <App />
          </PersistGate>
        </MuiThemeProvider>
      </Initializer>
    </Provider>,
    root
  );
}
