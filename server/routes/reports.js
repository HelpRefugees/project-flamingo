const express = require("express");

const { ensureLoggedIn } = require("../auth");
const reportsService = require("../services/reports_service");

module.exports = db => {
  const collection = "reports";
  const router = new express.Router();

  router.get("/", ensureLoggedIn, (req, res) => {
    let query = {};

    if (req.user.role === "implementing-partner") {
      query.owner = req.user.username;
      db.collection(collection)
        .find(query)
        .toArray(async (err, reports) => {
          return res.json(reports.map(({ _id, ...report }) => ({ ...report })));
        });
    } else {
      query = {
        $or: [
          { completed: true },
          { dueDate: { $lt: new Date().toISOString() } }
        ]
      };
      db.collection(collection)
        .find(query)
        .toArray(async (err, reports) => {
          return res.json(
            reports.map(({ _id, ...report }) => {
              if (report.completed) {
                return { ...report };
              }
              return {
                id: report.id,
                grant: report.grant,
                dueDate: report.dueDate,
                completed: report.completed,
                reportPeriod: report.reportPeriod,
                owner: report.owner
              };
            })
          );
        });
    }
  });

  router.get("/:id", ensureLoggedIn, (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.collection(collection).findOne({ id }).then(
      report => {
        if (!report) {
          return res.sendStatus(404);
        }
        return res.json(filterObjectProps(report, AllowedKeys.detailed));
      }
    )
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
          const { _id, ...updatedReport } = report;
          return res.send(updatedReport);
        });
      });
  });

  return router;
};


const AllowedKeys = {
  detailed: ["id", "overview", "keyActivities", "operatingEnvironment", "beneficiaryFeedback", "challengesFaced", "incidents", "otherIssues", "materialsForFundraising", "grant", "completed", "reportPeriod", "dueDate", "submissionDate"]
};

const filterObjectProps = (rawObject, allowedKeys) => (Object.keys(rawObject)
  .filter(key => allowedKeys.includes(key))
  .reduce((obj, key) => {
    obj[key] = rawObject[key];
    return obj;
  }, {}));