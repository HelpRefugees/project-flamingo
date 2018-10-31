import type { Dispatch } from "redux";

import type { Report } from "./report/models";
import * as actions from "./actions";
import { assertLater } from "./testHelpers";
import type { Account } from "./authentication/models";

describe("actions", () => {
  let action: (dispatch: Dispatch<any>) => any;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    fetch.resetMocks();
  });

  describe("simple actions", () => {
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

    it("receiveReports should create LOAD_REPORTS_SUCCESS action", () => {
      const reports = [];
      expect(actions.loadReportsSuccessful(reports)).toEqual({
        type: "LOAD_REPORTS_SUCCESS",
        payload: reports
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

  describe("save reports", () => {
    it("saveReportSuccessful should create SAVE_REPORT_SUCCESS action with payload", () => {
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

    it("saveReportFailed should create SAVE_REPORT_FAILURE action", () => {
      expect(actions.updateReportFailed()).toEqual({
        type: "SAVE_REPORT_FAILURE"
      });
    });

    describe("update report", () => {
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
        action = actions.updateReport(report);
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
