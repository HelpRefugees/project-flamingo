const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app")(DATABASE_URL);

describe("/api/login", () => {
  const route = "/api/login";
  let db;

  const safeDrop = async collection => {
    const collections = await db.collections();
    if (collections.map(c => c.s.name).indexOf(collection) > -1) {
      await db.collection(collection).drop();
    }
  };

  beforeEach(async () => {
    db = global.__MONGO_DB__;
    await safeDrop("users");
    let salt = bcrypt.genSaltSync();
    await db.collection("users").insert({
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
});
