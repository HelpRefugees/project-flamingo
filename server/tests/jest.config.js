module.exports = {
  coverageDirectory: "../coverage",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/migrations/**",
    "!**/static/**",
    "!**/tests/**"
  ],
  testRegex: ".*.test.js",
  testEnvironment: "./tests/mongo-environment.js",
  globals: {
    DATABASE_URL: "mongodb://localhost:27017/test",
    DATABASE: null
  },
  rootDir: ".."
};
