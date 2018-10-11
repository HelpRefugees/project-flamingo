module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:jest/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    "no-console": 1,
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true
      }
    ],
    "object-curly-spacing": ["error", "always"],
    "operator-linebreak": ["error", "before"],
    "prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: true
      }
    ]
  }
};
