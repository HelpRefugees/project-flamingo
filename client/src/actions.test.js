import * as actions from "./actions";

describe("actions", () => {
  it("loginSuccessful should create SET_LOGGED_IN action", () => {
    expect(actions.loginSuccessful()).toEqual({
      type: "SET_LOGGED_IN"
    });
  });

  it("loginFailed should create SET_NOT_LOGGED_IN action", () => {
    expect(actions.loginFailed()).toEqual({
      type: "SET_NOT_LOGGED_IN"
    });
  });

  describe("login", () => {
    let action;
    let mockDispatch;

    const username = "cookie monster";
    const password = "COOKIES!";

    beforeEach(() => {
      mockDispatch = jest.fn();
      fetch.resetMocks();

      action = actions.login({ username, password });
    });

    it("makes a request to the backend with the appropriate credentials", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(fetch.mock.calls.length).toEqual(1);
      const [url, options] = fetch.mock.calls[0];
      expect(url).toEqual("/api/login");
      expect(options.method).toBe("POST");
      expect(options.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(options.body)).toEqual({ username, password });
    });

    it("dispatches login success when the request succeeds", done => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.loginSuccessful());
      });
    });

    it("dispatches login failed when the request fails", done => {
      fetch.mockResponseOnce("", { status: 401 });

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.loginFailed());
      });
    });
  });
});
