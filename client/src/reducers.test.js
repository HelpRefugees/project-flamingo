import reducers, { type State, initialState } from "./reducers";
import type { Report } from "./home/models";

describe("reducers", () => {
  it("should handle initial state", () => {
    expect(
      reducers(undefined, {
        type: ""
      })
    ).toEqual(initialState);
  });

  it("should handle SET_LOGGED_IN", () => {
    expect(
      reducers(initialState, {
        type: "SET_LOGGED_IN"
      }).isAuthenticated
    ).toEqual(true);
  });

  it("should handle ADD_REPORTS", () => {
    const reports: Report[] = [{ grant: "hugh grant" }];
    const startingState: State = {
      isAuthenticated: true,
      reports: undefined
    };
    const expectedState: State = {
      isAuthenticated: true,
      reports
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
    expect(
      reducers(initialState, {
        type: "SET_LOGGED_OUT"
      }).isAuthenticated
    ).toBeUndefined();
  });
});
