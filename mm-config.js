const { getDatabaseUrl } = require("./scripts/utils");

module.exports = {
  url: getDatabaseUrl(),
  directory: "./server/migrations"
};
