#! /usr/bin/env node

/* eslint-disable no-console */

const bcrypt = require("bcrypt");

const password = process.argv[2];

bcrypt
  .genSalt()
  .then(salt => bcrypt.hash(password, salt))
  .then(hash => {
    console.log(`Hashed ${password} to ${hash}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
