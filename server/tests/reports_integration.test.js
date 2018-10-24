const request = require("supertest");
const MockDate = require("mockdate");
const bcrypt = require("bcrypt");

describe("reports endpoint", () => {
  let app;

  const credentials = {
    username: "user@flamingo.life",
    password: "securityiscool"
  };

  const otherIp = {
    username: "someone@else.org",
    password: "irrelevant"
  };

  beforeAll(() => {
    app = require("../app")(global.DATABASE);
  });

  afterEach(() => {
    MockDate.reset();
  });

  const safeDrop = async collection => {
    try {
      await global.DATABASE.collection(collection).drop();
    } catch (err) {
      // pass
    }
  };

  const safeCreate = async collection => {
    try {
      await global.DATABASE.createCollection(collection);
    } catch (err) {
      // pass
    }
  };

  beforeEach(async () => {
    await safeDrop("_sessions");
    await safeCreate("_sessions");
    await safeDrop("reports");
    await global.DATABASE.collection("reports").insertMany([
      {
        id: 1,
        completed: false,
        overview: "",
        grant: "Grant Mitchell",
        owner: credentials.username,
        keyActivity: {}
      },
      {
        id: 2,
        completed: false,
        overview: "",
        grant: "Hugh Grant",
        owner: "a third person",
        keyActivity: {}
      },
      {
        id: 3,
        completed: true,
        overview: "this report is completed",
        grant: "Grant Mitchell",
        owner: credentials.username,
        keyActivity: {},
        submissionDate: "2018-10-10T10:10:10.101ZZ"
      }
    ]);

    await safeDrop("users");
    await global.DATABASE.collection("users").insertMany([
      {
        username: credentials.username,
        password: bcrypt.hashSync(credentials.password, bcrypt.genSaltSync()),
        role: "implementing-partner"
      },
      {
        username: otherIp.username,
        password: bcrypt.hashSync(otherIp.password, bcrypt.genSaltSync()),
        role: "implementing-partner"
      }
    ]);
  });

  describe("when not logged in", () => {
    test("GET returns unauthorized", async () => {
      await request(app)
        .get("/api/reports")
        .expect(401);
    });

    test("PATCH returns unauthorized", async () => {
      await request(app)
        .patch("/api/reports/123")
        .expect(401);
    });
  });

  describe(`when logged in as ${credentials.username}`, () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post("/api/login")
        .send(credentials)
        .expect(200);
    });

    test("GET returns the list of current reports", async () => {
      const response = await agent.get("/api/reports");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          completed: false,
          overview: "",
          grant: "Grant Mitchell",
          owner: credentials.username,
          keyActivity: {}
        },
        {
          id: 3,
          completed: true,
          overview: "this report is completed",
          grant: "Grant Mitchell",
          owner: credentials.username,
          keyActivity: {},
          submissionDate: "2018-10-10T10:10:10.101ZZ"
        }
      ]);
    });

    test("PATCH updates the report on save", async () => {
      const updatedReport = {
        id: 1,
        completed: false,
        overview: "Our new overview",
        grant: "Grant Mitchell",
        owner: credentials.username,
        keyActivity: {
          activityName: "activityName",
          numberOfParticipants: "numberOfParticipants",
          demographicInfo: "demographicInfo",
          impactOutcome: "impactOutcome"
        }
      };

      const response = await agent
        .patch("/api/reports/1")
        .send([
          { op: "replace", path: "/overview", value: updatedReport.overview },
          {
            op: "replace",
            path: "/keyActivity",
            value: updatedReport.keyActivity
          }
        ])
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);

      const allReports = await agent.get("/api/reports");
      expect(allReports.body.filter(report => report.id === 1)).toEqual([
        updatedReport
      ]);
    });

    test("PATCH updates the report on submit", async () => {
      const submittedReport = {
        id: 1,
        completed: true,
        overview: "Our final overview",
        grant: "Grant Mitchell",
        owner: credentials.username,
        keyActivity: {
          activityName: "activityName",
          numberOfParticipants: "numberOfParticipants",
          demographicInfo: "demographicInfo",
          impactOutcome: "impactOutcome"
        }
      };
      const submissionDate = "2018-10-16T10:47:02.404Z";
      MockDate.set(new Date(submissionDate));

      const response = await agent
        .patch("/api/reports/1")
        .send([
          { op: "replace", path: "/overview", value: submittedReport.overview },
          {
            op: "replace",
            path: "/keyActivity",
            value: submittedReport.keyActivity
          },
          { op: "replace", path: "/completed", value: true }
        ])
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);

      const allReports = await agent.get("/api/reports");
      expect(allReports.body.filter(report => report.id === 1)).toEqual([
        { ...submittedReport, submissionDate }
      ]);
    });

    test("PATCH does not update submission date after initial submit", async () => {
      const newDate = "2018-10-16T10:47:02.404Z";
      MockDate.set(new Date(newDate));

      await agent
        .patch("/api/reports/3")
        .send([{ op: "replace", path: "/completed", value: true }])
        .set("Accept", "application/json")
        .expect(200);

      const allReports = await agent.get("/api/reports");
      expect(
        allReports.body.filter(report => report.id === 3)[0].submissionDate
      ).not.toEqual(newDate);
    });

    test("PATCH clears submission date on unsubmit", async () => {
      await agent
        .patch("/api/reports/3")
        .send([{ op: "replace", path: "/completed", value: false }])
        .set("Accept", "application/json")
        .expect(200);

      const allReports = await agent.get("/api/reports");
      expect(
        allReports.body.filter(report => report.id === 3)[0].submissionDate
      ).toBeUndefined();
    });

    test("PATCH rejects changes to protected fields", async () => {
      await agent
        .patch("/api/reports/3")
        .send([{ op: "remove", path: "/owner" }])
        .set("Accept", "application/json")
        .expect(422);
    });

    test("PATCH returns not found for nonexistent report", async () => {
      await agent
        .patch("/api/reports/123")
        .send({})
        .expect(404);
    });
  });

  describe(`when logged in as ${otherIp.username}`, () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post("/api/login")
        .send(otherIp)
        .expect(200);
    });

    test("you cannot see other users' reports", async () => {
      await agent.get("/api/reports").expect(200, []);
    });

    test("you cannot edit other users' reports", async () => {
      await agent
        .patch("/api/reports/1")
        .send({})
        .expect(403);
    });
  });
});
