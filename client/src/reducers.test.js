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

  it("should handle SET_NOT_LOGGED_IN", () => {
    expect(
      reducers(
        {},
        {
          type: "SET_NOT_LOGGED_IN"
        }
      )
    ).toEqual({
      isAuthenticated: false
    });
  });

  it("should handle INITIALIZE_LOGGED_IN", () => {
    expect(
      reducers(
        {},
        {
          type: "INITIALIZE_LOGGED_IN"
        }
      )
    ).toEqual({});
  });
});
