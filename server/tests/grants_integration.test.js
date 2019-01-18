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

    await global.DATABASE.collection("grants").insertMany([
      {
        archived: false,
        owner: implementingPartner.username,
        organization: "some organization",
        grant: "some grant",
        region: "Europe",
        country: "Greece",
        otherInfo: "info...",
        description: "some desc...",
        sector: "some sector",
        id: 0,
        startDate: "1-10-2018",
        endDate: "1-10-2028"
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
      const grants = [
        {
          owner: implementingPartner.username,
          grant: "some grant",
          organization: "some organization",
          region: "Europe",
          country: "Greece",
          otherInfo: "info...",
          description: "some desc...",
          sector: "some sector",
          id: 0,
          archived: false,
          startDate: "1-10-2018",
          endDate: "1-10-2028"
        }
      ];
      beforeEach(async () => {
        agent = await loginAs(app, helpRefugees);
        const domain = "https://hooks.zapier.com";
        const hook = "/hooks/catch/3099735/cjq3kk/";
        process.env.EMAIL_WEBHOOK = `${domain}${hook}`;
      });
      it("returns all the grants", async () => {
        const response = await agent.get("/api/grants");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(grants);
      });

      it("add new grant when method POST", async () => {
        const newGrant = {
          grantName: "string",
          organizationName: "string",
          sector: "string",
          grantDescription: "string",
          country: "string",
          region: "string",
          otherInfo: "string",
          accountEmail: implementingPartner.username,
          archived: false,
          startDate: "1-10-2018",
          endDate: "1-10-2028"
        };
        const expectedGrants = [
          ...grants,
          {
            grant: "string",
            organization: "string",
            sector: "string",
            description: "string",
            country: "string",
            region: "string",
            otherInfo: "string",
            owner: implementingPartner.username,
            id: 1,
            archived: false,
            startDate: "1-10-2018",
            endDate: "1-10-2028"
          }
        ];

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

        const response = await agent.post("/api/grants").send(newGrant);

        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual(expectedGrants);

        const usersResponse = await agent.get("/api/users");

        expect(usersResponse.statusCode).toEqual(200);

        expect(usersResponse.body).toEqual(expectedUsers);
      });

      it("reject add new grant if not unique", async () => {
        const newGrant = {
          grantName: "some grant",
          organizationName: "string",
          sector: "string",
          grantDescription: "string",
          country: "string",
          region: "string",
          otherInfo: "string",
          accountEmail: "string",
          accountPassword: "password",
          startDate: "1-10-2018",
          endDate: "1-10-2028"
        };

        const response = await agent.post("/api/grants").send(newGrant);
        expect(response.statusCode).toEqual(422);
      });
    });
  });
});
