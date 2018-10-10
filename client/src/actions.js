import type { Dispatch } from "redux";

import type { Report } from "./home/models";
import type { Credentials } from "./authentication/models";

export const loginSuccessful = () => ({
  type: "SET_LOGGED_IN"
});

export const loginFailed = () => ({
  type: "SET_LOGGED_IN_ERROR"
});

export const logout = () => ({
  type: "SET_LOGGED_OUT"
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

export const loadReports = () => (dispatch: Dispatch<any>) => {
  fetch("/api/reports")
    .then(res => res.json())
    .then((reports: any) => {
      dispatch(receiveReports(reports));
    });
};

export const receiveReports = (reports: Report[]) => ({
  type: "ADD_REPORTS",
  payload: reports
});
