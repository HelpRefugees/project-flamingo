const { MongoClient } = require("mongodb");

const state = {
  db: null,
  connection: null
};

exports.connect = function(url, callback = () => {}) {
  if (state.db) {
    callback(null, state.db);
    return Promise.resolve(state.db);
  }

  return MongoClient.connect(
    url,
    {
      useNewUrlParser: true
    }
  )
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
};

exports.close = function(callback = () => {}) {
  if (!state.connection) {
    return Promise.resolve();
  }
  return state.connection.close(err => {
    state.connection = null;
    state.db = null;
    callback(err);
  });
};
