const NodeEnvironment = require("jest-environment-node");
const dbModule = require("../db");

module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }
  async setup() {
    await super.setup();
    this.global.DATABASE = await dbModule.connect(this.global.DATABASE_URL);
  }

  async teardown() {
    await dbModule.close();
    await super.teardown();
  }
};
