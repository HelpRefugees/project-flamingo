const express = require("express");
const passport = require("passport");

module.exports = () => {
  const router = new express.Router();

  router.post("/", passport.authenticate("local"), (req, res) => {
    return res.json(req.user);
  });

  router.delete("/", (req, res) => {
    req.logout();
    res.sendStatus(204);
  });

  return router;
};
