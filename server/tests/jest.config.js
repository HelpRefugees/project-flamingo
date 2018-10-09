module.exports = {
  testRegex: ".*.test.js",
  testEnvironment: "./mongo-environment.js",
  globals: {
    DATABASE_URL: "mongodb://localhost:27017/test"
  },
  roots: [".."]
};
