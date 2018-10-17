const express = require("express");

module.exports = db => {
  const collection = "reports";
  const router = new express.Router();

  router.get("/", (req, res) => {
    db.collection(collection)
      .find()
      .toArray(async (err, reports) => {
        return res.json(reports.map(({ _id, ...report }) => ({ ...report })));
      });
  });

  router.put("/:id", (req, res) => {
    const report = req.body;
    if (report.completed) {
      // TODO what if this is being updated post-completion?
      report.submissionDate = new Date().toISOString();
    }
    db.collection(collection).replaceOne(
      { id: parseInt(req.params.id, 10) },
      report,
      () => {
        return res.sendStatus(200);
      }
    );
  });

  return router;
};
