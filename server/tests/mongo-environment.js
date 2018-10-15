const NodeEnvironment = require("jest-environment-node");
const db = require("../db");

module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }
  async setup() {
    this.global.CONNECTION = await db.connect(this.global.DATABASE_URL);
    this.global.DATABASE = await this.global.CONNECTION.db();
    await super.setup();
  }

  async teardown() {
    await db.close();
    await super.teardown();
  }
};
