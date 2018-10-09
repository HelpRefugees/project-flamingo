const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const router = require("./router");
const appFactory = mongoUrl => {
  const app = express();
  const API_ROOT_PATH = "/api";
  app.use(express.json());

  router.get("/reports", async (req, res) => {
    const connection = await MongoClient.connect(mongoUrl);
    const db = await connection.db();

    db.collection("reports")
      .find()
      .toArray(async (err, reports) => {
        await connection.close();
        return res.json(reports.map(({ _id, ...report }) => ({ ...report })));
      });
  });

  app.use(API_ROOT_PATH, router);

  app.use(express.static(path.join(__dirname, "static")));

  app.get("*", (req, res, next) => {
    if (req.url.startsWith(API_ROOT_PATH)) {
      return next();
    }
    res.sendFile(path.join(__dirname, "static/index.html"));
  });

  return app;
};

module.exports = appFactory;
