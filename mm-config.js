module.exports = {
  url: process.env.DATABASE_URL || "mongodb://localhost:27017/flamingo",
  directory: "./server/migrations"
};
