const express = require("express");
const path = require("path");

const router = require("./router");

const app = express();
const API_ROOT_PATH = "/api";
app.use(express.json());

app.use(API_ROOT_PATH, router);

app.use(express.static(path.join(__dirname, "static")));

app.get("*", (req, res, next) => {
  if (req.url.startsWith(API_ROOT_PATH)) {
    return next();
  }
  res.sendFile(path.join(__dirname, "static/index.html"));
});

module.exports = app;
