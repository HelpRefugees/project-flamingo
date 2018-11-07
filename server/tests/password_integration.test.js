const bcrypt = require("bcrypt");
const nock = require("nock");
const request = require("supertest");

describe("/api/password", async () => {
  let app;
  let db;

  const collection = "users";

  beforeEach(async () => {
    db = global.DATABASE;
    app = require("../app")(db, session => new session.MemoryStore());
    await safeDrop(collection);
  });

  describe("POST /forgot", () => {
    let scope;

    const route = "/api/password/forgot";
    const domain = "http://example.org";
    const hook = "/some/hook/";
    const user = { username: "foo@bar.com" };

    beforeEach(async () => {
      process.env.EMAIL_WEBHOOK = `${domain}${hook}`;
      scope = nock(domain)
        .post(hook, {
          task: "reset-password",
          recipients: [user.username],
          resetToken: /[0-9a-f]{32}/
        })
        .reply(200);
      await db.collection(collection).insertOne({ ...user });
    });

    describe("if the user exists", () => {
      it("returns 200 OK", () => {
        return request(app)
          .post(route)
          .send(user)
          .expect(200);
      });

      it("generates a reset token", async () => {
        await request(app)
          .post(route)
          .send(user)
          .expect(200);

        const updatedUser = await db.collection("users").findOne(user);
        expect(updatedUser.resetToken).toMatch(/[0-9a-f]{32}/);
      });

      it("emails the token to the user", async () => {
        await request(app)
          .post(route)
          .send(user)
          .expect(200);

        scope.done();
      });
    });

    describe("if the user does not exist", () => {
      const whoami = { username: "who@where.why" };

      it("returns 200 OK", () => {
        return request(app)
          .post(route)
          .send(whoami)
          .expect(200);
      });

      it("does not generate a reset token", async () => {
        await request(app)
          .post(route)
          .send(whoami)
          .expect(200);

        return expect(
          db.collection("users").findOne(whoami)
        ).resolves.toBeNull();
      });
    });
  });

  describe("POST /reset", () => {
    const user = {
      username: "foo@bar.com",
      resetToken: "helloiamatoken",
      password: "hashedoldpassword"
    };

    const route = "/api/password/reset";

    beforeEach(async () => {
      await db.collection(collection).insertOne({ ...user });
    });

    describe("if user exists", () => {
      it("resets the user's password", async () => {
        await request(app)
          .post(route)
          .send({ resetToken: user.resetToken, password: "newpassword" })
          .expect(200);

        const updatedUser = await db
          .collection("users")
          .findOne({ username: user.username });

        return bcrypt
          .compare("newpassword", updatedUser.password)
          .then(result => {
            expect(result).toBe(true);
          });
      });

      it("erases the reset token", async () => {
        await request(app)
          .post(route)
          .send({ resetToken: user.resetToken, password: "newpassword" })
          .expect(200);

        const updatedUser = await db
          .collection("users")
          .findOne({ username: user.username });

        expect(updatedUser.resetToken).toBeUndefined();
      });

      it("rejects an empty password", () => {
        return request(app)
          .post(route)
          .send({ resetToken: user.resetToken, password: "" })
          .expect(422);
      });
    });

    describe("if the user does not exist", () => {
      it("returns 404", () => {
        return request(app)
          .post(route)
          .send({ resetToken: "nottherighttoken", password: "whocares" })
          .expect(404);
      });
    });
  });

  const safeDrop = async collection => {
    try {
      await db.collection(collection).drop();
    } catch (err) {
      // pass
    }
  };
});
