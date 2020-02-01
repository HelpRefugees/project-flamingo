const MockDate = require("mockdate");
const request = require("supertest");

const { hashPassword, safeDrop } = require("./helpers");

describe("reports endpoint", () => {
  let app;

  const implementingPartner = {
    username: "user@flamingo.life",
    password: "securityiscool"
  };

  const otherImplementingPartner = {
    username: "someone@else.org",
    password: "irrelevant"
  };

  const helpRefugees = {
    username: "daisy@hr.org",
    password: "helpingrefugees"
  };

  beforeEach(() => {
    app = require("../app")(
      global.DATABASE,
      session => new session.MemoryStore()
    );
  });

  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(async () => {
    await safeDrop("reports");
    await global.DATABASE.collection("reports").insertMany([
      {
        id: 1,
        completed: false,
        overview: "",
        grant: "Grant Mitchell",
        owner: implementingPartner.username,
        keyActivities: [{}]
      },
      {
        id: 2,
        completed: false,
        overview: "",
        grant: "Hugh Grant",
        owner: "a third person",
        keyActivities: [{}]
      },
      {
        id: 3,
        completed: true,
        overview: "this report is completed",
        grant: "Grant Mitchell",
        owner: implementingPartner.username,
        keyActivities: [{}],
        submissionDate: "2018-10-10T10:10:10.101ZZ"
      },
      {
        id: 4,
        completed: false,
        overview: "this report is completed",
        grant: "Grant Mitchell",
        owner: implementingPartner.username,
        keyActivities: [{}],
        dueDate: "2018-10-20T03:24:00.000Z",
        reportPeriod: "2018-10-01T00:00:00.000Z"
      }
    ]);

    await safeDrop("users");
    await global.DATABASE.collection("users").insertMany([
      {
        username: implementingPartner.username,
        password: hashPassword(implementingPartner.password),
        role: "implementing-partner"
      },
      {
        username: helpRefugees.username,
        password: hashPassword(helpRefugees.password),
        role: "help-refugees"
      },
      {
        username: otherImplementingPartner.username,
        password: hashPassword(otherImplementingPartner.password),
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

  describe(`when logged in as ${implementingPartner.username}`, () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post("/api/login")
        .send(implementingPartner)
        .expect(200);
    });

    test("GET returns the list of current reports", async () => {
      const response = await agent.get("/api/reports");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          completed: false,
          grant: "Grant Mitchell",
          owner: implementingPartner.username
        },
        {
          id: 3,
          completed: true,
          grant: "Grant Mitchell",
          owner: implementingPartner.username,
          submissionDate: "2018-10-10T10:10:10.101ZZ"
        },
        {
          id: 4,
          completed: false,
          grant: "Grant Mitchell",
          owner: implementingPartner.username,
          dueDate: "2018-10-20T03:24:00.000Z",
          reportPeriod: "2018-10-01T00:00:00.000Z"
        }
      ]);
    });

    test("GET /:id returns the details of a report", () => {
      return agent.get("/api/reports/1").expect(200, {
        id: 1,
        completed: false,
        overview: "",
        grant: "Grant Mitchell",
        owner: implementingPartner.username,
        keyActivities: [{}]
      });
    });

    test("GET /:id returns 404 for missing report", () => {
      return agent.get("/api/reports/123").expect(404);
    });

    test("PATCH updates the report", async () => {
      const submittedReport = {
        id: 1,
        completed: true,
        overview: "Our final overview",
        grant: "Grant Mitchell",
        owner: implementingPartner.username,
        submissionDate: "2018-10-16T10:47:02.404Z",
        keyActivities: [
          {
            activityName: "activityName",
            numberOfParticipants: "123",
            demographicInfo: "demographicInfo",
            impactOutcome: "impactOutcome"
          }
        ]
      };
      MockDate.set(new Date(submittedReport.submissionDate));

      const response = await agent
        .patch("/api/reports/1")
        .send([
          { op: "replace", path: "/overview", value: submittedReport.overview },
          {
            op: "replace",
            path: "/keyActivities",
            value: submittedReport.keyActivities
          },
          { op: "replace", path: "/completed", value: true }
        ])
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({});

      const updatedReport = await agent.get("/api/reports/1");
      expect(updatedReport.body).toEqual(submittedReport);
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

  describe(`when logged in as ${otherImplementingPartner.username}`, () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post("/api/login")
        .send(otherImplementingPartner)
        .expect(200);
    });

    test("you cannot see other users' reports", async () => {
      await agent.get("/api/reports").expect(200, []);
      await agent.get("/api/reports/1").expect(403);
    });

    test("you cannot edit other users' reports", async () => {
      await agent
        .patch("/api/reports/1")
        .send({})
        .expect(403);
    });
  });

  describe(`when logged in as ${helpRefugees.username}`, () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post("/api/login")
        .send(helpRefugees)
        .expect(200);
    });

    test("you can see details of submitted reports", () => {
      return agent.get("/api/reports/3").expect(200, {
        id: 3,
        completed: true,
        overview: "this report is completed",
        grant: "Grant Mitchell",
        owner: implementingPartner.username,
        keyActivities: [{}],
        submissionDate: "2018-10-10T10:10:10.101ZZ"
      });
    });

    test("you cannot see details of unsubmitted reports", () => {
      return agent.get("/api/reports/1").expect(403);
    });
  });
});
