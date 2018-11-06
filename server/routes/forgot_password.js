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

  router.post("/", (req, res) => {
    db.collection(collection)
      .findOne(req.body)
      .then(user => {
        if (!user) {
          return;
        }
        const resetToken = generateHex(32);
        return Promise.all([
          db.collection(collection).updateOne(user, { $set: { resetToken } }),
          emailSender.send("reset-password", [user.username], { resetToken })
        ]);
      })
      .then(() => res.sendStatus(200))
      .catch(err => {
        debug(err);
        res.sendStatus(500);
      });
  });

  return router;
};
