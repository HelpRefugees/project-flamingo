import reducers, { type State, initialState } from "./reducers";
import type { Report } from "./report/models";
import type { Account } from "./authentication/models";

describe("reducers", () => {
  it("should handle initial state", () => {
    expect(
      reducers(undefined, {
        type: ""
      })
    ).toEqual(initialState);
  });

  it("should handle SET_LOGGED_IN", () => {
    const account: Account = {
      username: "steve@email.org",
      name: "Also Steve",
      role: "some-role"
    };

    const newState = reducers(initialState, {
      type: "SET_LOGGED_IN",
      payload: account
    });

    expect(newState.isAuthenticated).toEqual(true);
    expect(newState.account).toEqual(account);
  });

  it("should handle ADD_REPORTS", () => {
    const account: Account = {
      username: "steve@email.org",
      name: "Also Steve",
      role: "some-role"
    };

    const reports: Report[] = [
      { grant: "hugh grant", overview: "", completed: false, id: 1 }
    ];
    const startingState: State = {
      isAuthenticated: true,
      reports: undefined,
      savedReport: undefined,
      account: account
    };
    const expectedState: State = {
      isAuthenticated: true,
      reports,
      savedReport: undefined,
      account: account
    };

    expect(
      reducers(startingState, {
        type: "ADD_REPORTS",
        payload: reports
      })
    ).toEqual(expectedState);
  });

  it("should handle SET_LOGGED_IN_ERROR", () => {
    expect(
      reducers(initialState, {
        type: "SET_LOGGED_IN_ERROR"
      }).isAuthenticated
    ).toEqual(false);
  });

  it("should handle SET_LOGGED_OUT", () => {
    const account = {
      username: "steve@email.org",
      name: "Also Steve",
      role: "some-role"
    };

    const startingState: State = {
      isAuthenticated: true,
      reports: undefined,
      savedReport: undefined,
      account: account
    };

    let newState = reducers(startingState, {
      type: "SET_LOGGED_OUT"
    });

    expect(newState.isAuthenticated).toBeUndefined();
    expect(newState.account).toBeUndefined();
  });

  it("should handle SAVE_REPORT_SUCCESS", () => {
    const reportToBeEdited: Report = {
      id: 123,
      grant: "mitchell",
      overview: "before",
      completed: false
    };
    const reportAfterEditing: Report = {
      ...reportToBeEdited,
      overview: "after"
    };
    const reportNotToBeEdited: Report = {
      id: 456,
      grant: "shapps",
      overview: "who cares?",
      completed: true
    };
    const startingState: State = {
      ...initialState,
      reports: [reportToBeEdited, reportNotToBeEdited]
    };

    const finishingState = reducers(startingState, {
      type: "SAVE_REPORT_SUCCESS",
      payload: reportAfterEditing
    });

    const newReports: Report[] = (finishingState.reports: any);
    expect(finishingState.savedReport).toEqual(true);
    expect(
      newReports.find(report => report.id === reportToBeEdited.id)
    ).toEqual(reportAfterEditing);
    expect(
      newReports.find(report => report.id === reportNotToBeEdited.id)
    ).toEqual(reportNotToBeEdited);
  });

  it("should handle SAVE_REPORT_FAILURE", () => {
    expect(
      reducers(initialState, {
        type: "SAVE_REPORT_FAILURE"
      }).savedReport
    ).toEqual(false);
  });
});
