const request = require("supertest");
const MockDate = require("mockdate");
const bcrypt = require("bcrypt");

describe("reports endpoint", () => {
  let app;

  const credentials = {
    username: "user@flamingo.life",
    password: "securityiscool"
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
    await global.DATABASE.collection("reports").insertOne({
      id: 1,
      completed: false,
      overview: "",
      grant: "Grant Mitchell"
    });
    await safeDrop("users");
    await global.DATABASE.collection("users").insertOne({
      username: credentials.username,
      password: bcrypt.hashSync(credentials.password, bcrypt.genSaltSync()),
      role: "implementing-partner"
    });
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

  describe("when logged in as Ellen", () => {
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
        { id: 1, completed: false, overview: "", grant: "Grant Mitchell" }
      ]);
    });

    test("PUT updates the report on save", async () => {
      const updatedReport = {
        id: 1,
        completed: false,
        overview: "Our new overview",
        grant: "Grant Mitchell"
      };

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
        grant: "Grant Mitchell"
      };
      const submissionDate = "2018-10-16T10:47:02.404Z";
      MockDate.set(new Date(submissionDate));

      const response = await agent
        .put("/api/reports/1")
        .send(submittedReport)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);

      const allReports = await agent.get("/api/reports");
      expect(allReports.body).toEqual([{ ...submittedReport, submissionDate }]);
    });
  });
});
