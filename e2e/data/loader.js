/* eslint-disable no-console */
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

function readJsonFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, content) => {
      if (err) {
        console.error("readFile error: ", err);
        reject(err);
      } else {
        resolve(JSON.parse(content));
      }
    });
  });
}

function mongo() {
  return MongoClient.connect("mongodb://localhost:27017").then(client =>
    client.db("flamingo")
  );
}

function clearReports(db) {
  return new Promise(resolve => {
    db.collection("reports")
      .drop()
      .then(() => {
        resolve();
      })
      .catch(() => {
        resolve();
      });
  });
}

function seed(db, seedFile) {
  return readJsonFile(seedFile)
    .then(content =>
      Object.keys(content).map(collection => {
        const rows = content[collection];
        const now = new Date();
        rows.forEach(
          (row, index) => (row.created = new Date(now.getTime() + 1000 * index))
        );
        return db.collection(collection).insertMany(rows);
      })
    )
    .then(promises => Promise.all(promises));
}

function databaseAction(func, ...args) {
  return db => func(db, ...args).then(() => db);
}

mongo()
  .then(databaseAction(clearReports))
  .then(databaseAction(seed, process.argv[2]))
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
