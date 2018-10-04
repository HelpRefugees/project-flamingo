import reducers from "./reducers";

describe("reducers", () => {
  it("should handle initial state", () => {
    expect(
      reducers(undefined, {
        type: ""
      })
    ).toEqual({});
  });

  it("should handle SET_LOGGED_IN", () => {
    expect(
      reducers(
        {},
        {
          type: "SET_LOGGED_IN"
        }
      )
    ).toEqual({
      isAuthenticated: true
    });
  });

  it("should handle SET_LOGGED_IN_ERROR", () => {
    expect(
      reducers(
        {},
        {
          type: "SET_LOGGED_IN_ERROR"
        }
      )
    ).toEqual({
      isAuthenticated: false
    });
  });

  it("should handle SET_LOGGED_OUT", () => {
    expect(
      reducers(
        {},
        {
          type: "SET_LOGGED_OUT"
        }
      )
    ).toEqual({});
  });
});
