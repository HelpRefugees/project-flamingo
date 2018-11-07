import type { Dispatch } from "redux";

import type { Report } from "./my-report/models";
import type { Credentials, Account } from "./authentication/models";

export const loginSuccessful = (account: Account) => ({
  type: "SET_LOGGED_IN",
  payload: account
});

export const loginFailed = () => ({
  type: "SET_LOGGED_IN_ERROR"
});

export const logoutSuccessful = () => ({
  type: "SET_LOGGED_OUT"
});

export const logout = () => (dispatch: Dispatch<any>) => {
  makeRequest(dispatch, "/api/login", { method: "DELETE" }, res => {
    if (res.status === 204) {
      dispatch(logoutSuccessful());
    }
  });
};

export const requestStarted = () => ({
  type: "SET_LOADING"
});

export const requestFinished = () => ({
  type: "SET_NOT_LOADING"
});

export const login = (credentials: Credentials) => (dispatch: Dispatch<any>) =>
  makeRequest(
    dispatch,
    "/api/login",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials)
    },
    res => {
      if (res.status === 200) {
        return res.json().then(account => {
          dispatch(loginSuccessful(account));
        });
      } else {
        dispatch(loginFailed());
      }
    }
  );

export const loadReportsStarted = () => ({
  type: "LOAD_REPORTS_STARTED"
});

export const loadReportsSuccessful = (reports: Report[]) => ({
  type: "LOAD_REPORTS_SUCCESS",
  payload: reports
});

export const loadReportsFailed = () => ({
  type: "LOAD_REPORTS_FAILURE"
});

export const loadReports = () => (dispatch: Dispatch<any>) => {
  dispatch(loadReportsStarted());
  makeRequest(
    dispatch,
    "/api/reports",
    {
      method: "GET",
      headers: { "content-type": "application/json" }
    },
    res => {
      if (res.status === 200) {
        return res.json().then((reports: any) => {
          dispatch(loadReportsSuccessful(reports));
        });
      } else {
        dispatch(loadReportsFailed());
      }
    }
  );
};

export const loadReportDetailsStarted = () => ({
  type: "LOAD_REPORT_DETAILS_START"
});

export const loadReportDetailsSuccessful = (report: Report) => ({
  type: "LOAD_REPORT_DETAILS_SUCCESS",
  payload: report
});

export const loadReportDetailsFailed = () => ({
  type: "LOAD_REPORT_DETAILS_FAIL"
});


export const loadReportDetails = (id: string) => (dispatch: Dispatch<any>) => {
  dispatch(loadReportDetailsStarted());
  makeRequest(dispatch, `/api/reports/${id}`, {
    method: "GET",
    headers: { "content-type": "application/json" }
  }, res => {
    if (res.status === 200) {
      return res.json().then((report: Report) => {
        dispatch(loadReportDetailsSuccessful(report));
      });
    }
    else {
      dispatch(loadReportDetailsFailed());
    }
  }
  )
}

export const updateReportStarted = () => ({
  type: "SAVE_REPORT_START"
});

export const updateReportSuccessful = (report: Report) => ({
  type: "SAVE_REPORT_SUCCESS",
  payload: report
});

export const updateReportFailed = () => ({
  type: "SAVE_REPORT_FAILURE"
});

export const errorOccurred = (message: string) => ({
  type: "SET_ERROR_MESSAGE",
  payload: message
});

export const errorExpired = () => ({
  type: "CLEAR_ERROR_MESSAGE"
});

export const updateReport = (report: Report, errorMessage: string) => (
  dispatch: Dispatch<any>
) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    const changes = [
      "overview",
      "completed",
      "keyActivities",
      "operatingEnvironment",
      "beneficiaryFeedback",
      "challengesFaced",
      "incidents",
      "otherIssues",
      "materialsForFundraising"
    ].map(field => ({
      op: "replace",
      path: `/${field}`,
      value: report[field]
    }));

    dispatch(updateReportStarted());

    makeRequest(
      dispatch,
      `/api/reports/${report.id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(changes)
      },
      res => {
        if (res.status === 200) {
          res.json().then(updatedReport => {
            dispatch(updateReportSuccessful(updatedReport));
            resolve();
          });
        } else {
          dispatch(errorOccurred(errorMessage));
          reject("did not return 200");
        }
      }
    ).catch(err => {
      dispatch(errorOccurred(errorMessage));
      reject(err);
    });
  });
  return promise;
};

export const makeRequest = (
  dispatch: Dispatch<any>,
  url: string,
  options?: any = undefined,
  callback?: any => any = () => { }
) => {
  dispatch(requestStarted());
  return fetch(url, options)
    .then(res => callback(res))
    .then(() => {
      dispatch(requestFinished());
    })
    .catch(err => {
      dispatch(requestFinished());
      throw err;
    });
};
