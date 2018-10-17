const NodeEnvironment = require("jest-environment-node");
const dbModule = require("../db");

module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }
  async setup() {
    this.global.DATABASE = await dbModule.connect(this.global.DATABASE_URL);
    await super.setup();
  }

  async teardown() {
    await dbModule.close();
    await super.teardown();
  }
};
