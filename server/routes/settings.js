const { Router } = require("express");

const { ensureLoggedIn, ensureHasRole } = require("../auth");

module.exports = db => {
  const collection = "settings";
  const router = new Router();

  router.get("/demo-info", ensureLoggedIn, async (req, res) => {
    const demographicInfo = await db.collection(collection).findOne(
      { name: "demographicInfo" },
      {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          values: 1
        }
      }
    );

    res.json(demographicInfo);
  });

  router.post(
    "/demo-info",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      const demographicInfo = await db
        .collection(collection)
        .findOne({ name: "demographicInfo" });
      demographicInfo.values.push(req.body.name);
      db.collection(collection).replaceOne(
        { name: "demographicInfo" },
        demographicInfo,
        () => {
          return res.send(demographicInfo);
        }
      );
    }
  );

  router.delete(
    "/demo-info/:name",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let demographicInfo = await db
        .collection(collection)
        .findOne({ name: "demographicInfo" });
      demographicInfo.values = demographicInfo.values.filter(
        name => name != req.params.name
      );
      db.collection(collection).replaceOne(
        { name: "demographicInfo" },
        demographicInfo,
        () => {
          res.send(demographicInfo);
        }
      );
    }
  );

  return router;
};
