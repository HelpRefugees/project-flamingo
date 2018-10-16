const express = require("express");
const bcrypt = require("bcrypt");

const routerFactory = connection => {
  const router = new express.Router();

  router.get("/reports", async (req, res) => {
    const db = await connection.db();

    db.collection("reports")
      .find()
      .toArray(async (err, reports) => {
        return res.json(reports.map(({ _id, ...report }) => ({ ...report })));
      });
  });

  router.post("/login", async (req, res) => {
    const db = await connection.db();
    db.collection("users").findOne(
      { username: req.body.username },
      (err, dbResult) => {
        if (
          dbResult
          && bcrypt.compareSync(req.body.password, dbResult.password)
        ) {
          const { username, name, role } = dbResult;
          return res.json({ username, name, role });
        }
        return res.sendStatus(401);
      }
    );
  });

  router.put("/reports/:id", async (req, res) => {
    const db = await connection.db();
    const report = req.body;
    if (report.completed) {
      report.submissionDate = new Date();
    }
    db.collection("reports").replaceOne(
      { id: parseInt(req.params.id, 10) },
      report,
      async () => {
        return res.sendStatus(200);
      }
    );
  });
  return router;
};

module.exports = routerFactory;
