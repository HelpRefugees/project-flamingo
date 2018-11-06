const request = require("supertest");
const MockDate = require("mockdate");
const bcrypt = require("bcrypt");

describe("grants endpoint", () => {
  const implementingPartner = {
    username: "user@flamingo.life",
    password: "securityiscool"
  };

  const helpRefugees = {
    username: "daisy@hr.org",
    password: "helpingrefugees"
  };

  const safeDrop = async collection => {
    try {
      await global.DATABASE.collection(collection).drop();
    } catch (err) {
      /* pass */
    }
  };

  const hashPassword = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync());

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

    describe("as help-refugees", () => {
      it("returns all the implementing partners", async () => {
        const agent = await loginAs(app, helpRefugees);
        const response = await agent.get("/api/grants");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
          {
            username: "user@flamingo.life",
            grant: "some grant",
            name: "some name"
          }
        ]);
      });
    });
  });
});
