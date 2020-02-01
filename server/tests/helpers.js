const bcrypt = require("bcrypt");

module.exports = {
  hashPassword: password => bcrypt.hashSync(password, bcrypt.genSaltSync()),
  safeDrop: async collection => {
    try {
      await global.DATABASE.collection(collection).drop();
    } catch (err) {
      /* pass */
    }
  }
};
