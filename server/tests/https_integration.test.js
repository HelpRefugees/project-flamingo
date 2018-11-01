/* eslint-disable no-console */

const request = require("supertest");

describe("in production", () => {
  let app;
  let warn;

  beforeEach(() => {
    process.env.NODE_ENV = "production";
    // avoid warning on using MemoryStore in production
    warn = console.warn;
    console.warn = jest.fn();
    app = require("../app")(
      global.DATABASE,
      session => new session.MemoryStore()
    );
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
    console.warn = warn;
  });

  test("should redirect to HTTPS", () => {
    return request(app)
      .get("/")
      .expect(301)
      .expect("location", /^https:\/\//);
  });
});
