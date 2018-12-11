const request = require("supertest");
const bcrypt = require("bcrypt");

describe("users endpoint", () => {
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

    await safeDrop("users");
    await safeDrop("grants");
    await global.DATABASE.collection("users").insertMany([
      {
        username: implementingPartner.username,
        password: hashPassword(implementingPartner.password),
        role: "implementing-partner",
        name: "some name",
        id: 0
      },
      {
        username: helpRefugees.username,
        password: hashPassword(helpRefugees.password),
        role: "help-refugees",
        name: "Daisy",
        id: 1
      }
    ]);
  });
  describe("/api/users", () => {
    let agent;

    const loginAs = async (app, user) => {
      agent = request.agent(app);
      const resp = await agent.post("/api/login").send(user);
      expect(resp.statusCode).toEqual(200);
      return agent;
    };

    beforeEach(async () => {
      agent = await loginAs(app, helpRefugees);
    });

    it("returns all users when method GET", async () => {
      const expectedUsers = [
        {
          username: implementingPartner.username,
          role: "implementing-partner",
          name: "some name",
          id: 0
        },
        {
          username: helpRefugees.username,
          role: "help-refugees",
          name: "Daisy",
          id: 1
        }
      ];
      const response = await agent.get("/api/users");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedUsers);
    });
  });
});
