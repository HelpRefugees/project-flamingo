const express = require("express");
const path = require("path");
const morgan = require("morgan");

const routerFactory = require("./router");
const appFactory = connection => {
  const app = express();
  const API_ROOT_PATH = "/api";
  app.use(express.json());
  app.use(morgan("dev"));

  app.use(API_ROOT_PATH, routerFactory(connection));

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
