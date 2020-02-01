const MockDate = require("mockdate");

const reportsHelper = require("../services/reports_service");

describe("reports service", () => {
  describe("updateReport", () => {
    const report = {
      id: 1,
      completed: false,
      overview: "",
      grant: "Grant Mitchell",
      owner: "user@flamingo.life",
      keyActivities: [{}]
    };

    test("updates the report on save", () => {
      var originalReport = {
        id: 1,
        completed: false,
        overview: "",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        keyActivities: [{}],
        operatingEnvironment: ""
      };

      const updatedReport = {
        id: 1,
        completed: false,
        overview: "Our new overview",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        keyActivities: [
          {
            activityName: "activityName",
            numberOfParticipants: "123",
            demographicInfo: "demographicInfo",
            impactOutcome: "impactOutcome"
          }
        ],
        operatingEnvironment: "changes in the operating environment"
      };

      const changes = [
        { op: "replace", path: "/overview", value: updatedReport.overview },
        {
          op: "replace",
          path: "/keyActivities",
          value: updatedReport.keyActivities
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
        keyActivities: [{}]
      };

      const updatedReport = {
        id: 1,
        completed: true,
        overview: "Our new overview",
        grant: "Grant Mitchell",
        owner: "user@flamingo.life",
        submissionDate: newDate,
        keyActivities: [
          {
            activityName: "activityName",
            numberOfParticipants: "123",
            demographicInfo: "demographicInfo",
            impactOutcome: "impactOutcome"
          }
        ]
      };

      const changes = [
        { op: "replace", path: "/overview", value: updatedReport.overview },
        {
          op: "replace",
          path: "/keyActivities",
          value: updatedReport.keyActivities
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
        keyActivities: [{}],
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

    [
      "/grant",
      "/id",
      "/owner",
      "/reportPeriod",
      "/submissionDate",
      "/dueDate"
    ].forEach(field => {
      test(`rejects changes to protected field ${field}`, () => {
        let changes = [{ op: "replace", path: field, value: "new-value" }];

        expect(() => {
          reportsHelper.updateReport(report, changes);
        }).toThrow(new Error(`cannot edit ${field}`));
      });
    });

    [
      "/overview",
      "/keyActivities",
      "/operatingEnvironment",
      "/beneficiaryFeedback",
      "/challengesFaced",
      "/incidents",
      "/otherIssues",
      "/materialsForFundraising"
    ].forEach(field => {
      test(`accepts changes to editable field ${field}`, () => {
        let changes = [{ op: "replace", path: field, value: "new-value" }];
        const editedReport = { ...report };

        reportsHelper.updateReport(editedReport, changes);
        expect(editedReport[field.slice(1)]).toEqual("new-value");
      });
    });
  });
});
