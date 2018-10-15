const request = require("supertest");

describe("reports endpoint", () => {
  let app;

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

  test("PUT updates the report", async () => {
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
});
