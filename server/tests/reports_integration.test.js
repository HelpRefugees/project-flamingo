const request = require("supertest");
const app = require("../app")(DATABASE_URL);

describe("reports endpoint", () => {
  let db;

  const safeDrop = async collection => {
    const collections = await db.collections();
    if (collections.map(c => c.s.name).indexOf(collection) > -1) {
      await db.collection(collection).drop();
    }
  };

  beforeEach(async () => {
    db = global.__MONGO_DB__;
    await safeDrop("reports");
    await db.collection("reports").insert({
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
