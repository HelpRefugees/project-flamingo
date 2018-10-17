const express = require("express");
const bcrypt = require("bcrypt");

module.exports = db => {
  const collection = "users";
  const router = new express.Router();

  router.post("/", (req, res) => {
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
