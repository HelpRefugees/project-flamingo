const NodeEnvironment = require("jest-environment-node");
const { MongoClient } = require("mongodb");

module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }
  async setup() {
    const connection = await MongoClient.connect(this.global.DATABASE_URL);
    this.global.__MONGO_CONNECTION__ = connection;
    this.global.__MONGO_DB__ = await connection.db();

    await super.setup();
  }

  async teardown() {
    await this.global.__MONGO_CONNECTION__.close();
    await super.teardown();
  }
};
