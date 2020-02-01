const MockDate = require("mockdate");
const request = require("supertest");

const { hashPassword, safeDrop } = require("./helpers");

describe("grants endpoint", () => {
  const implementingPartner = {
    username: "user@flamingo.life",
    password: "securityiscool"
  };

  const helpRefugees = {
    username: "daisy@hr.org",
    password: "helpingrefugees"
  };

  let app;

  beforeEach(async () => {
    const appFactory = require("../app");
    app = appFactory(global.DATABASE, session => new session.MemoryStore());

    safeDrop("users");

    await global.DATABASE.collection("users").insertMany([
      {
        username: implementingPartner.username,
        password: hashPassword(implementingPartner.password),
        role: "implementing-partner",
        name: "some name",
        grant: "some grant"
      },
      {
        username: helpRefugees.username,
        password: hashPassword(helpRefugees.password),
        role: "help-refugees"
      }
    ]);
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe("/api/grants", () => {
    let agent;

    const loginAs = async (app, user) => {
      agent = request.agent(app);
      const resp = await agent.post("/api/login").send(user);
      expect(resp.statusCode).toEqual(200);
      return agent;
    };

    afterEach(async () => {
      const resp = await agent.delete("/api/login");
      expect(resp.statusCode).toEqual(204);
    });

    describe("as implementing-partner", () => {
      it("returns 403", async () => {
        const agent = await loginAs(app, implementingPartner);
        const response = await agent.get("/api/grants");

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
      });
    });

    describe("user is not logged in", () => {
      it("returns 401", async () => {
        const agent = await request(app);
        const response = await agent.get("/api/grants");

        expect(response.statusCode).toBe(401);
      });
    });
  });
});
