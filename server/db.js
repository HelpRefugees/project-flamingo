const { MongoClient } = require("mongodb");

const state = {
  connection: null
};

exports.connect = function(url, callback = () => {}) {
  if (state.connection) {
    callback(null, state.connection);
    return Promise.resolve(state.connection);
  }

  return MongoClient.connect(url)
    .then(connection => {
      state.connection = connection;
      callback(null, connection);
      return connection;
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
    callback(err);
  });
};
