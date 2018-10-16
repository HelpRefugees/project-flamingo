import type { Dispatch } from "redux";

import type { Report } from "./report/models";
import * as actions from "./actions";
import { assertLater } from "./testHelpers";
import type { Account } from "./authentication/models";

describe("actions", () => {
  let action: (dispatch: Dispatch<any>) => any;
  let mockDispatch;

  it("loginSuccessful should create SET_LOGGED_IN action", () => {
    const account: Account = {
      username: "Steve@ip.org",
      name: "Also Steve",
      role: "implementing-partner"
    };
    expect(actions.loginSuccessful(account)).toEqual({
      type: "SET_LOGGED_IN",
      payload: account
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
    expect(actions.receivedReports(reports)).toEqual({
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

      expect(fetch.mock.calls).toHaveLength(1);
      const [url] = fetch.mock.calls[0];
      expect(url).toEqual("/api/reports");
    });

    it("dispatches reports when the request succeed", done => {
      fetch.mockResponseOnce("[]");

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.receivedReports([]));
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

      expect(fetch.mock.calls).toHaveLength(1);
      const [url, options] = fetch.mock.calls[0];
      expect(url).toEqual("/api/login");
      expect(options.method).toBe("POST");
      expect(options.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(options.body)).toEqual({ username, password });
    });

    it("dispatches login success action when the request succeeds", done => {
      const account: Account = {
        username: "Steve@ip.org",
        name: "Also Steve",
        role: "implementing-partner"
      };
      fetch.mockResponseOnce(JSON.stringify(account));

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          actions.loginSuccessful(account)
        );
      });
    });

    it("dispatches login failed action when the request fails", done => {
      fetch.mockResponseOnce("", { status: 401 });

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.loginFailed());
      });
    });
  });

  describe("save reports", () => {
    it("saveReportSuccessful should create SAVE_REPORT_SUCCESS action with payload", () => {
      const report: Report = {
        id: 123,
        grant: "mitchell",
        overview: "everything is fine",
        completed: false
      };
      expect(actions.updateReportSuccessful(report)).toEqual({
        type: "SAVE_REPORT_SUCCESS",
        payload: report
      });
    });

    it("saveReportFailed should create SAVE_REPORT_FAILURE action", () => {
      expect(actions.updateReportFailed()).toEqual({
        type: "SAVE_REPORT_FAILURE"
      });
    });

    describe("saveReport", () => {
      let action;
      let mockDispatch;
      const report: Report = {
        id: 123,
        grant: "Grant title",
        overview: "My report overview",
        completed: false
      };

      beforeEach(() => {
        mockDispatch = jest.fn();
        fetch.resetMocks();

        action = actions.updateReport(report);
      });

      it("makes a request to the backend with report progress status", () => {
        fetch.mockResponseOnce("{}");

        action(mockDispatch);

        expect(fetch.mock.calls).toHaveLength(1);
        const [url, options] = fetch.mock.calls[0];
        expect(url).toEqual("/api/reports/123");
        expect(options.method).toBe("PUT");
        expect(options.headers["content-type"]).toBe("application/json");
        expect(JSON.parse(options.body)).toEqual(report);
      });

      it("dispatches save report success when the request succeeds", done => {
        fetch.mockResponseOnce("{}");

        action(mockDispatch);

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(
            actions.updateReportSuccessful(report)
          );
        });
      });

      it("dispatches save report failed when the request fails with 4xx", done => {
        fetch.mockResponseOnce("", { status: 400 });

        action(mockDispatch);

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(
            actions.updateReportFailed()
          );
        });
      });
    });
  });
});
