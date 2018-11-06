const nock = require("nock");
const request = require("supertest");

describe("/api/forgot-password", async () => {
  let app;
  let scope;

  const domain = "http://example.org";
  const hook = "/some/hook/";
  const route = "/api/forgot-password";
  const user = {
    username: "foo@bar.com"
  };

  beforeEach(() => {
    process.env.EMAIL_WEBHOOK = `${domain}${hook}`;
    scope = nock(domain)
      .post(hook, {
        task: "reset-password",
        recipients: [user.username],
        resetToken: /[0-9a-f]{32}/
      })
      .reply(200);
    app = require("../app")(
      global.DATABASE,
      session => new session.MemoryStore()
    );
  });

  const safeDrop = async collection => {
    try {
      await global.DATABASE.collection(collection).drop();
    } catch (err) {
      // pass
    }
  };

  beforeEach(async () => {
    await safeDrop("users");
    await global.DATABASE.collection("users").insertOne(user);
  });

  describe("if the user exists", () => {
    it("returns 200 OK", () => {
      return request(app)
        .post(route, user)
        .expect(200);
    });

    it("generates a reset token", async () => {
      await request(app)
        .post(route, user)
        .expect(200);

      const updatedUser = await global.DATABASE.collection("users").findOne(
        user
      );
      expect(updatedUser.resetToken).toMatch(/[0-9a-f]{32}/);
    });

    it("emails the token to the user", async () => {
      await request(app)
        .post(route, user)
        .expect(200);

      scope.done();
    });
  });

  describe("if the user does not exist", () => {
    const whoami = { username: "who@where.why" };

    it("returns 200 OK", () => {
      return request(app)
        .post(route, whoami)
        .expect(200);
    });

    it("does not generate a reset token", async () => {
      await request(app)
        .post(route, whoami)
        .expect(200);

      return expect(
        global.DATABASE.collection("users").findOne(whoami)
      ).resolves.toBeNull();
    });
  });
});
