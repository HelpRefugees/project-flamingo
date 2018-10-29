#! /usr/bin/env node

/* eslint-disable no-console */

const reportGenerator = require("./reports-generator");
const { getDatabaseUrl } = require("./utils");

reportGenerator(getDatabaseUrl())
  .then(insertedDocumentCount => {
    console.log(`generated ${insertedDocumentCount} reports`);
    process.exit(0);
  })
  .catch(err => {
    console.err(err);
    process.exit(1);
  });
