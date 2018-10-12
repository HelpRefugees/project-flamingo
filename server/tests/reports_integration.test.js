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

  test("returns the list of current reports", async () => {
    const response = await request(app).get("/api/reports");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, completed: false, overview: "", grant: "Grant Mitchell" }
    ]);
  });
});
