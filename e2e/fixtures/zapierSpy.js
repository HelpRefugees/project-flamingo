#! /usr/bin/env node

const express = require("express");
const morgan = require("morgan");

const app = express();

let calls = [];

app.use(morgan("dev"));
app.use(express.json());

app.delete("/_calls", (req, res) => {
  calls = [];
  return res.sendStatus(204);
});

app.get("/_calls", (req, res) => {
  res.json(calls);
});

app.post("/", (req, res) => {
  calls.push(req.body);
  return res.sendStatus(200);
});

app.listen(process.env.PORT);
