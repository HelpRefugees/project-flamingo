#! /usr/bin/env node

const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.post("*", (req, res) => res.sendStatus(200));

app.listen(process.env.PORT);
