import type { Dispatch } from "redux";

import * as actions from "./actions";
import { assertLater } from "./testHelpers";

describe("actions", () => {
  let action: (dispatch: Dispatch<any>) => any;
  let mockDispatch;

  it("loginSuccessful should create SET_LOGGED_IN action", () => {
    expect(actions.loginSuccessful()).toEqual({
      type: "SET_LOGGED_IN"
    });
  });

  it("loginFailed should create SET_LOGGED_IN_ERROR action", () => {
    expect(actions.loginFailed()).toEqual({
      type: "SET_LOGGED_IN_ERROR"
    });
  });

  it("loginInitialized should create SET_LOGGED_OUT action", () => {
    expect(actions.logout()).toEqual({
      type: "SET_LOGGED_OUT"
    });
  });

  it("receiveReports should create ADD_REPORTS action", () => {
    const reports = [];
    expect(actions.receiveReports(reports)).toEqual({
      type: "ADD_REPORTS",
      payload: reports
    });
  });

  describe("loadReports", () => {
    beforeEach(() => {
      mockDispatch = jest.fn();
      fetch.resetMocks();

      action = actions.loadReports();
    });

    it("makes a request to the backend", () => {
      fetch.mockResponseOnce("[]");

      action(mockDispatch);

      expect(fetch.mock.calls.length).toEqual(1);
      const [url] = fetch.mock.calls[0];
      expect(url).toEqual("/api/reports");
    });

    it("dispatches reports when the request succeed", done => {
      fetch.mockResponseOnce("[]");

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.receiveReports([]));
      });
    });
  });

  describe("login", () => {
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
