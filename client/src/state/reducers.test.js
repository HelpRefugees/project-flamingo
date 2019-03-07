import reducers, { type State, initialState } from "./reducers";
import { Account } from "../authentication/models";
import { type Report } from "../my-report/models";
import { type Grant } from "../grants/models";

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

  it("should handle LOAD_REPORT_SUCCESS", () => {
    const report: $Shape<Report> = {};

    expect(
      reducers(initialState, {
        type: "LOAD_REPORT_SUCCESS",
        payload: report
      }).report
    ).toEqual(report);
  });

  it("should handle LOAD_REPORT_START", () => {
    const report: $Shape<Report> = {};

    expect(
      reducers(
        { ...initialState, report: report },
        {
          type: "LOAD_REPORT_START"
        }
      ).report
    ).toBeUndefined();
  });

  it("should handle LOAD_REPORTS_SUCCESS", () => {
    const reports: $Shape<Report>[] = [
      {
        grant: "hugh grant",
        overview: "",
        completed: false,
        id: 1,
        reportPeriod: "2018-10-01T00:00:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
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

  it("should handle SAVE_REPORT_SUCCESS", () => {
    const reportToBeEdited: $Shape<Report> = {
      id: 123,
      grant: "mitchell",
      overview: "before",
      completed: false,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: ""
    };
    const reportAfterEditing: $Shape<Report> = {
      ...reportToBeEdited,
      overview: "after"
    };
    const reportNotToBeEdited: $Shape<Report> = {
      id: 456,
      grant: "shapps",
      overview: "who cares?",
      completed: true,
      reportPeriod: "2018-10-01T00:00:00.000Z",
      keyActivities: [{}],
      operatingEnvironment: "",
      beneficiaryFeedback: "",
      challengesFaced: "",
      incidents: "",
      otherIssues: ""
    };
    const startingState: State = {
      ...initialState,
      reports: [reportToBeEdited, reportNotToBeEdited]
    };

    const finishingState = reducers(startingState, {
      type: "SAVE_REPORT_SUCCESS",
      payload: reportAfterEditing
    });

    const newReports: $Shape<Report>[] = (finishingState.reports: any);
    expect(
      newReports.find(report => report.id === reportToBeEdited.id)
    ).toEqual(reportAfterEditing);
    expect(
      newReports.find(report => report.id === reportNotToBeEdited.id)
    ).toEqual(reportNotToBeEdited);
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

  it("should handle SET_ERROR_MESSAGE", () => {
    const message = "lol whoops";
    expect(
      reducers(initialState, { type: "SET_ERROR_MESSAGE", payload: message })
        .errorMessage
    ).toBe(message);
  });

  it("should handle CLEAR_ERROR_MESSAGE", () => {
    const message = "lol whoops";
    expect(
      reducers(
        { ...initialState, errorMessage: message },
        { type: "CLEAR_ERROR_MESSAGE" }
      ).errorMessage
    ).toBeUndefined();
  });

  it("should handle GET_INFO_SUCCESS", () => {
    const environment = "test";

    const nextState = reducers(initialState, {
      type: "GET_INFO_SUCCESS",
      payload: { environment }
    });

    expect(nextState.environment).toBe(environment);
  });

  it("should handle LOAD_GRANTS_SUCCESS", () => {
    const grants: $Shape<Grant>[] = [
      {
        grant: "hugh grant",
        owner: "some user",
        id: 10,
        organization: "string",
        sector: "string",
        description: "string",
        country: "string",
        region: "string",
        otherInfo: "string"
      }
    ];
    const startingState: State = {
      ...initialState,
      account,
      grants: undefined
    };
    const expectedState: State = {
      ...startingState,
      grants
    };

    expect(
      reducers(startingState, {
        type: "LOAD_GRANTS_SUCCESS",
        payload: grants
      })
    ).toEqual(expectedState);
  });

  it("should handle ADD_GRANT_SUCCESS", () => {
    const grants = [
      {
        username: "abnc",
        grant: "dbdde",
        id: 10,
        name: "ali",
        organization: "string",
        sector: "string",
        description: "string",
        country: "string",
        region: "string",
        otherInfo: "string"
      }
    ];
    const expectedState = {
      ...initialState,
      grants: grants
    };

    const nextState = reducers(initialState, {
      type: "ADD_GRANT_SUCCESS",
      payload: grants
    });
    expect(nextState).toEqual(expectedState);
  });
});
