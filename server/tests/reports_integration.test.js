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

    test("PUT returns unauthorized", async () => {
      await request(app)
        .put("/api/reports/123")
        .expect(401);
    });
  });

  describe(`when logged in as ${credentials.username}`, () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
    });

    test("GET returns the list of current reports", async () => {
      await agent
        .post("/api/login")
        .send(credentials)
        .expect(200);
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
        }
      ]);
    });

    test("PUT updates the report on save", async () => {
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

      await agent
        .post("/api/login")
        .send(credentials)
        .expect(200);

      const response = await agent
        .put("/api/reports/1")
        .send(updatedReport)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);

      const allReports = await agent.get("/api/reports");
      expect(allReports.body).toEqual([updatedReport]);
    });

    test("PUT updates the report on submit", async () => {
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

      await agent
        .post("/api/login")
        .send(credentials)
        .expect(200);

      const response = await agent
        .put("/api/reports/1")
        .send(submittedReport)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);

      const allReports = await agent.get("/api/reports");
      expect(allReports.body).toEqual([{ ...submittedReport, submissionDate }]);
    });
  });

  describe(`when logged in as ${otherIp.username}`, () => {
    test("GET returns an empty list", async () => {
      const agent = request.agent(app);
      await agent
        .post("/api/login")
        .send(otherIp)
        .expect(200);
      await agent.get("/api/reports").expect(200, []);
    });
  });
});
