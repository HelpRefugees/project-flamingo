#! /usr/bin/env node

/* eslint-disable no-console */

const emailSender = require("./email-sender");
const ReportFinder = require("./report-finder");
const { getDatabaseUrl } = require("./utils");

const reportFinder = new ReportFinder(getDatabaseUrl());

reportFinder
  .due()
  .then(reports => reports.map(report => report.owner))
  .then(recipients =>
    emailSender.send("report-due", recipients).then(() => recipients)
  )
  .then(recipients => {
    console.log("emailed", recipients);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
