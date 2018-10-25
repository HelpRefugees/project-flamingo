const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");

const { configureAuth } = require("./auth");

const loginRouterFactory = require("./routes/login");
const reportsRouterFactory = require("./routes/reports");

const appFactory = (db, sessionStoreProvider) => {
  const app = express();
  const API_ROOT_PATH = "/api";

  app.use(express.json());
  app.use(morgan("dev"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "randomsecret",
      resave: false,
      saveUninitialized: true,
      store: sessionStoreProvider(session)
    })
  );

  configureAuth(app, db);

  app.use(`${API_ROOT_PATH}/login`, loginRouterFactory(db));
  app.use(`${API_ROOT_PATH}/reports`, reportsRouterFactory(db));

  app.use(express.static(path.join(__dirname, "static")));

  app.get("*", (req, res, next) => {
    if (req.url.startsWith(API_ROOT_PATH)) {
      return next();
    }
    res.sendFile(path.join(__dirname, "static/index.html"));
  });

  return app;
};

module.exports = appFactory;
