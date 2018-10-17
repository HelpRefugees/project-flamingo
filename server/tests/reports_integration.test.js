const request = require("supertest");
const MockDate = require("mockdate");

describe("reports endpoint", () => {
  let app;

  beforeAll(() => {
    app = require("../app")(global.DATABASE);
  });

  afterEach(() => {
    MockDate.reset();
  });

  const safeDrop = async collection => {
    const collections = await global.DATABASE.collections();
    if (collections.map(c => c.s.name).indexOf(collection) > -1) {
      await global.DATABASE.collection(collection).drop();
    }
  };

  beforeEach(async () => {
    await safeDrop("reports");
    await global.DATABASE.collection("reports").insertOne({
      id: 1,
      completed: false,
      overview: "",
      grant: "Grant Mitchell"
    });
  });

  test("GET returns the list of current reports", async () => {
    const response = await request(app).get("/api/reports");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, completed: false, overview: "", grant: "Grant Mitchell" }
    ]);
  });

  test("PUT updates the report on save", async () => {
    const updatedReport = {
      id: 1,
      completed: false,
      overview: "Our new overview",
      grant: "Grant Mitchell"
    };

    const response = await request(app)
      .put("/api/reports/1")
      .send(updatedReport)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);

    const allReports = await request(app).get("/api/reports");
    expect(allReports.body).toEqual([updatedReport]);
  });

  test("PUT updates the report on submit", async () => {
    const submittedReport = {
      id: 1,
      completed: true,
      overview: "Our final overview",
      grant: "Grant Mitchell"
    };
    const submissionDate = "2018-10-16T10:47:02.404Z";
    MockDate.set(new Date(submissionDate));

    const response = await request(app)
      .put("/api/reports/1")
      .send(submittedReport)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);

    const allReports = await request(app).get("/api/reports");
    expect(allReports.body).toEqual([{ ...submittedReport, submissionDate }]);
  });
});
