const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = db => {
  const collection = "users";
  const router = new express.Router();

  router.post("/", (req, res) => {
    passport.authenticate("local", (err, user) => {
      req.login(user, () => {
        if (err) {
          return res.sendStatus(500);
        }
        if (!user) {
          return res.sendStatus(401);
        }
        return res.json(user);
      });
    })(req, res);
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      db.collection(collection).findOne(
        { username: username },
        (err, dbResult) => {
          if (dbResult && bcrypt.compareSync(password, dbResult.password)) {
            const { username, name, role } = dbResult;
            return done(null, { username, name, role });
          }
          return done(null, false, { message: "Incorrect credentials." });
        }
      );
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  return router;
};
