const request = require("supertest");

const { hashPassword, safeDrop } = require("./helpers");

describe("users endpoint", () => {
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
      const domain = "https://hooks.zapier.com";
      const hook = "/hooks/catch/3099735/cjq3kk/";
      process.env.EMAIL_WEBHOOK = `${domain}${hook}`;
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

    it("adds new user when POST", async () => {
      const newUser = {
        username: "test@t.com",
        name: "test",
        role: "implementing-partner"
      };
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
        },
        {
          username: newUser.username,
          name: newUser.name,
          role: newUser.role,
          id: 2
        }
      ];
      const response = await agent.post("/api/users").send(newUser);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedUsers);
    });
  });
});
