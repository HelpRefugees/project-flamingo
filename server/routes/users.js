const bcrypt = require("bcrypt");
const { Router } = require("express");

const emailSender = require("../../scripts/email-sender");
const { ensureLoggedIn, ensureHasRole } = require("../auth");

const hexChars = "0123456789abcdef";

const generateHex = length => {
  return Array(length)
    .fill(null)
    .map(() => hexChars[Math.floor(Math.random() * hexChars.length)])
    .join("");
};

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

  router.post(
    "/",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let lastUser = await db
        .collection(collection)
        .findOne({}, { sort: { id: -1 } });
      const resetToken = generateHex(32);
      let newUser = {
        id: (lastUser ? lastUser.id : 0) + 1,
        name: req.body.name,
        username: req.body.username,
        role: req.body.role,
        resetToken
      };
      let dbUsers = await db
        .collection(collection)
        .find({ username: newUser.username })
        .toArray();
      if (dbUsers.length > 0) {
        res.sendStatus(422);
      } else {
        let userInsertCommand = await db
          .collection(collection)
          .insertOne(newUser);
        if (userInsertCommand.result.ok === 1) {
          let users = await db
            .collection(collection)
            .find(
              {},
              {
                projection: {
                  _id: 0,
                  username: 1,
                  role: 1,
                  name: 1,
                  id: 1
                }
              }
            )
            .toArray();
          emailSender.send("reset-password", [newUser.username], {
            resetToken
          });
          res.json(users);
        } else {
          res.sendStatus(422);
        }
      }
    }
  );
  return router;
};
