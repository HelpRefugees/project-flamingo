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
            projection: { _id: 0, grant: 1, name: 1, username: 1 }
          }
        )
        .toArray();

      res.json(grants);
    }
  );

  return router;
};
