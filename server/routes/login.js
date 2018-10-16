const express = require("express");
const bcrypt = require("bcrypt");

module.exports = connection => {
  const collection = "users";
  const router = new express.Router();

  router.post("/", async (req, res) => {
    const db = await connection.db();
    db.collection(collection).findOne(
      { username: req.body.username },
      (err, dbResult) => {
        if (
          dbResult
          && bcrypt.compareSync(req.body.password, dbResult.password)
        ) {
          const { username, name, role } = dbResult;
          return res.json({ username, name, role });
        }
        return res.sendStatus(401);
      }
    );
  });

  return router;
};
