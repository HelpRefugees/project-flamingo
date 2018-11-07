const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");

const { configureAuth } = require("./auth");

const infoRouter = require("./routes/info");
const loginRouterFactory = require("./routes/login");
const passwordRouterFactory = require("./routes/password");
const grantsRouterFactory = require("./routes/grants");
const reportsRouterFactory = require("./routes/reports");

const appFactory = (db, sessionStoreProvider) => {
  const app = express();
  const API_ROOT_PATH = "/api";

  app.use(express.json());
  app.use(morgan("dev"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const sessionSettings = {
    cookie: {},
    resave: false,
    saveUninitialized: true,
    secret: "randomsecret" || process.env.SESSION_SECRET,
    store: sessionStoreProvider(session)
  };

  if (app.get("env") === "production") {
    app.enable("trust proxy");
    sessionSettings.cookie.secure = true;
    app.use("*", httpsOnly);
  }

  app.use(`${API_ROOT_PATH}/info`, infoRouter);

  app.use(session(sessionSettings));

  configureAuth(app, db);

  app.use(`${API_ROOT_PATH}/login`, loginRouterFactory(db));
  app.use(`${API_ROOT_PATH}/password`, passwordRouterFactory(db));
  app.use(`${API_ROOT_PATH}/grants`, grantsRouterFactory(db));
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

const httpsOnly = (req, res, next) => {
  if (!req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  next();
};

module.exports = appFactory;
