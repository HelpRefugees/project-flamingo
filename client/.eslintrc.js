module.exports = {
  extends: ["../.eslintrc.js", "plugin:flowtype/recommended", "plugin:jest/recommended", "react-app"],
  plugins: ["flowtype"],
  rules: {
    "flowtype/no-types-missing-file-annotation": 0
  },
  globals: {
    mountWithProvider: true
  },
  settings: {
    react: {
      version: "16.12"
    }
  }
};
