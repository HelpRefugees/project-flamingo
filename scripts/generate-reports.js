#! /usr/bin/env node

const reportGenerator = require("./reports-generator");
const databaseUrl
  = process.env.DATABASE_URL || "mongodb://localhost:27017/flamingo";

reportGenerator(databaseUrl)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
