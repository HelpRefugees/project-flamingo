import reducers, { type State, initialState } from "./reducers";
import type { Report } from "./report/models";
import type { Account } from "./authentication/models";

describe("reducers", () => {
  const account: Account = {
    username: "steve@email.org",
    name: "Also Steve",
    role: "some-role"
  };

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

  it("should handle LOAD_REPORTS_SUCCESS", () => {
    const reports: $Shape<Report>[] = [
      {
        grant: "hugh grant",
        overview: "",
        completed: false,
        id: 1,
        reportPeriod: "2018-10-01T00:00:00.000Z",
        keyActivity: {},
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: ""
      }
    ];
    const startingState: State = {
      ...initialState,
      account,
      reports: undefined
    };
    const expectedState: State = {
      ...startingState,
      reports
    };

    expect(
      reducers(startingState, {
        type: "LOAD_REPORTS_SUCCESS",
        payload: reports
      })
    ).toEqual(expectedState);
  });

  it("should handle SET_LOGGED_IN_ERROR", () => {
    let state = reducers(
      { ...initialState, account },
      {
        type: "SET_LOGGED_IN_ERROR"
      }
    );
    expect(state.isAuthenticated).toEqual(false);
    expect(state.account).toBeUndefined();
  });

  it("should handle SET_LOGGED_OUT", () => {
    const startingState: State = {
      ...initialState,
      account,
      isAuthenticated: true,
      isLoading: false
    };

    let newState = reducers(startingState, {
      type: "SET_LOGGED_OUT"
    });

    expect(newState.isAuthenticated).toBeUndefined();
    expect(newState.account).toBeUndefined();
  });

  it("should handle SAVE_REPORT_START", () => {
    const startingState: State = {
      ...initialState,
      submittedReport: true
    };

    const finishingState = reducers(startingState, {
      type: "SAVE_REPORT_START"
    });

    expect(finishingState.submittedReport).toBe(false);
  });

  it("should handle SAVE_REPORT_SUCCESS", () => {
    const reportToBeEdited: $Shape<Report> = {
      id: 123,
      grant: "mitchell",
      overview: "before",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: ""
    };
    const reportAfterEditing: Report = {
      ...reportToBeEdited,
      overview: "after"
    };
    const reportNotToBeEdited: $Shape<Report> = {
      id: 456,
      grant: "shapps",
      overview: "who cares?",
      completed: true,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivity: {},
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: ""
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

  it("should handle SAVE_REPORT_SUCCESS for submitted report", () => {
    const reportToBeSubmitted: $Shape<Report> = {
      id: 1,
      completed: false
    };

    const startingState: State = {
      ...initialState,
      reports: [reportToBeSubmitted]
    };

    const finishingState = reducers(startingState, {
      type: "SAVE_REPORT_SUCCESS",
      payload: { ...reportToBeSubmitted, completed: true }
    });

    expect(finishingState.submittedReport).toBe(true);
  });

  it("should handle SAVE_REPORT_FAILURE", () => {
    expect(
      reducers(initialState, {
        type: "SAVE_REPORT_FAILURE"
      }).savedReport
    ).toEqual(false);
  });

  it("should handle SET_LOADING", () => {
    expect(reducers(initialState, { type: "SET_LOADING" }).isLoading).toBe(
      true
    );
  });

  it("should handle SET_NOT_LOADING", () => {
    expect(
      reducers(
        { ...initialState, isLoading: true },
        { type: "SET_NOT_LOADING" }
      ).isLoading
    ).toBe(false);
  });
});
