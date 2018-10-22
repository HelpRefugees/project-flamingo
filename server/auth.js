const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = {
  configureAuth: (app, db) => {
    const collection = "users";

    passport.serializeUser((user, done) => {
      done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
      db.collection(collection).findOne({ username }, (err, user) => {
        done(err, user);
      });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new LocalStrategy((username, password, done) => {
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
    if (!req.user) {
      return res.sendStatus(401);
    }
    next();
  }
};
