const bcrypt = require("bcrypt");
const { Router } = require("express");

const { ensureLoggedIn, ensureHasRole } = require("../auth");

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
              id: 1,
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
      const lastGrant = await db
        .collection(collection)
        .findOne({}, { sort: { id: -1 } });
      const allGrants = await db
        .collection(collection)
        .find({ role: "implementing-partner" })
        .toArray();

      if (allGrants.find(grant => grant.grant === req.body.grantName)) {
        res.sendStatus(422);
      } else {
        const password = await bcrypt
          .genSalt()
          .then(salt => bcrypt.hash(req.body.accountPassword, salt));
        const newGrant = {
          grant: req.body.grantName,
          name: req.body.organizationName,
          sector: req.body.sector,
          description: req.body.grantDescription,
          country: req.body.country,
          region: req.body.region,
          otherInfo: req.body.otherInfo,
          username: req.body.accountEmail,
          password,
          role: "implementing-partner",
          id: (lastGrant ? lastGrant.id : 0) + 1
        };
        const commandResult = await db
          .collection(collection)
          .insertOne(newGrant);
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
                  id: 1,
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
    }
  );

  router.put(
    "/:id",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let changes = req.body;
      const id = parseInt(req.params.id, 10);
      changes.id = id;
      let grant = await db.collection(collection).findOne({ id });
      if (!grant) {
        return res.sendStatus(404);
      } else {
        const allGrants = await db
          .collection(collection)
          .find({ role: "implementing-partner" })
          .toArray();
        if (grant.grant !== changes.grant) {
          if (allGrants.find(grant => grant.grant === req.body.grant)) {
            res.sendStatus(422);
          } else {
            grant = { ...grant, ...changes };
            db.collection(collection).replaceOne({ id }, grant, () => {
              const { _id, ...updatedGrant } = grant;
              return res.send(updatedGrant);
            });
          }
        } else {
          grant = { ...grant, ...changes };
          db.collection(collection).replaceOne({ id }, grant, () => {
            const { _id, ...updatedGrant } = grant;
            return res.send(updatedGrant);
          });
        }
      }
    }
  );
  return router;
};
