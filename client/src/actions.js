import type { Dispatch } from "redux";

import type { Credentials } from "./authentication/models";

export const loginSuccessful = () => ({
  type: "SET_LOGGED_IN"
});

export const loginFailed = () => ({
  type: "SET_NOT_LOGGED_IN"
});

export const initializeLogin = () => ({
  type: "INITIALIZE_LOGGED_IN"
});

export const login = (credentials: Credentials) => (dispatch: Dispatch<any>) =>
  fetch("/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(credentials)
  }).then(res => {
    if (res.status === 200) {
      dispatch(loginSuccessful());
    } else {
      dispatch(loginFailed());
    }
  });
