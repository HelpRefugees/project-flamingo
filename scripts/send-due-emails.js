#! /usr/bin/env node

/* eslint-disable no-console */

const emailSender = require("./email-sender");

const ReportFinder = require("./report-finder");
const { getDatabaseUrl } = require("./utils");

const reportFinder = new ReportFinder(getDatabaseUrl());

// const grantName = { grant: "Eslam Grant" };
// emailSender.send(
//   "report-due",
//   [{ owner: "eslam.elsayed-ibrahim@vodafone.com" }],
//   grantName
// );
// sendIT = (task, recep, obj) => emailSender.send(task, recep, obj);
// sendIT("report-due", ["eslam.elsayed-ibrahim@vodafone.com"], grantName);

reportFinder
  .due()
  .then(reports =>
    reports.map(report => ({ owner: report.owner, grant: report.grant }))
  )
  .then(modifiedReports =>
    Promise.all(
      modifiedReports.map(report => {
        console.log("emailed first", report.owner, "****", report.grant);
        // const grantName = { grant: report.grant };
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

// reportFinder
//   .due()
//   .then(reports => reports.map(report => report.owner))
//   .then(recipients =>
//     emailSender.send("report-due", recipients).then(() => recipients)
//   )
//   .then(recipients => {
//     console.log("emailed", recipients);
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });
