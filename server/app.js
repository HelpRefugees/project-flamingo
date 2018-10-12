const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const morgan = require("morgan");
const bcrypt = require("bcrypt");

const router = require("./router");
const appFactory = mongoUrl => {
  const app = express();
  const API_ROOT_PATH = "/api";
  app.use(express.json());
  app.use(morgan("dev"));

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

  router.post("/login", async (req, res) => {
    const connection = await MongoClient.connect(mongoUrl);
    const db = await connection.db();
    db.collection("users").findOne(
      { username: req.body.username },
      async (err, dbResult) => {
        await connection.close();
        if (bcrypt.compareSync(req.body.password, dbResult.password)) {
          return res.sendStatus(200);
        }
        return res.sendStatus(401);
      }
    );
  });

  router.put("/reports/:id", async (req, res) => {
    const connection = await MongoClient.connect(mongoUrl);
    const db = await connection.db();

    db.collection("reports").replaceOne(
      { id: parseInt(req.params.id, 10) },
      req.body,
      async () => {
        await connection.close();
        return res.sendStatus(200);
      }
    );
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
