const bcrypt = require("bcrypt");
const debug = require("debug")("forgot-password");
const express = require("express");

const emailSender = require("../../scripts/email-sender");

const hexChars = "0123456789abcdef";

const generateHex = length => {
  return Array(length)
    .fill(null)
    .map(() => hexChars[Math.floor(Math.random() * hexChars.length)])
    .join("");
};

module.exports = db => {
  const collection = "users";

  const router = new express.Router();

  router.post("/forgot", (req, res) => {
    db.collection(collection)
      .findOne(req.body)
      .then(user => {
        if (!user) {
          return;
        }
        const resetToken = generateHex(32);
        return Promise.all([
          db.collection(collection).updateOne(user, { $set: { resetToken } }),
          emailSender.send("reset-password", [user.username], {
            resetToken
          })
        ]);
      })
      .then(() => res.sendStatus(200))
      .catch(err => {
        debug(err);
        res.sendStatus(500);
      });
  });

  router.post("/reset", (req, res) => {
    const { resetToken, password } = req.body;
    db.collection(collection)
      .findOne({ resetToken })
      .then(user => {
        return bcrypt
          .genSalt()
          .then(salt => bcrypt.hash(password, salt))
          .then(passwordHash => ({ user, passwordHash }));
      })
      .then(({ user, passwordHash }) => {
        if (!user) {
          return 404;
        }
        return db
          .collection(collection)
          .updateOne(user, {
            $set: { password: passwordHash },
            $unset: { resetToken: true }
          })
          .then(() => 200);
      })
      .then(status => res.sendStatus(status))
      .catch(err => {
        debug(err);
        res.sendStatus(500);
      });
  });

  return router;
};
