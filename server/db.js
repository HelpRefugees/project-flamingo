const { MongoClient } = require("mongodb");

const state = {
  db: null,
  connection: null
};

module.exports = {
  connect: (url, callback = () => {}) => {
    if (state.db) {
      callback(null, state.db);
      return Promise.resolve(state.db);
    }

    return MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(connection => {
        state.connection = connection;
        return connection.db();
      })
      .then(db => {
        state.db = db;
        callback(null, db);
        return db;
      })
      .catch(err => {
        callback(err);
        throw err;
      });
  },
  close: (callback = () => {}) => {
    if (!state.connection) {
      callback();
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      state.connection.close(err => {
        state.connection = null;
        state.db = null;
        if (err) {
          callback(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
