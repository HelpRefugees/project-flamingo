const express = require("express");

const { ensureLoggedIn } = require("../auth");

module.exports = db => {
  const collection = "reports";
  const router = new express.Router();

  router.get("/", ensureLoggedIn, (req, res) => {
    const query = {};

    if (req.user.role === "implementing-partner") {
      query.owner = req.user.username;
    }

    db.collection(collection)
      .find(query)
      .toArray(async (err, reports) => {
        return res.json(reports.map(({ _id, ...report }) => ({ ...report })));
      });
  });

  router.put("/:id", ensureLoggedIn, (req, res) => {
    const updatedReport = req.body;
    const id = parseInt(req.params.id, 10);

    db.collection(collection)
      .findOne({ id })
      .then(report => {
        if (!report) {
          return res.sendStatus(404);
        }

        if (report.owner !== req.user.username) {
          return res.sendStatus(403);
        }

        if (updatedReport.completed) {
          // TODO what if this is being updated post-completion?
          updatedReport.submissionDate = new Date().toISOString();
        }
        db.collection(collection).replaceOne({ id }, updatedReport, () => {
          return res.sendStatus(200);
        });
      });
  });

  return router;
};
