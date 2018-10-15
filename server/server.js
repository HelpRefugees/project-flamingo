const debug = require("debug")("server");
const http = require("http");

const databaseUrl
  = process.env.DATABASE_URL || "mongodb://localhost:27017/flamingo";
const port = normalizePort(process.env.PORT || "3000");

const db = require("./db");

let server;

db.connect(
  databaseUrl,
  (err, connection) => {
    if (err) {
      debug("Unable to connect to Mongo", err);
      return process.exit(1);
    }

    let app = require("./app")(connection);
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

process.on("SIGINT", () => {
  db.close();
});
