module.exports = {
  extends: ["../../.eslintrc.js", "plugin:jest/recommended"],
  globals: {
    DATABASE_URL: false
  },
  rules: {
    "no-console": "off"
  }
};
