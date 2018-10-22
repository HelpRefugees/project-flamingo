const express = require("express");
const passport = require("passport");

module.exports = () => {
  const router = new express.Router();

  router.post("/", passport.authenticate("local"), (req, res) => {
    return res.json(req.user);
  });

  return router;
};
