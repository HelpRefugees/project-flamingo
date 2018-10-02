import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import configureStore from "./configureStore";
import "./index.css";
import App from "./App";
import { unregister } from "./registerServiceWorker";
import theme from "./theme";

const { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
unregister();
