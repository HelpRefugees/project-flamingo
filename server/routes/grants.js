const { Router } = require("express");
const { ensureLoggedIn, ensureHasRole } = require("../auth");
const bcrypt = require("bcrypt");

module.exports = db => {
  const collection = "users";
  const router = new Router();

  router.get(
    "/",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      const grants = await db
        .collection(collection)
        .find(
          {
            role: "implementing-partner"
          },
          {
            projection: {
              _id: 0,
              grant: 1,
              name: 1,
              organizationName: 1,
              sector: 1,
              description: 1,
              country: 1,
              region: 1,
              otherInfo: 1,
              username: 1
            }
          }
        )
        .toArray();

      res.json(grants);
    }
  );

  router.post(
    "/",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      const salt = bcrypt.genSaltSync();
      const newGrant = {
        grant: req.body.grantName,
        name: req.body.organizationName,
        sector: req.body.sector,
        description: req.body.grantDescription,
        country: req.body.country,
        region: req.body.region,
        otherInfo: req.body.otherInfo,
        username: req.body.accountEmail,
        password: bcrypt.hashSync(req.body.accountPassword, salt),
        role: "implementing-partner"
      };
      const commandResult = await db.collection(collection).insertOne(newGrant);
      if (commandResult.result.ok === 1) {
        const grants = await db
          .collection(collection)
          .find(
            {
              role: "implementing-partner"
            },
            {
              projection: {
                _id: 0,
                grant: 1,
                name: 1,
                sector: 1,
                description: 1,
                country: 1,
                region: 1,
                otherInfo: 1,
                username: 1
              }
            }
          )
          .toArray();
        res.json(grants);
      } else {
        res.sendStatus(404);
      }
    }
  );

  return router;
};
