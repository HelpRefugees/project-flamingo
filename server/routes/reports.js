const express = require("express");

const { ensureLoggedIn, ensureHasRole } = require("../auth");
const reportsService = require("../services/reports_service");

module.exports = db => {
  const collection = "reports";
  const router = new express.Router();

  router.get("/:id", ensureLoggedIn, (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.collection(collection)
      .findOne({ id })
      .then(wholeReport => {
        if (!wholeReport) {
          return res.sendStatus(404);
        }
        const { _id, ...report } = wholeReport;
        if (req.user.role === "implementing-partner") {
          if (report.owner !== req.user.username) {
            return res.sendStatus(403);
          }
        } else {
          if (!report.completed) {
            return res.sendStatus(403);
          }
        }
        return res.json(report);
      });
  });

  router.get("/", ensureLoggedIn, (req, res) => {
    let query = {};

    if (req.user.role === "implementing-partner") {
      query.owner = req.user.username;
    }

    db.collection(collection)
      .find(query, {
        projection: {
          _id: 0,
          grant: 1,
          completed: 1,
          reportPeriod: 1,
          dueDate: 1,
          submissionDate: 1,
          owner: 1,
          id: 1
        }
      })
      .toArray()
      .then(reports => {
        res.json(reports);
      });
  });

  router.patch("/:id", ensureLoggedIn, (req, res) => {
    const changes = req.body;
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

        try {
          reportsService.updateReport(report, changes);
        } catch (err) {
          return res.status(422).send({ message: err });
        }

        db.collection(collection).replaceOne({ id }, report, () => {
          return res.send({});
        });
      });
  });

  router.post(
    "/uploadHandler/:id",
    ensureLoggedIn,
    ensureHasRole("implementing-partner"),
    (req, res) => {
      res.send({ responseText: "req.file.path" }); // You can send any response to the user here
    }
  );
  return router;
};
