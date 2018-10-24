const request = require("supertest");
const bcrypt = require("bcrypt");

describe("/api/login", async () => {
  let app;
  const route = "/api/login";
  const password = "flamingo";
  const user = {
    username: "ellen@ip.org",
    name: "Ellen Smith",
    role: "implementing-partner",
    password: bcrypt.hashSync(password, bcrypt.genSaltSync())
  };

  beforeAll(() => {
    app = require("../app")(global.DATABASE);
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
    await safeDrop("users");
    await global.DATABASE.collection("users").insertOne(user);
  });

  test("returns 200 OK when valid credentials are provided", async () => {
    const credentials = { username: user.username, password };

    const response = await request(app)
      .post(route)
      .send(credentials)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      username: "ellen@ip.org",
      name: "Ellen Smith",
      role: "implementing-partner"
    });
  });

  test("returns 401 Unauthorised when invalid credentials are provided", async () => {
    const credentials = { username: user.username, password: "wrongpassword" };

    const response = await request(app)
      .post(route)
      .send(credentials)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(401);
  });

  test("returns 401 Unauthorised when unknown username is provided", async () => {
    const credentials = { username: "bob@ip.org", password: "whocares" };

    const response = await request(app)
      .post(route)
      .send(credentials)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(401);
  });

  describe("when logged in", () => {
    test("ends users session on DELETE request", async () => {
      const credentials = { username: user.username, password };
      const agent = request.agent(app);
      await agent
        .post(route)
        .send(credentials)
        .expect(200);
      await agent.get("/api/reports").expect(200);

      await agent.delete(route).expect(204);

      await agent.get("/api/reports").expect(401);
    });
  });
});
