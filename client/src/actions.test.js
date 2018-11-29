import type { Dispatch } from "redux";

import type { Report } from "./my-report/models";
import * as actions from "./actions";
import { assertLater } from "./testHelpers";
import type { Account } from "./authentication/models";
import type { Grant } from "./grants/models";
import { errorOccurred } from "./actions";

describe("actions", () => {
  let action: (dispatch: Dispatch<any>) => any;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    fetch.resetMocks();
  });

  describe("simple actions", () => {
    it("errorOccurred should create SET_ERROR_MESSAGE action with payload", () => {
      const message = "something bad happened";
      expect(actions.errorOccurred(message)).toEqual({
        type: "SET_ERROR_MESSAGE",
        payload: message
      });
    });

    it("errorExpired should create CLEAR_ERROR_MESSAGE action", () => {
      expect(actions.errorExpired()).toEqual({
        type: "CLEAR_ERROR_MESSAGE"
      });
    });

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

    it("logoutSuccessful should create SET_LOGGED_OUT action", () => {
      expect(actions.logoutSuccessful()).toEqual({
        type: "SET_LOGGED_OUT"
      });
    });

    it("loadReportsStarted should create LOAD_REPORTS_STARTED action", () => {
      expect(actions.loadReportsStarted()).toEqual({
        type: "LOAD_REPORTS_STARTED"
      });
    });

    it("loadReportsSuccessful should create LOAD_REPORTS_SUCCESS action", () => {
      const reports = [];
      expect(actions.loadReportsSuccessful(reports)).toEqual({
        type: "LOAD_REPORTS_SUCCESS",
        payload: reports
      });
    });

    it("loadReport should create LOAD_REPORT_SUCCESS action", () => {
      const report: $Shape<Report> = { id: 123, grant: "hello" };
      expect(actions.loadReportSuccessful(report)).toEqual({
        type: "LOAD_REPORT_SUCCESS",
        payload: report
      });
    });

    it("loadReportStarted should create LOAD_REPORT_START action", () => {
      expect(actions.loadReportStarted()).toEqual({
        type: "LOAD_REPORT_START"
      });
    });

    it("requestStarted should create SET_LOADING action", () => {
      expect(actions.requestStarted()).toEqual({
        type: "SET_LOADING"
      });
    });

    it("requestFinished should create SET_NOT_LOADING action", () => {
      expect(actions.requestFinished()).toEqual({ type: "SET_NOT_LOADING" });
    });

    it("updateReportStarted should create SAVE_REPORT_START action", () => {
      expect(actions.updateReportStarted()).toEqual({
        type: "SAVE_REPORT_START"
      });
    });

    it("addGrantStarted should create ADD_GRANT_START action", () => {
      expect(actions.addGrantStarted()).toEqual({
        type: "ADD_GRANT_STARTED"
      });
    });

    it("addGrantSuccessful should create ADD_GRANT_SUCCESS action", () => {
      const grants = [
        {
          username: "abnc",
          grant: "dbdde",
          name: "ali",
          id: 10,
          organization: "string",
          sector: "string",
          description: "string",
          country: "string",
          region: "string",
          otherInfo: "string"
        }
      ];
      expect(actions.addGrantSuccessful(grants)).toEqual({
        type: "ADD_GRANT_SUCCESS",
        payload: grants
      });
    });

    it("addGrantFailed should create ADD_GRANT_FAILED action", () => {
      const error = "Error msg";
      expect(actions.addGrantFaild(error)).toEqual({
        type: "ADD_GRANT_FAILED",
        payload: error
      });
    });
  });

  describe("loadReports", () => {
    beforeEach(() => {
      action = actions.loadReports();
    });

    it("makes a request to the backend", () => {
      fetch.mockResponseOnce("[]");

      action(mockDispatch);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url] = fetch.mock.calls[0];
      expect(url).toEqual("/api/reports");
    });

    it("dispatches the loadReportsStarted", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(actions.loadReportsStarted());
    });

    it("dispatches the request started when calling the backend", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(actions.requestStarted());
    });

    it("dispatches the request finished when request is done", done => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.requestFinished());
      });
    });

    it("dispatches reports when the request succeed", done => {
      const reports: Report[] = [];

      fetch.mockResponseOnce(JSON.stringify(reports));

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          actions.loadReportsSuccessful(reports)
        );
      });
    });
  });

  describe("loadReport", () => {
    beforeEach(() => {
      action = actions.loadReport(123);
    });

    it("dispatches loadReportStarted", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(actions.loadReportStarted());
    });

    it("makes a request to the backend", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url] = fetch.mock.calls[0];
      expect(url).toEqual("/api/reports/123");
    });

    it("dispatches report when the request succeed", done => {
      const report: $Shape<Report> = { id: 123, grant: "Our report" };

      fetch.mockResponseOnce(JSON.stringify(report));

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          actions.loadReportSuccessful(report)
        );
      });
    });

    it("returns a promise resolving to the report on success", () => {
      fetch.mockResponseOnce('{"id": 123}');

      return expect(action(mockDispatch)).resolves.toEqual({ id: 123 });
    });

    it("returns a promise resolving to undefined on failure", () => {
      fetch.mockResponseOnce("", { status: 403 });

      return expect(action(mockDispatch)).resolves.toBeUndefined();
    });

    it("returns a promise rejecting on error", () => {
      const err = new Error("lol whoops");
      fetch.mockReject(err);

      return expect(action(mockDispatch)).rejects.toBe(err);
    });
  });

  describe("getInfo", () => {
    it("requests the info endpoint", done => {
      fetch.mockResponseOnce('{"environment":"test"}');

      const action = actions.getInfo();
      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          actions.getInfoSuccess({ environment: "test" })
        );
      });
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      action = actions.logout();
    });

    it("makes a request to the backend", () => {
      fetch.mockResponseOnce();

      action(mockDispatch);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url, options] = fetch.mock.calls[0];
      expect(url).toEqual("/api/login");
      expect(options.method).toBe("DELETE");
    });

    it("dispatches logoutSuccessful when the request succeeds", done => {
      fetch.mockResponseOnce("", { status: 204 });

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.logoutSuccessful());
      });
    });
  });

  describe("login", () => {
    const username = "cookie monster";
    const password = "COOKIES!";

    beforeEach(() => {
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

    it("dispatches the request started when calling the backend", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(actions.requestStarted());
    });

    it("dispatches the request finished when request is done", done => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.requestFinished());
      });
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

  describe("update report", () => {
    it("updateReportSuccessful should create SAVE_REPORT_SUCCESS action with payload", () => {
      const report: $Shape<Report> = {
        id: 123,
        grant: "mitchell",
        overview: "everything is fine",
        completed: false,
        reportPeriod: "2018-10-01T00:00:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "",
        beneficiaryFeedback: "",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
      };
      expect(actions.updateReportSuccessful(report)).toEqual({
        type: "SAVE_REPORT_SUCCESS",
        payload: report
      });
    });

    it("updateReportFailed should create SAVE_REPORT_FAILURE action", () => {
      expect(actions.updateReportFailed()).toEqual({
        type: "SAVE_REPORT_FAILURE"
      });
    });

    describe("update report", () => {
      const errorMessage = "something went wrong";

      const report: $Shape<Report> = {
        id: 123,
        grant: "Grant title",
        overview: "My report overview",
        completed: false,
        reportPeriod: "2018-10-01T00:00:00.000Z",
        keyActivities: [{}],
        operatingEnvironment: "Changes in operating environment",
        beneficiaryFeedback: "beneficiaryFeedback",
        challengesFaced: "",
        incidents: "",
        otherIssues: ""
      };

      beforeEach(() => {
        action = actions.updateReport(report, errorMessage);
      });

      it("dispatches updateReportStarted action", () => {
        fetch.mockResponseOnce("{}");

        action(mockDispatch);

        expect(mockDispatch).toHaveBeenCalledWith(
          actions.updateReportStarted()
        );
      });

      it("makes a request to the backend with report progress status", () => {
        fetch.mockResponseOnce("{}");

        action(mockDispatch);

        expect(fetch.mock.calls).toHaveLength(1);
        const [url, options] = fetch.mock.calls[0];
        expect(url).toEqual("/api/reports/123");
        expect(options.method).toBe("PATCH");
        expect(options.headers["content-type"]).toBe("application/json");
        expect(JSON.parse(options.body)).toEqual([
          { op: "replace", path: "/overview", value: report.overview },
          { op: "replace", path: "/completed", value: report.completed },
          {
            op: "replace",
            path: "/keyActivities",
            value: report.keyActivities
          },
          {
            op: "replace",
            path: "/operatingEnvironment",
            value: report.operatingEnvironment
          },
          {
            op: "replace",
            path: "/beneficiaryFeedback",
            value: report.beneficiaryFeedback
          },
          {
            op: "replace",
            path: "/challengesFaced",
            value: report.challengesFaced
          },
          {
            op: "replace",
            path: "/incidents",
            value: report.incidents
          },
          {
            op: "replace",
            path: "/otherIssues",
            value: report.otherIssues
          },
          {
            op: "replace",
            path: "/materialsForFundraising",
            value: report.materialsForFundraising
          }
        ]);
      });

      it("dispatches the request started when calling the backend", () => {
        fetch.mockResponseOnce("{}");

        action(mockDispatch);

        expect(mockDispatch).toHaveBeenCalledWith(actions.requestStarted());
      });

      it("dispatches the request finished when request is done", done => {
        fetch.mockResponseOnce("{}");

        action(mockDispatch);

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(actions.requestFinished());
        });
      });

      it("dispatches save report success when the request succeeds", done => {
        const updatedReport: any = {
          grant: "Hugh Grant"
        };
        fetch.mockResponseOnce(JSON.stringify(updatedReport));

        action(mockDispatch);

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(
            actions.updateReportSuccessful(updatedReport)
          );
        });
      });

      it("dispatches load report success when the request succeeds", done => {
        const updatedReport: any = {
          grant: "Hugh Grant"
        };
        fetch.mockResponseOnce(JSON.stringify(updatedReport));

        action(mockDispatch);

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(
            actions.loadReportSuccessful(updatedReport)
          );
        });
      });

      it("dispatches error occurred when the request fails", done => {
        fetch.mockReject(new Error("update report error"));
        action(mockDispatch).catch(() => {});

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(
            actions.errorOccurred(errorMessage)
          );
        });
      });

      it("dispatches save report failed when the request returns a 4xx", done => {
        fetch.mockResponseOnce("", { status: 400 });

        action(mockDispatch).catch(() => {});

        assertLater(done, () => {
          expect(mockDispatch).toHaveBeenCalledWith(
            actions.errorOccurred(errorMessage)
          );
        });
      });
    });
  });

  describe("loadGrants", () => {
    beforeEach(() => {
      action = actions.loadGrants();
    });

    it("makes a request to the backend", () => {
      fetch.mockResponseOnce("[]");

      action(mockDispatch);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url] = fetch.mock.calls[0];
      expect(url).toEqual("/api/grants");
    });

    it("dispatches the loadGrantsStarted", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(actions.loadGrantsStarted());
    });

    it("dispatches the request started when calling the backend", () => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(actions.requestStarted());
    });

    it("dispatches the request finished when request is done", done => {
      fetch.mockResponseOnce("{}");

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.requestFinished());
      });
    });

    it("dispatches grants when the request succeed", done => {
      const grants: Grant[] = [];

      fetch.mockResponseOnce(JSON.stringify(grants));

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          actions.loadGrantsSuccessful(grants)
        );
      });
    });
  });

  describe("forgotPassword", () => {
    const username = "foo@bar.com";
    beforeEach(() => {
      action = actions.forgotPassword(username);
    });

    it("makes a request to the backend with the username", () => {
      fetch.mockResponseOnce();

      action(mockDispatch);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url, options] = fetch.mock.calls[0];
      expect(url).toEqual("/api/password/forgot");
      expect(options.method).toBe("POST");
      expect(options.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(options.body)).toEqual({ username });
    });

    it("resolves the promise with true when the request succeeds", () => {
      fetch.mockResponseOnce();

      return expect(action(mockDispatch)).resolves.toBe(true);
    });

    it("resolves the promise with false when the request fails", () => {
      fetch.mockResponseOnce("", { status: 404 });

      return expect(action(mockDispatch)).resolves.toBe(false);
    });

    it("rejects the promise when the request fails", () => {
      let error = new Error("request failed");
      fetch.mockReject(error);

      return expect(action(mockDispatch)).rejects.toBe(error);
    });

    it("dispatches error occurred when the request fails", done => {
      fetch.mockResponseOnce("", { status: 500 });

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          errorOccurred("Request to reset password failed")
        );
      });
    });

    it("dispatches error occurred when the request errors", done => {
      let error = new Error("request failed");
      fetch.mockReject(error);

      action(mockDispatch).catch(() => {});

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          errorOccurred("Request to reset password failed")
        );
      });
    });
  });

  describe("resetPassword", () => {
    const password = "passw0rd";
    const resetToken = "thisisatoken";

    beforeEach(() => {
      action = actions.resetPassword(resetToken, password);
    });

    it("makes a request to the backend with the password and token", () => {
      fetch.mockResponseOnce();

      action(mockDispatch);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url, options] = fetch.mock.calls[0];
      expect(url).toEqual("/api/password/reset");
      expect(options.method).toBe("POST");
      expect(options.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(options.body)).toEqual({ password, resetToken });
    });

    it("resolves the promise with true when the request succeeds", () => {
      fetch.mockResponseOnce();

      return expect(action(mockDispatch)).resolves.toBe(true);
    });

    it("resolves the promise with false when the request fails", () => {
      fetch.mockResponseOnce("", { status: 404 });

      return expect(action(mockDispatch)).resolves.toBe(false);
    });

    it("dispatches error occurred when the request fails", done => {
      fetch.mockResponseOnce("", { status: 404 });

      action(mockDispatch);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          errorOccurred("Password reset failed")
        );
      });
    });

    it("rejects the promise when the request errors", () => {
      let error = new Error("request failed");
      fetch.mockReject(error);

      return expect(action(mockDispatch)).rejects.toBe(error);
    });

    it("dispatches error occurred when the request errors", done => {
      let error = new Error("request failed");
      fetch.mockReject(error);

      action(mockDispatch).catch(() => {});

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          errorOccurred("Password reset failed")
        );
      });
    });
  });

  describe("makeRequest", () => {
    const requestUrl = "http://example.org";
    const requestOptions = { method: "GET" };

    it("makes a request to the backend with URL and options", () => {
      fetch.mockResponseOnce("{}");

      actions.makeRequest(mockDispatch, requestUrl, requestOptions);

      expect(fetch.mock.calls).toHaveLength(1);
      const [url, options] = fetch.mock.calls[0];
      expect(url).toEqual(requestUrl);
      expect(options).toEqual(requestOptions);
    });

    it("handles an error from fetch", done => {
      fetch.mockReject(new Error("fake error message"));

      actions
        .makeRequest(mockDispatch, requestUrl, requestOptions)
        .catch(() => {});

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.requestFinished());
      });
    });

    it("dispatches the request started when calling the backend", () => {
      fetch.mockResponseOnce("{}");

      actions.makeRequest(mockDispatch, requestUrl, requestOptions);

      expect(mockDispatch).toHaveBeenCalledWith(actions.requestStarted());
    });

    it("should call the callback with the response", done => {
      const expectedResponse = "{}";
      fetch.mockResponseOnce(expectedResponse);

      const callback = jest.fn();

      actions.makeRequest(mockDispatch, requestUrl, requestOptions, callback);

      assertLater(done, () => {
        expect(callback).toHaveBeenCalledTimes(1);

        const givenRequest = callback.mock.calls[0][0];
        expect(givenRequest.status).toEqual(200);
        givenRequest.json().then(result => {
          expect(result).toEqual(JSON.parse(expectedResponse));
          done();
        });
      });
    });

    it("dispatches the request finished when request is done", done => {
      fetch.mockResponseOnce("{}");

      actions.makeRequest(mockDispatch, requestUrl, requestOptions);

      assertLater(done, () => {
        expect(mockDispatch).toHaveBeenCalledWith(actions.requestFinished());
      });
    });
  });
});
