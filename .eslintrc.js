module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:jest/recommended", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true
      }
    ],
    "prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: true
      }
    ],
    "prettier/prettier": "error"
  }
};
