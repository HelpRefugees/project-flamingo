const bcrypt = require("bcrypt");
const debug = require("debug")("auth");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = {
  configureAuth: (app, db) => {
    const collection = "users";

    passport.serializeUser((user, done) => {
      const { username, name, role } = user;
      debug("serialising", user.username);
      done(null, JSON.stringify({ username, name, role }));
    });

    passport.deserializeUser((payload, done) => {
      const user = JSON.parse(payload);
      debug("deserialising", user.username);
      done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new LocalStrategy((username, password, done) => {
        debug("logging in", username);
        db.collection(collection).findOne({ username }, (err, user) => {
          if (user && bcrypt.compareSync(password, user.password)) {
            const { username, name, role } = user;
            return done(null, { username, name, role });
          }
          return done(null, false, { message: "Incorrect credentials." });
        });
      })
    );
  },
  ensureLoggedIn: (req, res, next) => {
    debug("ensuring", req.user ? req.user.username : "<unknown>");
    if (!req.user) {
      return res.sendStatus(401);
    }
    next();
  }
};
