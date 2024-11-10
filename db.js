const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//sqlite db file
const dbPath = path.resolve(__dirname, 'database.sqlite');

//initialize and connect to db
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

module.exports = db;