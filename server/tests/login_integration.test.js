const request = require("supertest");
const app = require("../app")(DATABASE_URL);

describe("/api/login", () => {
  const route = "/api/login";

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
