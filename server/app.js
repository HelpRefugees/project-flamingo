const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");

const loginRouterFactory = require("./routes/login");
const reportsRouterFactory = require("./routes/reports");

const appFactory = db => {
  const app = express();
  const API_ROOT_PATH = "/api";
  app.use(express.json());
  app.use(morgan("dev"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(passport.initialize());

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
