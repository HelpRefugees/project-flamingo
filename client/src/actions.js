import { type Dispatch } from "redux";

import { type Report } from "./my-report/models";
import { type User } from "./settings/models";
import { type Grant, type AddGrantModel } from "./grants/models";
import { type Credentials, type Account } from "./authentication/models";

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

export const loadReportSuccessful = (report: Report) => ({
  type: "LOAD_REPORT_SUCCESS",
  payload: report
});

export const loadReportStarted = () => ({
  type: "LOAD_REPORT_START"
});

export const loadReport = (id: number) => (dispatch: Dispatch<any>) => {
  dispatch(loadReportStarted());
  return makeRequest(dispatch, `/api/reports/${id}`, {}, res => {
    if (res.status === 200) {
      return res.json().then(report => {
        dispatch(loadReportSuccessful(report));
        return report;
      });
    }
    return;
  });
};

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
            dispatch(loadReportSuccessful(updatedReport));
            resolve();
          });
        } else {
          dispatch(updateReportFailed());
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

export const loadGrantsStarted = () => ({
  type: "LOAD_GRANTS_STARTED"
});

export const loadGrantsSuccessful = (grants: $Shape<Grant>[]) => ({
  type: "LOAD_GRANTS_SUCCESS",
  payload: grants
});

export const loadGrantsFailed = () => ({
  type: "LOAD_GRANTS_FAILURE"
});

export const loadGrants = () => (dispatch: Dispatch<any>) => {
  dispatch(loadGrantsStarted());
  makeRequest(
    dispatch,
    "/api/grants",
    {
      method: "GET",
      headers: { "content-type": "application/json" }
    },
    res => {
      if (res.status === 200) {
        return res.json().then((reports: any) => {
          dispatch(loadGrantsSuccessful(reports));
        });
      } else {
        dispatch(loadGrantsFailed());
      }
    }
  );
};

export const loadUsersStarted = () => ({
  type: "LOAD_USERS_STARTED"
});

export const loadUsersSuccessful = (users: User[]) => ({
  type: "LOAD_USERS_SUCCESS",
  payload: users
});

export const loadUsersFailed = () => ({
  type: "LOAD_USERS_FAILURE"
});

export const loadUsers = () => (dispatch: Dispatch<any>) => {
  dispatch(loadUsersStarted());
  makeRequest(
    dispatch,
    "/api/users",
    {
      method: "GET",
      headers: { "content-type": "application/json" }
    },
    res => {
      if (res.status === 200) {
        return res.json().then((users: any) => {
          dispatch(loadUsersSuccessful(users));
        });
      } else {
        dispatch(loadUsersFailed());
      }
    }
  );
};

export const appStarted = () => ({ type: "APP_STARTED" });

export const getInfoSuccess = (payload: { environment: string }) => ({
  type: "GET_INFO_SUCCESS",
  payload
});

export const getInfo = () => (dispatch: Dispatch<any>) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    makeRequest(dispatch, "/api/info", undefined, res => {
      if (res.status === 200) {
        res.json().then(({ environment }) => {
          dispatch(getInfoSuccess({ environment }));
          resolve();
        });
      }
    }).catch(err => reject(err));
  });
  return promise;
};

export const forgotPassword = (username: string) => (dispatch: Dispatch<any>) =>
  makeRequest(
    dispatch,
    "/api/password/forgot",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username })
    },
    res => {
      if (res.status !== 200) {
        dispatch(errorOccurred("Request to reset password failed"));
        return false;
      }
      return true;
    }
  ).catch(err => {
    dispatch(errorOccurred("Request to reset password failed"));
    throw err;
  });

export const resetPassword = (resetToken: string, password: string) => (
  dispatch: Dispatch<any>
) =>
  makeRequest(
    dispatch,
    "/api/password/reset",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resetToken, password })
    },
    res => {
      if (res.status !== 200) {
        dispatch(errorOccurred("Password reset failed"));
        return false;
      }
      return true;
    }
  ).catch(err => {
    dispatch(errorOccurred("Password reset failed"));
    throw err;
  });

export const addGrantStarted = () => {
  return { type: "ADD_GRANT_STARTED" };
};

export const addGrantFaild = () => {
  return {
    type: "ADD_GRANT_FAILED"
  };
};

export const addGrantSuccessful = (grants: $Shape<$Shape<Grant>>[]) => {
  return {
    type: "ADD_GRANT_SUCCESS",
    payload: grants
  };
};

export const addGrant = (grant: AddGrantModel, errorMessage: string) => (
  dispatch: Dispatch<any>
) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    dispatch(addGrantStarted());
    makeRequest(
      dispatch,
      "/api/grants/",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(grant)
      },
      res => {
        if (res.status === 200) {
          res.json().then(grants => {
            dispatch(addGrantSuccessful(grants));
            resolve();
          });
        } else {
          dispatch(addGrantFaild());
          dispatch(errorOccurred(errorMessage));
          reject("Unable to insert grant");
        }
      }
    ).catch(err => {
      dispatch(addGrantFaild());
      dispatch(errorOccurred(errorMessage));
      reject(err);
    });
  });
  return promise;
};

export const addUserStarted = () => {
  return { type: "ADD_USER_STARTED" };
};

export const addUserFaild = () => {
  return {
    type: "ADD_USER_FAILED"
  };
};

export const addUserSuccessful = (users: User[]) => {
  return {
    type: "ADD_USER_SUCCESS",
    payload: users
  };
};

export const addUser = (user: User, errorMessage: string) => (
  dispatch: Dispatch<any>
) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    dispatch(addUserStarted());
    makeRequest(
      dispatch,
      "/api/users/",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(user)
      },
      res => {
        if (res.status === 200) {
          res.json().then(users => {
            dispatch(addUserSuccessful(users));
            resolve();
          });
        } else {
          dispatch(addUserFaild());
          dispatch(errorOccurred(errorMessage));
          reject("Unable to insert user");
        }
      }
    ).catch(err => {
      dispatch(addUserFaild());
      dispatch(errorOccurred(errorMessage));
      reject(err);
    });
  });
  return promise;
};

export const selectGrant = (grant: $Shape<Grant>) => {
  return {
    type: "SELECT_GRANT",
    payload: grant
  };
};

export const updateGrantStarted = () => {
  return { type: "UPDATE_GRANT_STARTED" };
};

export const updateGrantSuccessful = (grant: $Shape<Grant>) => {
  return {
    type: "UPDATE_GRANT_SUCCESS",
    payload: grant
  };
};

export const updateGrantFailed = () => {
  return { type: "UPDATE_GRANT_FAILED" };
};

export const updateGrant = (grant: $Shape<Grant>, errorMessage: string) => (
  dispatch: Dispatch<any>
) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    dispatch(updateGrantStarted());
    makeRequest(
      dispatch,
      `/api/grants/${grant.id}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(grant)
      },
      res => {
        if (res.status === 200) {
          res.json().then(grant => {
            dispatch(updateGrantSuccessful(grant));
            resolve();
          });
        } else {
          dispatch(updateGrantFailed());
          dispatch(errorOccurred(errorMessage));
          reject("Unable to update");
        }
      }
    ).catch(err => {
      dispatch(updateGrantFailed());
      dispatch(errorOccurred(errorMessage));
      reject(err);
    });
  });
  return promise;
};

export const deleteUserStarted = () => {
  return { type: "DELETE_USER_STARTED" };
};

export const deleteUserSuccess = (userId: number) => {
  return {
    type: "DELETE_USER_SUCCESS",
    payload: userId
  };
};

export const deleteUserFailed = (errorMessage: string) => {
  return {
    type: "DELETE_USER_FAILED",
    payload: errorMessage
  };
};

export const deleteUser = (userId: number, errorMessage: string) => (
  dispatch: Dispatch<any>
) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    dispatch(deleteUserStarted());
    makeRequest(
      dispatch,
      `/api/users/${userId}`,
      {
        method: "DELETE",
        headers: { "content-type": "application/json" }
      },
      res => {
        if (res.status === 200) {
          dispatch(deleteUserSuccess(userId));
          resolve();
        } else {
          dispatch(deleteUserFailed(errorMessage));
          dispatch(errorOccurred(errorMessage));
          reject("Unable to delete");
        }
      }
    ).catch(err => {
      dispatch(deleteUserFailed(err));
      dispatch(errorOccurred(err));
      reject(err);
    });
  });
  return promise;
};

export const makeRequest = (
  dispatch: Dispatch<any>,
  url: string,
  options?: any = undefined,
  callback?: any => any = () => {}
) => {
  dispatch(requestStarted());
  return fetch(url, options)
    .then(res => callback(res))
    .then(value => {
      dispatch(requestFinished());
      return value;
    })
    .catch(err => {
      dispatch(requestFinished());
      throw err;
    });
};
