module.exports = {
  extends: ["../.eslintrc.js", "plugin:flowtype/recommended", "react-app"],
  plugins: ["flowtype"],
  rules: {
    "flowtype/no-types-missing-file-annotation": 0
  }
};
