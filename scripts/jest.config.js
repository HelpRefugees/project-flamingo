module.exports = {
  testRegex: ".*.test.js",
  testEnvironment: "../server/tests/mongo-environment.js",
  globals: {
    DATABASE_URL: "mongodb://localhost:27017/scripts"
  },
  roots: ["."]
};
