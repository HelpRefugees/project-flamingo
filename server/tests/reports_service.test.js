const reportsHelper = require("../services/reports_service");
const MockDate = require("mockdate");

describe("reports service", () => {
  describe("updateReport", () => {
    const report = {
      id: 1,
      completed: false,
      overview: "",
      grant: "Grant Mitchell",
      owner: "user@flamingo.life",
      keyActivity: {}
    };

    test("updates the report on save", () => {
      var originalReport = {
        id: 1,
        completed: false,
        overview: "",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        keyActivity: {},
        operatingEnvironment: ""
      };

      const updatedReport = {
        id: 1,
        completed: false,
        overview: "Our new overview",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        keyActivity: {
          activityName: "activityName",
          numberOfParticipants: "numberOfParticipants",
          demographicInfo: "demographicInfo",
          impactOutcome: "impactOutcome"
        },
        operatingEnvironment: "changes in the operating environment"
      };

      const changes = [
        { op: "replace", path: "/overview", value: updatedReport.overview },
        {
          op: "replace",
          path: "/keyActivity",
          value: updatedReport.keyActivity
        },
        {
          op: "replace",
          path: "/operatingEnvironment",
          value: updatedReport.operatingEnvironment
        }
      ];

      reportsHelper.updateReport(originalReport, changes);

      expect(originalReport).toEqual(updatedReport);
    });

    test("updates the report on submit", () => {
      let newDate = "2018-10-16T10:47:02.404Z";
      MockDate.set(new Date(newDate));
      var originalReport = {
        id: 1,
        completed: false,
        overview: "",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        keyActivity: {}
      };

      const updatedReport = {
        id: 1,
        completed: true,
        overview: "Our new overview",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        submissionDate: newDate,
        keyActivity: {
          activityName: "activityName",
          numberOfParticipants: "numberOfParticipants",
          demographicInfo: "demographicInfo",
          impactOutcome: "impactOutcome"
        }
      };

      const changes = [
        { op: "replace", path: "/overview", value: updatedReport.overview },
        {
          op: "replace",
          path: "/keyActivity",
          value: updatedReport.keyActivity
        },
        { op: "replace", path: "/completed", value: true }
      ];

      reportsHelper.updateReport(originalReport, changes);

      expect(originalReport).toEqual(updatedReport);
    });

    test("does not update submission date after initial submit", () => {
      let newDate = "2018-10-16T10:47:02.404Z";
      MockDate.set(new Date(newDate));

      var originalReport = {
        id: 3,
        completed: true,
        overview: "this report is completed",
        grant: "Grant Mitchell",
        owner: "a@a.com",
        keyActivity: {},
        submissionDate: "2018-10-10T10:10:10.101ZZ"
      };

      const changes = [{ op: "replace", path: "/completed", value: true }];

      reportsHelper.updateReport(originalReport, changes);

      expect(originalReport.submissionDate).toEqual(
        "2018-10-10T10:10:10.101ZZ"
      );
    });

    test("clears submission date on unsubmit", () => {
      let originalReport = {
        completed: true,
        submissionDate: "2018-10-10T10:10:10.101ZZ"
      };

      let changes = [{ op: "replace", path: "/completed", value: false }];

      reportsHelper.updateReport(originalReport, changes);

      expect(originalReport.submissionDate).toBeUndefined();
    });

    test("rejects unknown operations", () => {
      let changes = [
        { op: "invalid-operation", path: "/overview", value: "new overview" }
      ];

      expect(() => {
        reportsHelper.updateReport(report, changes);
      }).toThrow(new Error("cannot handle invalid-operation operation"));
    });

    let expectedProtectedFields = [
      "/grant",
      "/id",
      "/owner",
      "/reportPeriod",
      "/submissionDate"
    ];

    for (let index in expectedProtectedFields) {
      test("rejects changes to protected fields", () => {
        let field = expectedProtectedFields[index];
        let changes = [{ op: "replace", path: field, value: "new-value" }];

        expect(() => {
          reportsHelper.updateReport(report, changes);
        }).toThrow(new Error(`cannot edit ${field}`));
      });
    }
  });
});
