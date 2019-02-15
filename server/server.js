const connectMongo = require("connect-mongo");
const debug = require("debug")("server");
const http = require("http");

const { getDatabaseUrl } = require("../scripts/utils");

const port = normalizePort(process.env.PORT || "3000");

const dbModule = require("./db");
const appFactory = require("./app");
let server;

dbModule.connect(
  getDatabaseUrl(),
  (err, db) => {
    if (err) {
      debug("Unable to connect to Mongo", err);
      return process.exit(1);
    }

    let app = appFactory(db, session => {
      const MongoStore = connectMongo(session);
      return new MongoStore({ db, collection: "_sessions" });
    });
    app.set("port", port);

    server = http.createServer(app);
    server.listen(port);
    server.on("listening", onListening);
  }
);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

function shutdown() {
  Promise.all([dbModule.close()])
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
