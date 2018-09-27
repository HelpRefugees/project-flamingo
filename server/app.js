const express = require("express");
const path = require("path");

const app = express();
const API_ROOT_PATH = "/api";
app.use(express.json());

app.post(`${API_ROOT_PATH}/login`, (req, res) => {
  if (
    req.body.username === "ellen@ip.org"
    && req.body.password === "flamingo"
  ) {
    return res.sendStatus(200);
  }

  return res.sendStatus(401);
});

app.use(express.static(path.join(__dirname, "static")));

app.get("*", (req, res, next) => {
  if (req.url.startsWith(API_ROOT_PATH)) {
    return next();
  }
  res.sendFile(path.join(__dirname, "static/index.html"));
});

module.exports = app;
