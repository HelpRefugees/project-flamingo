const express = require("express");

module.exports = connection => {
  const collection = "reports";
  const router = new express.Router();

  router.get("/", async (req, res) => {
    const db = await connection.db();

    db.collection(collection)
      .find()
      .toArray(async (err, reports) => {
        return res.json(reports.map(({ _id, ...report }) => ({ ...report })));
      });
  });

  router.put("/:id", async (req, res) => {
    const db = await connection.db();
    const report = req.body;
    if (report.completed) {
      report.submissionDate = new Date();
    }
    db.collection(collection).replaceOne(
      { id: parseInt(req.params.id, 10) },
      report,
      async () => {
        return res.sendStatus(200);
      }
    );
  });

  return router;
};
