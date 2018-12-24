/* eslint-disable no-console */
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

const { getDatabaseUrl } = require("../../scripts/utils");

const defaultUsers = [
  {
    id: 1,
    username: "ellen@ip.org",
    role: "implementing-partner",
    name: "Ellen Smith",
    grant: "Grant Mitchell",
    password: "$2b$10$TVA4ZBXoheEKSlwUaBUb5OeF.fbayvTuCPnatKB/CzxGGgfFra9w2"
  },
  {
    id: 2,
    username: "daisy@hr.org",
    role: "help-refugees",
    name: "Daisy Jones",
    password: "$2b$10$lcgKUBTrTjHWLC7w1dHrJupwgygR2o9MDQS7nDXW2NedOj.h.DE4q"
  },
  {
    id: 3,
    username: "helen@ip.org",
    role: "implementing-partner",
    grant: "Hugh Grant",
    name: "Helen Brown",
    password: "$2b$10$YSikur80H09Epol1sYboHOH6v9ypMVH6bbqYOZG89CaI/HUKXKAoC"
  }
];

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
  return MongoClient.connect(getDatabaseUrl()).then(client => client.db());
}

function clear(db, collection) {
  return new Promise(resolve => {
    db.collection(collection)
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
    .then(content => {
      const promises = [];
      let setUsers = false;
      Object.keys(content).forEach(collection => {
        const rows = content[collection];
        if (collection === "users") {
          setUsers = true;
        }
        const now = new Date();
        rows.forEach(
          (row, index) => (row.created = new Date(now.getTime() + 1000 * index))
        );

        promises.push(db.collection(collection).insertMany(rows));
      });

      if (!setUsers) {
        promises.push(db.collection("users").insertMany(defaultUsers));
      }
      return promises;
    })
    .then(promises => Promise.all(promises));
}

function databaseAction(func, ...args) {
  return db => func(db, ...args).then(() => db);
}

mongo()
  .then(databaseAction(clear, "reports"))
  .then(databaseAction(clear, "users"))
  .then(databaseAction(seed, process.argv[2]))
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
