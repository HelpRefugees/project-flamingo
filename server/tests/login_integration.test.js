const request = require("supertest");
const bcrypt = require("bcrypt");

describe("/api/login", async () => {
  let app;
  const route = "/api/login";

  beforeAll(() => {
    app = require("../app")(global.CONNECTION);
  });

  const safeDrop = async collection => {
    const collections = await global.DATABASE.collections();
    if (collections.map(c => c.s.name).indexOf(collection) > -1) {
      await global.DATABASE.collection(collection).drop();
    }
  };

  beforeEach(async () => {
    await safeDrop("users");
    let salt = bcrypt.genSaltSync();
    await global.DATABASE.collection("users").insertOne({
      username: "ellen@ip.org",
      password: bcrypt.hashSync("flamingo", salt)
    });
  });

  test("returns 200 OK when valid credentials are provided", async () => {
    const credentials = { username: "ellen@ip.org", password: "flamingo" };

    const response = await request(app)
      .post(route)
      .send(credentials)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
  });

  test("returns 401 Unauthorised when invalid credentials are provided", async () => {
    const credentials = { username: "ellen@ip.org", password: "wrongpassword" };

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
});
