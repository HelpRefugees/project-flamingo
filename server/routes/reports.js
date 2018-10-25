const express = require("express");

const { ensureLoggedIn } = require("../auth");

const protectedFields = [
  "/grant",
  "/id",
  "/owner",
  "/reportPeriod",
  "/submissionDate"
];

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
          updateReport(res, report, changes);
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

const replace = (object, path, value) => {
  if ((path.match(/\//g) || []).length !== 1) {
    throw new Error("cannot handle nested paths");
  }
  object[path.slice(1)] = value;
};

const updateReport = (res, report, changes) => {
  for (const { op, path, value } of changes) {
    if (protectedFields.indexOf(path) !== -1) {
      throw new Error(`cannot edit ${path}`);
    }

    switch (op) {
      case "replace":
        if (path === "/completed") {
          if (value && !report.completed) {
            report.submissionDate = new Date().toISOString();
          } else if (!value && report.completed) {
            delete report.submissionDate;
          }
        }
        replace(report, path, value);
        break;
      default:
        throw new Error(`cannot handle ${op} operation`);
    }
  }
};
