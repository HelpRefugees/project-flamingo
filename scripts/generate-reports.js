#! /usr/bin/env node

/* eslint-disable no-console */

const reportGenerator = require("./reports-generator");
const databaseUrl
  = process.env.DATABASE_URL || "mongodb://localhost:27017/flamingo";

reportGenerator(databaseUrl)
  .then(insertedDocumentCount => {
    console.log(`generated ${insertedDocumentCount} reports`);
    process.exit(0);
  })
  .catch(err => {
    console.err(err);
    process.exit(1);
  });
