#! /usr/bin/env node

/* eslint-disable no-console */

const emailSender = require("./email-sender");

const ReportFinder = require("./report-finder");
const { getDatabaseUrl } = require("./utils");

const reportFinder = new ReportFinder(getDatabaseUrl());

reportFinder
  .due()
  .then(reports =>
    reports.map(report => ({ owner: report.owner, grant: report.grant }))
  )
  .then(modifiedReports =>
    Promise.all(
      modifiedReports.map(report => {
        console.log("emailed first", report.owner, "****", report.grant);
        return emailSender.send("report-due", [report.owner], {
          grant: report.grant
        });
      })
    )
  )
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
