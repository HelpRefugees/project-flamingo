const { Router } = require("express");
const emailSender = require("../../scripts/email-sender");

const { ensureLoggedIn, ensureHasRole } = require("../auth");

module.exports = db => {
  const collection = "grants";
  const router = new Router();

  router.get(
    "/",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      const grants = await db
        .collection(collection)
        .find(
          {},
          {
            projection: {
              _id: 0,
              id: 1,
              grant: 1,
              organization: 1,
              sector: 1,
              description: 1,
              country: 1,
              region: 1,
              otherInfo: 1,
              owner: 1,
              archived: 1
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
        .find({})
        .toArray();

      if (allGrants.find(grant => grant.grant === req.body.grantName)) {
        res.sendStatus(422);
      } else {
        const newGrant = {
          grant: req.body.grantName,
          organization: req.body.organizationName,
          sector: req.body.sector,
          description: req.body.grantDescription,
          country: req.body.country,
          region: req.body.region,
          otherInfo: req.body.otherInfo,
          owner: req.body.accountEmail,
          archived: false,
          id: (lastGrant ? lastGrant.id : 0) + 1
        };

        const grantsCommandResult = await db
          .collection(collection)
          .insertOne(newGrant);
        if (grantsCommandResult.result.ok === 1) {
          const grants = await db
            .collection(collection)
            .find(
              {},
              {
                projection: {
                  _id: 0,
                  id: 1,
                  grant: 1,
                  organization: 1,
                  sector: 1,
                  description: 1,
                  country: 1,
                  region: 1,
                  otherInfo: 1,
                  owner: 1,
                  archived: 1
                }
              }
            )
            .toArray();
          const reportData = {
            grant: newGrant.grant,
            name: newGrant.organization
          };
          emailSender.send("grant-assigned", [newGrant.owner], reportData);
          res.json(grants);
        } else {
          res.sendStatus(422);
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
        if (grant.grant !== changes.grant) {
          const allGrants = await db
            .collection(collection)
            .find({})
            .toArray();
          let allUsers;
          allUsers = db
            .collection("users")
            .find({})
            .toArray();
          if (
            allGrants.find(grant => grant.grant === req.body.grant) ||
            !allUsers.find(user => user.username === req.body.owner)
          ) {
            res.sendStatus(422);
          } else {
            if (changes.owner !== grant.owner) {
              const reportData = {
                grant: changes.grant,
                name: changes.organization
              };
              emailSender.send("grant-assigned", [changes.owner], reportData);
            }
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
