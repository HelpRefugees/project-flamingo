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
      const users = await db
        .collection(collection)
        .find(
          {},
          {
            projection: {
              _id: 0,
              id: 1,
              name: 1,
              username: 1,
              role: 1
            }
          }
        )
        .toArray();
      res.json(users);
    }
  );
  return router;
};
