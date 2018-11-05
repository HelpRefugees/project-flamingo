/* eslint-disable no-console */

const request = require("supertest");

describe("info", () => {
  let app;

  beforeEach(() => {
    app = require("../app")(
      global.DATABASE,
      session => new session.MemoryStore()
    );
  });

  test("should redirect to HTTPS", async () => {
    const resp = await request(app).get("/api/info");

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ environment: 'test' });
  });
});
